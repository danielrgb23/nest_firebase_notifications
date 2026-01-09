import { NotificationEntity, NotificationTarget, NotificationResult } from '../entities/notification.entity';

/**
 * Interface para o serviço de notificações
 * Define os contratos para envio de notificações via Firebase Cloud Messaging
 */
export interface INotificationService {
  /**
   * Envia notificação para todos os usuários registrados
   * @param notification - Notificação a ser enviada
   * @returns Promise<NotificationResult> - Resultado do envio
   */
  sendToAll(notification: NotificationEntity): Promise<NotificationResult>;

  /**
   * Envia notificação para um usuário específico
   * @param notification - Notificação a ser enviada
   * @param token - Token FCM do dispositivo do usuário
   * @returns Promise<NotificationResult> - Resultado do envio
   */
  sendToUser(notification: NotificationEntity, token: string): Promise<NotificationResult>;

  /**
   * Envia notificação para um tópico específico
   * @param notification - Notificação a ser enviada
   * @param topic - Nome do tópico
   * @returns Promise<NotificationResult> - Resultado do envio
   */
  sendToTopic(notification: NotificationEntity, topic: string): Promise<NotificationResult>;

  /**
   * Envia notificação baseada no alvo especificado
   * @param notification - Notificação a ser enviada
   * @param target - Alvo da notificação (all, single, topic)
   * @returns Promise<NotificationResult> - Resultado do envio
   */
  send(notification: NotificationEntity, target: NotificationTarget): Promise<NotificationResult>;

  /**
   * Inscreve um dispositivo em um tópico
   * @param token - Token FCM do dispositivo
   * @param topic - Nome do tópico
   * @returns Promise<boolean> - Sucesso da operação
   */
  subscribeToTopic(token: string, topic: string): Promise<boolean>;

  /**
   * Remove inscrição de um dispositivo em um tópico
   * @param token - Token FCM do dispositivo
   * @param topic - Nome do tópico
   * @returns Promise<boolean> - Sucesso da operação
   */
  unsubscribeFromTopic(token: string, topic: string): Promise<boolean>;
}