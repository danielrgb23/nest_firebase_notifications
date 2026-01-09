import { Injectable, Inject } from '@nestjs/common';
import type { INotificationService, NotificationTarget } from '../../domain';
import { NotificationEntity } from '../../domain';
import { CreateNotificationDto, NotificationResponseDto, SendNotificationDto } from '../dto/notification.dto';

/**
 * Caso de uso para envio de notificações
 * Coordena a lógica de negócio para diferentes tipos de envio
 */
@Injectable()
export class SendNotificationUseCase {
  constructor(
    @Inject('INotificationService')
    private readonly notificationService: INotificationService,
  ) {}

  /**
   * Executa o envio de notificação baseado no DTO fornecido
   */
  async execute(dto: SendNotificationDto): Promise<NotificationResponseDto> {
    // Cria a entidade de notificação
    const notification = NotificationEntity.create(
      dto.notification.title,
      dto.notification.body,
      dto.notification.data,
      dto.notification.imageUrl,
      dto.notification.icon,
      dto.notification.sound,
    );

    // Define o alvo da notificação
    const target: NotificationTarget = {
      type: dto.targetType,
      value: dto.targetValue,
    };

    // Envia a notificação
    const result = await this.notificationService.send(notification, target);

    // Retorna o DTO de resposta
    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      target: {
        type: result.target.type,
        value: result.target.value,
      },
    };
  }

  /**
   * Envia notificação para todos os usuários
   */
  async sendToAll(notificationDto: CreateNotificationDto): Promise<NotificationResponseDto> {
    const notification = NotificationEntity.create(
      notificationDto.title,
      notificationDto.body,
      notificationDto.data,
      notificationDto.imageUrl,
      notificationDto.icon,
      notificationDto.sound,
    );

    const result = await this.notificationService.sendToAll(notification);

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      target: {
        type: result.target.type,
        value: result.target.value,
      },
    };
  }

  /**
   * Envia notificação para um usuário específico
   */
  async sendToUser(notificationDto: CreateNotificationDto, token: string): Promise<NotificationResponseDto> {
    const notification = NotificationEntity.create(
      notificationDto.title,
      notificationDto.body,
      notificationDto.data,
      notificationDto.imageUrl,
      notificationDto.icon,
      notificationDto.sound,
    );

    const result = await this.notificationService.sendToUser(notification, token);

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      target: {
        type: result.target.type,
        value: result.target.value,
      },
    };
  }

  /**
   * Envia notificação para um tópico específico
   */
  async sendToTopic(notificationDto: CreateNotificationDto, topic: string): Promise<NotificationResponseDto> {
    const notification = NotificationEntity.create(
      notificationDto.title,
      notificationDto.body,
      notificationDto.data,
      notificationDto.imageUrl,
      notificationDto.icon,
      notificationDto.sound,
    );

    const result = await this.notificationService.sendToTopic(notification, topic);

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      target: {
        type: result.target.type,
        value: result.target.value,
      },
    };
  }
}