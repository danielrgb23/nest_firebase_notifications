import { Module } from '@nestjs/common';
import { NotificationController } from './presentation';
import { SendNotificationUseCase, TopicManagementUseCase } from './application';
import { FirebaseNotificationService } from './infrastructure';
import { FirebaseConfig } from './infrastructure';
import { NotificationHistoryRepository } from './infrastructure/repositories/notification-history.repository';

/**
 * Módulo principal do serviço de notificações
 * Organiza todas as camadas seguindo Clean Architecture
 */
@Module({
  controllers: [NotificationController],
  providers: [
    // Infrastructure Layer
    FirebaseConfig,
    NotificationHistoryRepository,
    {
      provide: 'INotificationService',
      useClass: FirebaseNotificationService,
    },

    // Application Layer
    SendNotificationUseCase,
    TopicManagementUseCase,
  ],
  exports: [
    SendNotificationUseCase,
    TopicManagementUseCase,
    'INotificationService',
  ],
})
export class NotificationModule {}