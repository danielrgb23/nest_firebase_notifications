# 📚 Exemplos Práticos - Serviço de Notificações

> 💡 **Dica**: Todos os exemplos aqui podem ser copiados diretamente para seu projeto!

## 📋 Índice

- [Exemplos de API](#exemplos-de-api)
- [Exemplos de Código Interno](#exemplos-de-código-interno)
- [Cenários Completos](#cenários-completos)
- [Templates de Notificação](#templates-de-notificação)

---

## 🌐 Exemplos de API

### 1. **Enviar Notificação de Boas-vindas**

```bash
curl -X POST http://localhost:3001/notifications/send-user/SEU_TOKEN_AQUI \
  -H "Content-Type: application/json" \
  -d '{
    "title": "🎉 Bem-vindo ao App!",
    "body": "Sua conta foi criada com sucesso. Explore nossos serviços!",
    "data": {
      "tipo": "boas_vindas",
      "userId": "12345",
      "acao": "abrir_tutorial"
    },
    "sound": "welcome"
  }'
```

### 2. **Confirmar Pedido**

```bash
curl -X POST "http://localhost:3001/notifications/send-user/ePpGFh2OTB-JHLRk2ksdGO:APA91bHje7irVZenqHPsmO-Ik_sIrYN6EaiSfO3rY4ULCUjOgxQwP5DJ89BK9klChX6ruAOZTMJ3gbAKCEGQHzeSqiU_ZOEcoVTY4Zlay1OVPZNV7nzj4gs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "✅ Pedido Confirmado",
    "body": "Seu pedido #12345 foi confirmado e está sendo preparado.",
    "data": {
      "tipo": "pedido_confirmado",
      "pedidoId": "12345",
      "status": "confirmado",
      "acao": "rastrear_pedido"
    },
    "sound": "success"
  }'
```

### 3. **Promoção por Categoria**

```bash
curl -X POST "http://localhost:3001/notifications/send-topic/limpeza" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "🏷️ 50% OFF em Limpeza!",
    "body": "Aproveite 50% de desconto em todos os serviços de limpeza residencial!",
    "data": {
      "tipo": "promocao",
      "categoria": "limpeza",
      "desconto": 50,
      "cupom": "LIMPEZA50",
      "validade": "2024-02-01T23:59:59Z",
      "acao": "ver_servicos"
    },
    "imageUrl": "https://exemplo.com/promocao-limpeza.jpg",
    "sound": "promotion"
  }'
```

### 4. **Lembrete de Serviço**

```bash
curl -X POST "http://localhost:3001/notifications/send-user/ePpGFh2OTB-JHLRk2ksdGO:APA91bHje7irVZenqHPsmO-Ik_sIrYN6EaiSfO3rY4ULCUjOgxQwP5DJ89BK9klChX6ruAOZTMJ3gbAKCEGQHzeSqiU_ZOEcoVTY4Zlay1OVPZNV7nzj4gs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "⏰ Lembrete: Serviço Amanhã",
    "body": "Seu serviço de limpeza está agendado para amanhã às 14:00.",
    "data": {
      "tipo": "lembrete_servico",
      "servicoId": "67890",
      "data": "2024-01-11T14:00:00Z",
      "endereco": "Rua das Flores, 123",
      "acao": "abrir_mapa"
    },
    "sound": "reminder"
  }'
```

### 5. **Notificação de Status em Tempo Real**

```bash
curl -X POST "http://localhost:3001/notifications/send-topic/servico_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "🚗 Prestador a Caminho",
    "body": "João Silva está a 5 minutos do seu endereço.",
    "data": {
      "tipo": "status_servico",
      "servicoId": "12345",
      "status": "prestador_caminho",
      "prestadorNome": "João Silva",
      "tempoEstimado": "5 minutos",
      "acao": "ver_no_mapa"
    }
  }'
```

### 6. **Campanha de Reativação**

```bash
curl -X POST "http://localhost:3001/notifications/send-topic/inativos_30_dias" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "😊 Sentimos sua Falta!",
    "body": "Que tal agendar um novo serviço? Temos ofertas especiais para você!",
    "data": {
      "tipo": "reengajamento",
      "diasInativo": 30,
      "ofertaEspecial": true,
      "acao": "ver_ofertas"
    },
    "imageUrl": "https://exemplo.com/oferta-especial.jpg",
    "sound": "offer"
  }'
```

---

## 💻 Exemplos de Código Interno

### **1. Serviço de Pedidos**

```typescript
// src/pedidos/pedido.service.ts
import { Injectable } from '@nestjs/common';
import { SendNotificationUseCase } from '../notifications/application';
import { CreateNotificationDto } from '../notifications/application';

@Injectable()
export class PedidoService {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {}

  async criarPedido(pedidoData: any, clienteToken: string) {
    // 1. Criar pedido no banco
    const pedido = await this.pedidoRepository.create(pedidoData);

    // 2. Notificar cliente sobre criação
    const notificacaoCriacao: CreateNotificationDto = {
      title: '📦 Pedido Criado',
      body: `Seu pedido #${pedido.id} foi criado com sucesso!`,
      data: {
        tipo: 'pedido_criado',
        pedidoId: pedido.id,
        valor: pedido.valor,
        status: 'pendente',
        acao: 'visualizar_pedido'
      }
    };

    await this.sendNotificationUseCase.sendToUser(notificacaoCriacao, clienteToken);

    // 3. Notificar prestadores disponíveis
    const notificacaoPrestadores: CreateNotificationDto = {
      title: '🆕 Novo Pedido Disponível',
      body: `${pedido.servico} - ${pedido.endereco}`,
      data: {
        tipo: 'novo_pedido',
        pedidoId: pedido.id,
        categoria: pedido.categoria,
        valor: pedido.valor,
        acao: 'ver_detalhes_pedido'
      }
    };

    await this.sendNotificationUseCase.sendToTopic(notificacaoPrestadores, pedido.categoria);

    return pedido;
  }

  async atualizarStatusPedido(pedidoId: string, novoStatus: string, clienteToken: string) {
    // Atualizar status no banco
    await this.pedidoRepository.updateStatus(pedidoId, novoStatus);

    // Mapear mensagens por status
    const mensagens = {
      'aceito': {
        title: '✅ Pedido Aceito',
        body: 'Um prestador aceitou seu pedido!',
        sound: 'success'
      },
      'em_andamento': {
        title: '🚀 Serviço Iniciado',
        body: 'O prestador iniciou o serviço.',
        sound: 'notification'
      },
      'concluido': {
        title: '🎉 Serviço Concluído',
        body: 'Seu serviço foi finalizado com sucesso!',
        sound: 'success'
      }
    };

    const config = mensagens[novoStatus];
    if (config) {
      const notificacao: CreateNotificationDto = {
        title: config.title,
        body: config.body,
        data: {
          tipo: 'status_pedido',
          pedidoId: pedidoId,
          status: novoStatus,
          acao: 'avaliar_servico'
        },
        sound: config.sound
      };

      await this.sendNotificationUseCase.sendToUser(notificacao, clienteToken);
    }
  }
}
```

### **2. Serviço de Agendamento**

```typescript
// src/agendamento/agendamento.service.ts
import { Injectable } from '@nestjs/common';
import { SendNotificationUseCase } from '../notifications/application';

@Injectable()
export class AgendamentoService {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {}

  async agendarServico(agendamentoData: any) {
    const agendamento = await this.agendamentoRepository.create(agendamentoData);

    // Notificar cliente
    const notificacaoCliente: CreateNotificationDto = {
      title: '📅 Agendamento Confirmado',
      body: `${agendamento.servico} agendado para ${this.formatarData(agendamento.data)}`,
      data: {
        tipo: 'agendamento_confirmado',
        agendamentoId: agendamento.id,
        servico: agendamento.servico,
        data: agendamento.data,
        acao: 'visualizar_agendamento'
      }
    };

    await this.sendNotificationUseCase.sendToUser(notificacaoCliente, agendamento.clienteToken);

    // Agendar lembretes automáticos
    this.agendarLembretes(agendamento);

    return agendamento;
  }

  private async agendarLembretes(agendamento: any) {
    const dataAgendamento = new Date(agendamento.data);

    // Lembrete 24h antes
    const lembrete24h = new Date(dataAgendamento.getTime() - 24 * 60 * 60 * 1000);
    setTimeout(async () => {
      await this.enviarLembrete(agendamento, '24h');
    }, lembrete24h.getTime() - Date.now());

    // Lembrete 2h antes
    const lembrete2h = new Date(dataAgendamento.getTime() - 2 * 60 * 60 * 1000);
    setTimeout(async () => {
      await this.enviarLembrete(agendamento, '2h');
    }, lembrete2h.getTime() - Date.now());
  }

  private async enviarLembrete(agendamento: any, tipo: string) {
    const mensagens = {
      '24h': {
        title: '📅 Lembrete: Serviço Amanhã',
        body: `Seu ${agendamento.servico} está agendado para amanhã às ${this.formatarHora(agendamento.data)}`
      },
      '2h': {
        title: '⏰ Lembrete: Serviço em 2 horas',
        body: `Seu ${agendamento.servico} começa em 2 horas em ${agendamento.endereco}`
      }
    };

    const notificacao: CreateNotificationDto = {
      title: mensagens[tipo].title,
      body: mensagens[tipo].body,
      data: {
        tipo: 'lembrete_agendamento',
        agendamentoId: agendamento.id,
        horasRestantes: tipo === '24h' ? 24 : 2,
        acao: 'abrir_mapa'
      },
      sound: 'reminder'
    };

    await this.sendNotificationUseCase.sendToUser(notificacao, agendamento.clienteToken);
  }
}
```

### **3. Serviço de Marketing**

```typescript
// src/marketing/marketing.service.ts
import { Injectable } from '@nestjs/common';
import { SendNotificationUseCase } from '../notifications/application';

@Injectable()
export class MarketingService {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {}

  async enviarCampanhaPromocional(campanha: any) {
    const notificacao: CreateNotificationDto = {
      title: campanha.titulo,
      body: campanha.descricao,
      data: {
        tipo: 'campanha_promocional',
        campanhaId: campanha.id,
        desconto: campanha.desconto,
        cupom: campanha.cupom,
        validade: campanha.validade,
        acao: 'aproveitar_oferta'
      },
      imageUrl: campanha.imagemUrl,
      sound: 'promotion'
    };

    // Seleciona o alvo baseado na campanha
    if (campanha.alvo === 'todos') {
      return await this.sendNotificationUseCase.sendToAll(notificacao);
    } else if (campanha.alvo === 'categoria') {
      return await this.sendNotificationUseCase.sendToTopic(notificacao, campanha.categoria);
    } else if (campanha.alvo === 'segmento') {
      return await this.sendNotificationUseCase.sendToTopic(notificacao, campanha.segmento);
    }
  }

  async enviarNewsletter(mensagem: any, segmento: string = 'todos') {
    const notificacao: CreateNotificationDto = {
      title: `📧 ${mensagem.titulo}`,
      body: mensagem.resumo,
      data: {
        tipo: 'newsletter',
        newsletterId: mensagem.id,
        categoria: mensagem.categoria,
        acao: 'ler_noticia_completa'
      },
      imageUrl: mensagem.imagemCapa
    };

    if (segmento === 'todos') {
      return await this.sendNotificationUseCase.sendToAll(notificacao);
    } else {
      return await this.sendNotificationUseCase.sendToTopic(notificacao, segmento);
    }
  }

  async reengajarUsuariosInativos() {
    // Buscar usuários inativos há 30 dias
    const usuariosInativos = await this.usuarioRepository.findInativos(30);

    for (const usuario of usuariosInativos) {
      const notificacao: CreateNotificationDto = {
        title: '😊 Sentimos sua Falta!',
        body: 'Que tal solicitar um novo serviço? Temos ofertas especiais!',
        data: {
          tipo: 'reengajamento',
          usuarioId: usuario.id,
          diasInativo: 30,
          ofertaEspecial: true,
          acao: 'ver_ofertas'
        },
        sound: 'welcome_back'
      };

      await this.sendNotificationUseCase.sendToUser(notificacao, usuario.fcmToken);
    }
  }
}
```

---

## 🎯 Cenários Completos

### **Cenário 1: E-commerce com Entrega**

```typescript
// src/ecommerce/pedido.service.ts
@Injectable()
export class PedidoService {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {}

  async fluxoCompletoPedido(produtos: any[], clienteToken: string) {
    // 1. Pedido criado
    const pedido = await this.criarPedido(produtos, clienteToken);
    await this.notificarPedidoCriado(pedido);

    // 2. Pedido confirmado
    setTimeout(async () => {
      await this.notificarPedidoConfirmado(pedido);
    }, 5000); // Simula processamento

    // 3. Pedido em separação
    setTimeout(async () => {
      await this.notificarPedidoSeparacao(pedido);
    }, 30000);

    // 4. Pedido enviado
    setTimeout(async () => {
      await this.notificarPedidoEnviado(pedido);
    }, 60000);

    // 5. Pedido entregue
    setTimeout(async () => {
      await this.notificarPedidoEntregue(pedido);
    }, 120000);

    return pedido;
  }

  private async notificarPedidoCriado(pedido: any) {
    const notificacao: CreateNotificationDto = {
      title: '🛒 Pedido Recebido',
      body: `Pedido #${pedido.id} recebido com sucesso!`,
      data: {
        tipo: 'pedido_criado',
        pedidoId: pedido.id,
        valor: pedido.valor,
        acao: 'rastrear_pedido'
      }
    };

    await this.sendNotificationUseCase.sendToUser(notificacao, pedido.clienteToken);
  }

  private async notificarPedidoConfirmado(pedido: any) {
    const notificacao: CreateNotificationDto = {
      title: '✅ Pedido Confirmado',
      body: 'Seu pedido foi confirmado e está sendo preparado.',
      data: {
        tipo: 'pedido_confirmado',
        pedidoId: pedido.id,
        status: 'confirmado',
        acao: 'rastrear_pedido'
      },
      sound: 'success'
    };

    await this.sendNotificationUseCase.sendToUser(notificacao, pedido.clienteToken);
  }

  private async notificarPedidoSeparacao(pedido: any) {
    const notificacao: CreateNotificationDto = {
      title: '📦 Preparando seu Pedido',
      body: 'Estamos separando os itens do seu pedido.',
      data: {
        tipo: 'pedido_separacao',
        pedidoId: pedido.id,
        status: 'em_separacao',
        acao: 'rastrear_pedido'
      }
    };

    await this.sendNotificationUseCase.sendToUser(notificacao, pedido.clienteToken);
  }

  private async notificarPedidoEnviado(pedido: any) {
    const notificacao: CreateNotificationDto = {
      title: '🚚 Pedido Enviado',
      body: `Seu pedido foi enviado! Código de rastreio: ${pedido.codigoRastreio}`,
      data: {
        tipo: 'pedido_enviado',
        pedidoId: pedido.id,
        codigoRastreio: pedido.codigoRastreio,
        status: 'enviado',
        acao: 'rastrear_entrega'
      },
      sound: 'notification'
    };

    await this.sendNotificationUseCase.sendToUser(notificacao, pedido.clienteToken);
  }

  private async notificarPedidoEntregue(pedido: any) {
    const notificacao: CreateNotificationDto = {
      title: '🎉 Pedido Entregue',
      body: 'Seu pedido foi entregue com sucesso!',
      data: {
        tipo: 'pedido_entregue',
        pedidoId: pedido.id,
        status: 'entregue',
        acao: 'avaliar_compra'
      },
      sound: 'success'
    };

    await this.sendNotificationUseCase.sendToUser(notificacao, pedido.clienteToken);

    // Agendar lembrete de avaliação
    setTimeout(async () => {
      await this.lembrarAvaliacao(pedido);
    }, 24 * 60 * 60 * 1000); // 24h depois
  }

  private async lembrarAvaliacao(pedido: any) {
    const notificacao: CreateNotificationDto = {
      title: '⭐ O que achou da compra?',
      body: 'Ajude-nos a melhorar! Avalie os produtos comprados.',
      data: {
        tipo: 'lembrete_avaliacao',
        pedidoId: pedido.id,
        acao: 'avaliar_produtos'
      },
      sound: 'reminder'
    };

    await this.sendNotificationUseCase.sendToUser(notificacao, pedido.clienteToken);
  }
}
```

### **Cenário 2: App de Delivery**

```typescript
// src/delivery/pedido.service.ts
@Injectable()
export class DeliveryService {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {}

  async acompanharPedidoEmTempoReal(pedidoId: string) {
    const pedido = await this.pedidoRepository.findById(pedidoId);

    // Simular atualização de status em tempo real
    const statusUpdates = [
      { delay: 5000, status: 'aceito', message: 'Restaurante aceitou seu pedido!' },
      { delay: 30000, status: 'preparando', message: 'Seu pedido está sendo preparado.' },
      { delay: 60000, status: 'pronto', message: 'Pedido pronto! Aguardando entregador.' },
      { delay: 90000, status: 'saiu_entrega', message: 'Seu pedido saiu para entrega!' },
      { delay: 120000, status: 'entregue', message: 'Pedido entregue! Bom apetite! 🍽️' }
    ];

    for (const update of statusUpdates) {
      setTimeout(async () => {
        await this.atualizarStatusPedido(pedido, update.status, update.message);
      }, update.delay);
    }
  }

  private async atualizarStatusPedido(pedido: any, status: string, mensagem: string) {
    // Atualizar no banco
    await this.pedidoRepository.updateStatus(pedido.id, status);

    // Mapear ícones e sons por status
    const statusConfig = {
      'aceito': { icon: '✅', sound: 'success' },
      'preparando': { icon: '👨‍🍳', sound: 'notification' },
      'pronto': { icon: '📦', sound: 'ready' },
      'saiu_entrega': { icon: '🚴', sound: 'delivery' },
      'entregue': { icon: '🎉', sound: 'success' }
    };

    const config = statusConfig[status];

    const notificacao: CreateNotificationDto = {
      title: `${config.icon} Status do Pedido`,
      body: mensagem,
      data: {
        tipo: 'status_delivery',
        pedidoId: pedido.id,
        status: status,
        timestamp: new Date().toISOString(),
        acao: status === 'entregue' ? 'avaliar_pedido' : 'acompanhar_pedido'
      },
      sound: config.sound
    };

    await this.sendNotificationUseCase.sendToUser(notificacao, pedido.clienteToken);

    // Para entregas, também notificar o entregador se necessário
    if (status === 'pronto' && pedido.entregadorToken) {
      const notificacaoEntregador: CreateNotificationDto = {
        title: '🚀 Novo Pedido para Entrega',
        body: `Pedido #${pedido.id} pronto para retirada no restaurante.`,
        data: {
          tipo: 'pedido_pronto_entrega',
          pedidoId: pedido.id,
          restaurante: pedido.restaurante,
          enderecoEntrega: pedido.enderecoEntrega,
          acao: 'aceitar_entrega'
        },
        sound: 'new_delivery'
      };

      await this.sendNotificationUseCase.sendToUser(notificacaoEntregador, pedido.entregadorToken);
    }
  }
}
```

---

## 📋 Templates de Notificação

### **Template Base**

```typescript
// src/shared/templates/notification-templates.ts
export class NotificationTemplates {
  static pedidoStatus(tipo: string, dados: any): CreateNotificationDto {
    const templates = {
      'criado': {
        title: '📦 Pedido Criado',
        body: `Pedido #${dados.pedidoId} criado com sucesso!`,
        sound: 'notification'
      },
      'confirmado': {
        title: '✅ Pedido Confirmado',
        body: 'Seu pedido foi confirmado!',
        sound: 'success'
      },
      'entregue': {
        title: '🎉 Pedido Entregue',
        body: 'Seu pedido foi entregue!',
        sound: 'success'
      }
    };

    const template = templates[tipo];

    return {
      title: template.title,
      body: template.body,
      data: {
        tipo: `pedido_${tipo}`,
        ...dados,
        acao: this.getAcaoPorTipo(tipo)
      },
      sound: template.sound
    };
  }

  static promocao(tipo: string, dados: any): CreateNotificationDto {
    const templates = {
      'geral': {
        title: '🏷️ Oferta Especial!',
        body: dados.descricao,
        sound: 'promotion'
      },
      'flash': {
        title: '⚡ Oferta Relâmpago!',
        body: `Por tempo limitado: ${dados.descricao}`,
        sound: 'urgent'
      }
    };

    const template = templates[tipo] || templates.geral;

    return {
      title: template.title,
      body: template.body,
      data: {
        tipo: `promocao_${tipo}`,
        ...dados,
        acao: 'aproveitar_oferta'
      },
      sound: template.sound,
      imageUrl: dados.imagemUrl
    };
  }

  static lembrete(tipo: string, dados: any): CreateNotificationDto {
    const templates = {
      'agendamento': {
        title: '📅 Lembrete de Agendamento',
        body: `Você tem um agendamento ${dados.quando}.`,
        sound: 'reminder'
      },
      'pagamento': {
        title: '💳 Lembrete de Pagamento',
        body: `Pagamento pendente de ${dados.valor}.`,
        sound: 'reminder'
      }
    };

    const template = templates[tipo];

    return {
      title: template.title,
      body: template.body,
      data: {
        tipo: `lembrete_${tipo}`,
        ...dados,
        acao: 'resolver_pendente'
      },
      sound: template.sound
    };
  }

  private static getAcaoPorTipo(tipo: string): string {
    const acoes = {
      'criado': 'visualizar_pedido',
      'confirmado': 'acompanhar_pedido',
      'entregue': 'avaliar_pedido'
    };

    return acoes[tipo] || 'visualizar_detalhes';
  }
}

// Uso dos templates
const notificacao = NotificationTemplates.pedidoStatus('confirmado', {
  pedidoId: '12345',
  valor: 99.90
});

await sendNotificationUseCase.sendToUser(notificacao, userToken);
```

### **Template com Localização**

```typescript
// Template para notificações com mapas
export class LocationTemplates {
  static chegadaPrestador(dados: {
    prestadorNome: string;
    distancia: string;
    tempoEstimado: string;
    coordenadas: { lat: number; lng: number };
  }): CreateNotificationDto {
    return {
      title: '🚗 Prestador Chegando',
      body: `${dados.prestadorNome} está a ${dados.distancia} (${dados.tempoEstimado})`,
      data: {
        tipo: 'prestador_chegando',
        prestadorNome: dados.prestadorNome,
        distancia: dados.distancia,
        tempoEstimado: dados.tempoEstimado,
        coordenadas: dados.coordenadas,
        acao: 'ver_no_mapa'
      },
      sound: 'arrival'
    };
  }
}
```

---

## 🎯 **Dicas de Implementação**

### **1. Rate Limiting**
```typescript
@Injectable()
export class NotificationRateLimiter {
  private readonly sentNotifications = new Map<string, number[]>();

  canSend(userId: string, maxPerHour: number = 10): boolean {
    const now = Date.now();
    const windowStart = now - (60 * 60 * 1000); // 1 hora

    const userNotifications = this.sentNotifications.get(userId) || [];
    const recentNotifications = userNotifications.filter(time => time > windowStart);

    return recentNotifications.length < maxPerHour;
  }

  recordSent(userId: string) {
    const userNotifications = this.sentNotifications.get(userId) || [];
    userNotifications.push(Date.now());

    // Manter apenas últimas 24h
    const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
    this.sentNotifications.set(userId,
      userNotifications.filter(time => time > dayAgo)
    );
  }
}
```

### **2. Fila de Notificações**
```typescript
@Injectable()
export class NotificationQueue {
  private readonly queue: CreateNotificationDto[] = [];

  async add(notification: CreateNotificationDto, userToken: string) {
    this.queue.push({ ...notification, _token: userToken });

    // Processar fila se não estiver processando
    if (!this.processing) {
      await this.processQueue();
    }
  }

  private processing = false;

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    try {
      while (this.queue.length > 0) {
        const item = this.queue.shift();
        await this.sendNotificationUseCase.sendToUser(item, item._token);

        // Pequena pausa entre envios
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } finally {
      this.processing = false;
    }
  }
}
```

### **3. Estratégia de Retry**
```typescript
@Injectable()
export class NotificationRetryService {
  async sendWithRetry(
    notification: CreateNotificationDto,
    token: string,
    maxRetries: number = 3
  ) {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.sendNotificationUseCase.sendToUser(notification, token);

        if (result.success) {
          return result;
        }

        // Se falhou por token inválido, não tentar novamente
        if (result.error?.includes('invalid-token')) {
          throw new Error('Token FCM inválido');
        }

        lastError = new Error(result.error);

      } catch (error) {
        lastError = error;

        // Esperar antes de tentar novamente (backoff exponencial)
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}
```

---

**💡 Lembre-se**: Todos esses exemplos podem ser adaptados para seu caso de uso específico. O importante é manter consistência nos campos `data` para facilitar o processamento no app mobile! 🚀