import { Injectable, Inject } from '@nestjs/common';
import type { INotificationService } from '../../domain';

/**
 * Caso de uso para gerenciamento de tópicos
 * Coordena a lógica de negócio para inscrição/cancelamento em tópicos
 */
@Injectable()
export class TopicManagementUseCase {
  constructor(
    @Inject('INotificationService')
    private readonly notificationService: INotificationService,
  ) {}

  /**
   * Inscreve um dispositivo em um tópico
   */
  async subscribeToTopic(token: string, topic: string): Promise<{ success: boolean; error?: string }> {
    try {
      const success = await this.notificationService.subscribeToTopic(token, topic);
      return {
        success,
        error: success ? undefined : 'Falha ao inscrever no tópico',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro interno ao gerenciar tópico',
      };
    }
  }

  /**
   * Remove inscrição de um dispositivo em um tópico
   */
  async unsubscribeFromTopic(token: string, topic: string): Promise<{ success: boolean; error?: string }> {
    try {
      const success = await this.notificationService.unsubscribeFromTopic(token, topic);
      return {
        success,
        error: success ? undefined : 'Falha ao remover inscrição do tópico',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro interno ao gerenciar tópico',
      };
    }
  }
}