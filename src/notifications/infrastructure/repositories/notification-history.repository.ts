import { Injectable } from '@nestjs/common';
import { NotificationHistoryEntity, NotificationStats } from '../../domain';

/**
 * Repositório em memória para armazenar histórico de notificações
 * Em produção, isso seria substituído por um banco de dados real
 */
@Injectable()
export class NotificationHistoryRepository {
  private readonly history: NotificationHistoryEntity[] = [];

  /**
   * Salva uma notificação no histórico
   */
  async save(notification: NotificationHistoryEntity): Promise<void> {
    this.history.push(notification);
  }

  /**
   * Busca todas as notificações do histórico
   */
  async findAll(limit = 50, offset = 0): Promise<NotificationHistoryEntity[]> {
    return this.history
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime()) // Mais recentes primeiro
      .slice(offset, offset + limit);
  }

  /**
   * Busca notificações por tipo de alvo
   */
  async findByTargetType(targetType: 'all' | 'single' | 'topic', limit = 20): Promise<NotificationHistoryEntity[]> {
    return this.history
      .filter(item => item.target.type === targetType)
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
      .slice(0, limit);
  }

  /**
   * Busca notificações de teste
   */
  async findTestNotifications(limit = 20): Promise<NotificationHistoryEntity[]> {
    return this.history
      .filter(item => item.testMode === true)
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
      .slice(0, limit);
  }

  /**
   * Busca notificações por período
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<NotificationHistoryEntity[]> {
    return this.history
      .filter(item => item.sentAt >= startDate && item.sentAt <= endDate)
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
  }

  /**
   * Gera estatísticas das notificações
   */
  async getStats(): Promise<NotificationStats> {
    const totalSent = this.history.length;
    const totalSuccessful = this.history.filter(item => item.result.success).length;
    const totalFailed = totalSent - totalSuccessful;

    const byType = {
      all: this.history.filter(item => item.target.type === 'all').length,
      single: this.history.filter(item => item.target.type === 'single').length,
      topic: this.history.filter(item => item.target.type === 'topic').length,
    };

    const recentActivity = await this.findAll(10, 0);

    return {
      totalSent,
      totalSuccessful,
      totalFailed,
      byType,
      recentActivity,
    };
  }

  /**
   * Limpa todo o histórico (útil para testes)
   */
  async clear(): Promise<void> {
    this.history.length = 0;
  }

  /**
   * Conta total de notificações
   */
  async count(): Promise<number> {
    return this.history.length;
  }
}