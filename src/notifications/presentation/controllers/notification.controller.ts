import { Controller, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { SendNotificationUseCase, TopicManagementUseCase } from '../../application';
import { CreateNotificationDto, SendNotificationDto, TopicManagementDto, NotificationResponseDto } from '../../application';

/**
 * Controller REST para gerenciamento de notificações
 * Fornece endpoints para envio de notificações e gerenciamento de tópicos
 */
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly topicManagementUseCase: TopicManagementUseCase,
  ) {}

  /**
   * POST /notifications/send
   * Envia uma notificação baseada no tipo de alvo especificado
   */
  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendNotification(@Body() dto: SendNotificationDto): Promise<NotificationResponseDto> {
    return this.sendNotificationUseCase.execute(dto);
  }

  /**
   * POST /notifications/send-all
   * Envia notificação para todos os usuários registrados
   */
  @Post('send-all')
  @HttpCode(HttpStatus.OK)
  async sendToAll(@Body() notificationDto: CreateNotificationDto): Promise<NotificationResponseDto> {
    return this.sendNotificationUseCase.sendToAll(notificationDto);
  }

  /**
   * POST /notifications/send-user/:token
   * Envia notificação para um usuário específico
   */
  @Post('send-user/:token')
  @HttpCode(HttpStatus.OK)
  async sendToUser(
    @Param('token') token: string,
    @Body() notificationDto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    return this.sendNotificationUseCase.sendToUser(notificationDto, token);
  }

  /**
   * POST /notifications/send-topic/:topic
   * Envia notificação para um tópico específico
   */
  @Post('send-topic/:topic')
  @HttpCode(HttpStatus.OK)
  async sendToTopic(
    @Param('topic') topic: string,
    @Body() notificationDto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    return this.sendNotificationUseCase.sendToTopic(notificationDto, topic);
  }

  /**
   * POST /notifications/topics/subscribe
   * Inscreve um dispositivo em um tópico
   */
  @Post('topics/subscribe')
  @HttpCode(HttpStatus.OK)
  async subscribeToTopic(@Body() dto: TopicManagementDto): Promise<{ success: boolean; error?: string }> {
    return this.topicManagementUseCase.subscribeToTopic(dto.token, dto.topic);
  }

  /**
   * POST /notifications/topics/unsubscribe
   * Remove inscrição de um dispositivo em um tópico
   */
  @Post('topics/unsubscribe')
  @HttpCode(HttpStatus.OK)
  async unsubscribeFromTopic(@Body() dto: TopicManagementDto): Promise<{ success: boolean; error?: string }> {
    return this.topicManagementUseCase.unsubscribeFromTopic(dto.token, dto.topic);
  }
}