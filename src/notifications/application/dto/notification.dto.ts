import { IsString, IsOptional, IsObject, IsNotEmpty } from 'class-validator';

/**
 * DTO para criação de notificações
 */
export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  sound?: string;
}

/**
 * DTO para envio de notificações
 */
export class SendNotificationDto {
  @IsNotEmpty()
  notification: CreateNotificationDto;

  @IsString()
  @IsNotEmpty()
  targetType: 'all' | 'single' | 'topic';

  @IsOptional()
  @IsString()
  targetValue?: string; // token para single, topic name para topic
}

/**
 * DTO para gerenciamento de tópicos
 */
export class TopicManagementDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  topic: string;
}

/**
 * DTO de resposta para resultados de notificação
 */
export class NotificationResponseDto {
  success: boolean;
  messageId?: string;
  error?: string;
  target: {
    type: 'all' | 'single' | 'topic';
    value?: string;
  };
}