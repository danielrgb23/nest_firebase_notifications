/**
 * EXEMPLOS DE USO DO SERVIÇO DE NOTIFICAÇÕES
 *
 * Este arquivo contém exemplos práticos de como utilizar o serviço
 * de notificações em diferentes cenários de negócio.
 */

import { Injectable } from '@nestjs/common';
import { SendNotificationUseCase, TopicManagementUseCase } from '../application';
import { CreateNotificationDto } from '../application';

@Injectable()
export class NotificationExamplesService {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly topicManagementUseCase: TopicManagementUseCase,
  ) {}

  /**
   * EXEMPLO 1: Cliente agenda um serviço de limpeza
   * - Envia notificação para o cliente confirmando o agendamento
   * - Pode enviar para prestadores interessados no tópico "limpeza"
   */
  async exemploClienteAgendaServico(clienteToken: string, servicoId: string) {
    // Notificação para o cliente
    const notificacaoCliente: CreateNotificationDto = {
      title: 'Solicitação Enviada ✅',
      body: 'Sua solicitação de limpeza foi enviada com sucesso! Aguarde a confirmação dos prestadores.',
      data: {
        tipo: 'solicitacao_enviada',
        servicoId: servicoId,
        status: 'pendente',
        acao: 'visualizar_solicitacao'
      },
      sound: 'notification_sound'
    };

    // Envia para o cliente específico
    const resultadoCliente = await this.sendNotificationUseCase.sendToUser(
      notificacaoCliente,
      clienteToken
    );

    console.log('Notificação enviada para cliente:', resultadoCliente);

    // Opcional: Notificar prestadores interessados
    const notificacaoPrestadores: CreateNotificationDto = {
      title: 'Nova Solicitação de Limpeza 🧹',
      body: 'Uma nova solicitação de limpeza está disponível na sua região.',
      data: {
        tipo: 'nova_solicitacao',
        servicoId: servicoId,
        categoria: 'limpeza'
      }
    };

    // Envia para todos inscritos no tópico "limpeza"
    const resultadoPrestadores = await this.sendNotificationUseCase.sendToTopic(
      notificacaoPrestadores,
      'limpeza'
    );

    console.log('Notificação enviada para prestadores:', resultadoPrestadores);

    return {
      cliente: resultadoCliente,
      prestadores: resultadoPrestadores
    };
  }

  /**
   * EXEMPLO 2: Prestador aceita o serviço
   * - Envia confirmação para o cliente
   * - Pode notificar outros prestadores que o serviço não está mais disponível
   */
  async exemploPrestadorAceitaServico(
    clienteToken: string,
    prestadorNome: string,
    servicoId: string
  ) {
    const notificacaoCliente: CreateNotificationDto = {
      title: 'Serviço Confirmado! 🎉',
      body: `${prestadorNome} aceitou sua solicitação de limpeza. O serviço está confirmado!`,
      data: {
        tipo: 'servico_confirmado',
        servicoId: servicoId,
        prestadorNome: prestadorNome,
        status: 'confirmado',
        acao: 'visualizar_detalhes'
      },
      icon: 'check_circle',
      sound: 'success_sound'
    };

    const resultado = await this.sendNotificationUseCase.sendToUser(
      notificacaoCliente,
      clienteToken
    );

    console.log('Confirmação enviada para cliente:', resultado);

    return resultado;
  }

  /**
   * EXEMPLO 3: Lembrete de serviço agendado
   * - Envia lembrete 1 hora antes do serviço
   */
  async exemploLembreteServico(
    clienteToken: string,
    servicoId: string,
    horario: string,
    endereco: string
  ) {
    const notificacaoLembrete: CreateNotificationDto = {
      title: 'Lembrete: Serviço Hoje ⏰',
      body: `Seu serviço de limpeza está agendado para hoje às ${horario} no endereço: ${endereco}`,
      data: {
        tipo: 'lembrete_servico',
        servicoId: servicoId,
        horario: horario,
        endereco: endereco,
        acao: 'abrir_mapa'
      },
      sound: 'reminder_sound'
    };

    const resultado = await this.sendNotificationUseCase.sendToUser(
      notificacaoLembrete,
      clienteToken
    );

    console.log('Lembrete enviado:', resultado);

    return resultado;
  }

  /**
   * EXEMPLO 4: Promoção para todos os usuários
   * - Campanha de marketing para todos os usuários registrados
   */
  async exemploPromocaoGeral() {
    const notificacaoPromocao: CreateNotificationDto = {
      title: '🏆 Promoção Especial!',
      body: '50% OFF na sua primeira limpeza residencial! Use o cupom: PRIMEIRA50',
      data: {
        tipo: 'promocao',
        desconto: 50,
        cupom: 'PRIMEIRA50',
        categoria: 'limpeza_residencial',
        acao: 'agendar_servico'
      },
      imageUrl: 'https://exemplo.com/imagem-promocao.jpg',
      sound: 'promotion_sound'
    };

    const resultado = await this.sendNotificationUseCase.sendToAll(
      notificacaoPromocao
    );

    console.log('Promoção enviada para todos:', resultado);

    return resultado;
  }

  /**
   * EXEMPLO 5: Atualização de status em tempo real
   * - Notificações para usuários inscritos em tópicos específicos
   */
  async exemploAtualizacaoStatus(
    servicoId: string,
    novoStatus: string,
    mensagem: string
  ) {
    const notificacaoStatus: CreateNotificationDto = {
      title: 'Atualização do Serviço',
      body: mensagem,
      data: {
        tipo: 'atualizacao_status',
        servicoId: servicoId,
        status: novoStatus,
        timestamp: new Date().toISOString()
      }
    };

    // Envia para o tópico do serviço específico
    const topicoServico = `servico_${servicoId}`;
    const resultado = await this.sendNotificationUseCase.sendToTopic(
      notificacaoStatus,
      topicoServico
    );

    console.log('Atualização enviada:', resultado);

    return resultado;
  }

  /**
   * EXEMPLO 6: Gerenciamento de tópicos
   * - Inscrever/desinscrever dispositivos em tópicos
   */
  async exemploGerenciamentoTopicos(
    deviceToken: string,
    topicos: string[],
    acao: 'inscrever' | 'desinscrever'
  ) {
    const resultados: Array<{ topico: string; sucesso: boolean; erro?: string }> = [];

    for (const topico of topicos) {
      let resultado;

      if (acao === 'inscrever') {
        resultado = await this.topicManagementUseCase.subscribeToTopic(
          deviceToken,
          topico
        );
        console.log(`Dispositivo inscrito no tópico ${topico}:`, resultado);
      } else {
        resultado = await this.topicManagementUseCase.unsubscribeFromTopic(
          deviceToken,
          topico
        );
        console.log(`Dispositivo desinscrito do tópico ${topico}:`, resultado);
      }

      resultados.push({ topico, sucesso: resultado.success, erro: resultado.error });
    }

    return resultados;
  }

  /**
   * EXEMPLO 7: Notificação de emergência/manutenção
   * - Para situações que requerem atenção imediata
   */
  async exemploNotificacaoUrgente(titulo: string, mensagem: string, topicoUrgente = 'urgente') {
    const notificacaoUrgente: CreateNotificationDto = {
      title: `🚨 ${titulo}`,
      body: mensagem,
      data: {
        tipo: 'urgente',
        prioridade: 'alta',
        timestamp: new Date().toISOString(),
        acao: 'atender_imediatamente'
      },
      sound: 'urgent_sound',
      icon: 'warning'
    };

    const resultado = await this.sendNotificationUseCase.sendToTopic(
      notificacaoUrgente,
      topicoUrgente
    );

    console.log('Notificação urgente enviada:', resultado);

    return resultado;
  }
}

/**
 * DICAS DE USO:
 *
 * 1. Sempre use dados estruturados no campo 'data' para facilitar o processamento no app
 * 2. Utilize tópicos para segmentação avançada (ex: "limpeza", "manutencao", "urgente")
 * 3. Configure sons e ícones apropriados para diferentes tipos de notificação
 * 4. Implemente retry logic no cliente para casos de falha de rede
 * 5. Use timestamps para controlar a ordem e validade das notificações
 * 6. Considere o timezone do usuário ao enviar lembretes
 * 7. Mantenha histórico de notificações enviadas para auditoria
 */