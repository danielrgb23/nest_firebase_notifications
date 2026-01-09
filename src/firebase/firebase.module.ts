import { Module } from '@nestjs/common';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [NotificationModule],
  exports: [NotificationModule],
})
export class FirebaseModule {}
