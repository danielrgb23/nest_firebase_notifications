/**
 * Entidade que representa o histórico de notificações enviadas
 */
export class NotificationHistoryEntity {
  constructor(
    public readonly id: string,
    public readonly notificationId: string,
    public readonly title: string,
    public readonly body: string,
    public readonly target: {
      type: 'all' | 'single' | 'topic';
      value?: string;
    },
    public readonly result: {
      success: boolean;
      messageId?: string;
      error?: string;
    },
    public readonly sentAt: Date,
    public readonly data?: Record<string, any>,
    public readonly testMode?: boolean, // Indica se foi um envio de teste
  ) {}

  /**
   * Cria um novo registro de histórico
   */
  static create(
    notificationId: string,
    title: string,
    body: string,
    target: { type: 'all' | 'single' | 'topic'; value?: string },
    result: { success: boolean; messageId?: string; error?: string },
    data?: Record<string, any>,
    testMode = false,
  ): NotificationHistoryEntity {
    const id = crypto.randomUUID();
    const sentAt = new Date();

    return new NotificationHistoryEntity(
      id,
      notificationId,
      title,
      body,
      target,
      result,
      sentAt,
      data,
      testMode,
    );
  }

  /**
   * Converte para formato de resposta da API
   */
  toResponse() {
    return {
      id: this.id,
      notificationId: this.notificationId,
      title: this.title,
      body: this.body,
      target: this.target,
      result: this.result,
      sentAt: this.sentAt.toISOString(),
      data: this.data,
      testMode: this.testMode,
    };
  }
}

/**
 * Estatísticas de notificações
 */
export interface NotificationStats {
  totalSent: number;
  totalSuccessful: number;
  totalFailed: number;
  byType: {
    all: number;
    single: number;
    topic: number;
  };
  recentActivity: NotificationHistoryEntity[];
}