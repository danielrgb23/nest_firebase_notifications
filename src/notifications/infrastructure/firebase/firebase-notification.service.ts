import { Injectable, Logger, Inject } from '@nestjs/common';
import { INotificationService, NotificationEntity, NotificationTarget, NotificationResult, NotificationHistoryEntity } from '../../domain';
import { FirebaseConfig } from '../config/firebase.config';
import { NotificationHistoryRepository } from '../repositories/notification-history.repository';

/**
 * Implementação do serviço de notificações usando Firebase Cloud Messaging
 */
@Injectable()
export class FirebaseNotificationService implements INotificationService {
  private readonly logger = new Logger(FirebaseNotificationService.name);

  constructor(
    private readonly firebaseConfig: FirebaseConfig,
    @Inject(NotificationHistoryRepository)
    private readonly historyRepository: NotificationHistoryRepository,
  ) {}

  /**
   * Salva uma notificação no histórico
   */
  private async saveToHistory(notification: NotificationEntity, result: NotificationResult): Promise<void> {
    try {
      const historyEntry = NotificationHistoryEntity.create(
        notification.id,
        notification.title,
        notification.body,
        result.target,
        {
          success: result.success,
          messageId: result.messageId,
          error: result.error,
        },
        notification.data,
        false, // testMode
      );

      await this.historyRepository.save(historyEntry);
    } catch (error) {
      this.logger.error(`Erro ao salvar no histórico: ${error.message}`, error.stack);
    }
  }

  /**
   * Envia notificação para todos os usuários registrados
   */
  async sendToAll(notification: NotificationEntity): Promise<NotificationResult> {
    try {
      const message = this.buildMessage(notification, { type: 'all' });

      this.logger.log(`Enviando notificação para todos os usuários: ${notification.title}`);

      const response = await this.firebaseConfig.getMessaging().send(message);

      this.logger.log(`Notificação enviada com sucesso. Message ID: ${response}`);

      const result = {
        success: true,
        messageId: response,
        target: { type: 'all' } as NotificationTarget,
      };

      // Registrar no histórico
      await this.saveToHistory(notification, result);

      return result;
    } catch (error) {
      this.logger.error(`Erro ao enviar notificação para todos: ${error.message}`, error.stack);

      const result = {
        success: false,
        error: error.message,
        target: { type: 'all' } as NotificationTarget,
      };

      // Registrar erro no histórico
      await this.saveToHistory(notification, result);

      return result;
    }
  }

  /**
   * Envia notificação para um usuário específico
   */
  async sendToUser(notification: NotificationEntity, token: string): Promise<NotificationResult> {
    try {
      const message = this.buildMessage(notification, { type: 'single', value: token });

      this.logger.log(`Enviando notificação para usuário específico: ${notification.title}`);

      const response = await this.firebaseConfig.getMessaging().send(message);

      this.logger.log(`Notificação enviada com sucesso. Message ID: ${response}`);

      const result = {
        success: true,
        messageId: response,
        target: { type: 'single', value: token } as NotificationTarget,
      };

      await this.saveToHistory(notification, result);

      return result;
    } catch (error) {
      this.logger.error(`Erro ao enviar notificação para usuário: ${error.message}`, error.stack);

      const result = {
        success: false,
        error: error.message,
        target: { type: 'single', value: token } as NotificationTarget,
      };

      await this.saveToHistory(notification, result);

      return result;
    }
  }

  /**
   * Envia notificação para um tópico específico
   */
  async sendToTopic(notification: NotificationEntity, topic: string): Promise<NotificationResult> {
    try {
      const message = this.buildMessage(notification, { type: 'topic', value: topic });

      this.logger.log(`Enviando notificação para tópico ${topic}: ${notification.title}`);

      const response = await this.firebaseConfig.getMessaging().send(message);

      this.logger.log(`Notificação enviada com sucesso. Message ID: ${response}`);

      return {
        success: true,
        messageId: response,
        target: { type: 'topic', value: topic },
      };
    } catch (error) {
      this.logger.error(`Erro ao enviar notificação para tópico ${topic}: ${error.message}`, error.stack);

      return {
        success: false,
        error: error.message,
        target: { type: 'topic', value: topic },
      };
    }
  }

  /**
   * Envia notificação baseada no alvo especificado
   */
  async send(notification: NotificationEntity, target: NotificationTarget): Promise<NotificationResult> {
    switch (target.type) {
      case 'all':
        return this.sendToAll(notification);
      case 'single':
        if (!target.value) {
          throw new Error('Token é obrigatório para envio para usuário específico');
        }
        return this.sendToUser(notification, target.value);
      case 'topic':
        if (!target.value) {
          throw new Error('Nome do tópico é obrigatório para envio para tópico');
        }
        return this.sendToTopic(notification, target.value);
      default:
        throw new Error(`Tipo de alvo não suportado: ${target.type}`);
    }
  }

  /**
   * Inscreve um dispositivo em um tópico
   */
  async subscribeToTopic(token: string, topic: string): Promise<boolean> {
    try {
      this.logger.log(`Inscrevendo dispositivo ${token} no tópico ${topic}`);

      await this.firebaseConfig.getMessaging().subscribeToTopic(token, topic);

      this.logger.log(`Dispositivo inscrito com sucesso no tópico ${topic}`);

      return true;
    } catch (error) {
      this.logger.error(`Erro ao inscrever dispositivo no tópico ${topic}: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Remove inscrição de um dispositivo em um tópico
   */
  async unsubscribeFromTopic(token: string, topic: string): Promise<boolean> {
    try {
      this.logger.log(`Removendo inscrição do dispositivo ${token} do tópico ${topic}`);

      await this.firebaseConfig.getMessaging().unsubscribeFromTopic(token, topic);

      this.logger.log(`Inscrição removida com sucesso do tópico ${topic}`);

      return true;
    } catch (error) {
      this.logger.error(`Erro ao remover inscrição do dispositivo do tópico ${topic}: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Constrói a mensagem FCM baseada na notificação e no alvo
   */
  private buildMessage(notification: NotificationEntity, target: NotificationTarget) {
    const message: any = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
    };

    // Adiciona campos opcionais se existirem
    if (notification.imageUrl) {
      message.notification.imageUrl = notification.imageUrl;
    }

    if (notification.icon) {
      message.notification.icon = notification.icon;
    }

    // Adiciona dados customizados se existirem
    if (notification.data) {
      message.data = Object.fromEntries(
        Object.entries(notification.data).map(([key, value]) => [key, String(value)])
      );
    }

    // Configura o alvo da mensagem
    switch (target.type) {
      case 'all':
        message.topic = 'all';
        break;
      case 'single':
        message.token = target.value;
        break;
      case 'topic':
        message.topic = target.value;
        break;
    }

    // Configurações adicionais para Android
    message.android = {
      priority: 'high',
      notification: {
        sound: notification.sound || 'default',
        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
      },
    };

    // Configurações adicionais para iOS
    message.apns = {
      payload: {
        aps: {
          sound: notification.sound || 'default',
          badge: 1,
        },
      },
    };

    return message;
  }
}