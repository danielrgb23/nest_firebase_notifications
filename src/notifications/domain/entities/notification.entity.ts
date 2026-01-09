/**
 * Entidade que representa uma notificação
 */
export class NotificationEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly body: string,
    public readonly data?: Record<string, any>,
    public readonly imageUrl?: string,
    public readonly icon?: string,
    public readonly sound?: string,
  ) {}

  /**
   * Cria uma nova notificação com ID gerado automaticamente
   */
  static create(
    title: string,
    body: string,
    data?: Record<string, any>,
    imageUrl?: string,
    icon?: string,
    sound?: string,
  ): NotificationEntity {
    const id = crypto.randomUUID();
    return new NotificationEntity(id, title, body, data, imageUrl, icon, sound);
  }
}

/**
 * Tipos de destinatários para notificações
 */
export type NotificationTargetType = 'all' | 'single' | 'topic';

/**
 * Interface que define um alvo de notificação
 */
export interface NotificationTarget {
  type: NotificationTargetType;
  value?: string; // token para single, topic name para topic
}

/**
 * Resultado do envio de uma notificação
 */
export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  target: NotificationTarget;
}