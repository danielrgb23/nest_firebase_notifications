# 🚀 Serviço de Notificações Firebase Cloud Messaging

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  <img src="https://firebase.google.com/images/brand-guidelines/logo-standard.png" width="120" alt="Firebase Logo" />
</p>

<p align="center">
  Sistema completo de notificações push com Firebase Cloud Messaging, desenvolvido em NestJS seguindo Clean Architecture. Suporte total para envio direcionado, tópicos e notificações em massa.
</p>

<div align="center">

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

</div>

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso da API](#uso-da-api)
- [Exemplos de Uso](#exemplos-de-uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [Documentação Técnica](#documentação-técnica)

## 🎯 Visão Geral

Este serviço fornece uma solução completa para envio de notificações push utilizando Firebase Cloud Messaging. Foi desenvolvido seguindo os princípios da **Clean Architecture** para garantir:

- **Manutenibilidade**: Código organizado e fácil de manter
- **Testabilidade**: Separação clara de responsabilidades
- **Flexibilidade**: Fácil extensão e modificação
- **Escalabilidade**: Estrutura preparada para crescimento

### Casos de Uso Principais

- **Agendamento de Serviços**: Cliente agenda limpeza → notificação de solicitação enviada
- **Confirmação de Serviços**: Prestador aceita serviço → notificação de confirmação
- **Segmentação Avançada**: Notificações para todos, usuários específicos ou tópicos

## 🏗️ Arquitetura

O projeto segue a **Clean Architecture** dividida em 4 camadas principais:

### 1. Domain Layer (Domínio)
- **Entidades**: `NotificationEntity` - representa uma notificação
- **Interfaces**: `INotificationService` - contrato para serviços de notificação
- **Regras de negócio**: Lógica pura independente de frameworks

### 2. Application Layer (Aplicação)
- **Use Cases**: Coordenação da lógica de negócio
  - `SendNotificationUseCase`: Envio de notificações
  - `TopicManagementUseCase`: Gerenciamento de tópicos
- **DTOs**: Transferência de dados entre camadas

### 3. Infrastructure Layer (Infraestrutura)
- **Firebase Service**: Implementação concreta do FCM
- **Configuração**: Inicialização do Firebase Admin SDK

### 4. Presentation Layer (Apresentação)
- **Controllers REST**: Endpoints da API
- **DTOs de resposta**: Formatação dos dados de saída

## ✨ Funcionalidades

### 📤 Tipos de Envio

| Tipo | Descrição | Quando Usar |
|------|-----------|-------------|
| **Para Todos** | Envio em massa para todos os usuários registrados | Campanhas globais, anúncios importantes |
| **Para Usuário Específico** | Notificação direcionada usando token FCM | Pedidos pessoais, lembretes individuais |
| **Para Tópico** | Segmentação por interesses/categorias | Promoções por categoria, atualizações segmentadas |

### 🏷️ Gerenciamento de Tópicos

- **Inscrição Automática**: Dispositivos podem se inscrever em tópicos dinamicamente
- **Cancelamento**: Remoção de inscrições a qualquer momento
- **Tópicos Ilimitados**: Criados sob demanda (ex: "promocoes", "pedidos", "urgente")
- **Segmentação Avançada**: Combine múltiplos tópicos por usuário

### 📱 Suporte Multiplataforma

| Plataforma | Recursos Específicos |
|------------|---------------------|
| **Android** | Prioridade alta, sons customizados, ícones, click actions |
| **iOS** | Badges, sons APNS, notificações críticas |
| **Web** | Suporte completo PWA, service workers |

### 🎯 Recursos Avançados

- **Histórico Completo**: Todas as notificações são registradas automaticamente
- **Retry Automático**: Tratamento inteligente de falhas de rede
- **Dados Estruturados**: Suporte a payloads complexos para deep linking
- **Configuração Flexível**: Sons, ícones e imagens personalizáveis
- **Logging Detalhado**: Rastreamento completo de envios e erros

## 🚀 Instalação

### Pré-requisitos

- Node.js (v16 ou superior)
- NPM ou Yarn
- Conta Firebase com projeto configurado

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd notifications-nestjs
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de configuração do Firebase
cp config/esplendidoapp-321a8-firebase-adminsdk-fbsvc-e395ed8b7f.json config/
```

4. **Execute o projeto**
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## ⚙️ Configuração

### Firebase Configuration

1. **Arquivo de Credenciais**: Coloque o arquivo JSON do Firebase Admin SDK em `config/`:
```json
{
  "type": "service_account",
  "project_id": "seu-projeto-firebase",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "firebase-adminsdk@seu-projeto.iam.gserviceaccount.com"
}
```

2. **Variáveis de Ambiente** (`.env`):
```bash
# Porta do servidor
PORT=3001

# Firebase (opcional - extraído automaticamente do arquivo JSON)
FIREBASE_PROJECT_ID=seu-projeto-firebase

# Ambiente
NODE_ENV=development
```

### 🔧 **Configuração Avançada**

#### **Configurações FCM por Plataforma**
```typescript
// src/notifications/infrastructure/firebase/firebase-notification.service.ts
private buildMessage(notification: NotificationEntity, target: NotificationTarget) {
  return {
    notification: {
      title: notification.title,
      body: notification.body,
      image: notification.imageUrl,
    },

    // 📱 Configurações Android
    android: {
      priority: 'high',
      notification: {
        sound: notification.sound || 'default',
        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
        channelId: 'default_channel'
      },
      ttl: 86400 // 24 horas
    },

    // 🍎 Configurações iOS
    apns: {
      payload: {
        aps: {
          sound: notification.sound || 'default',
          badge: 1,
          'content-available': 1
        }
      }
    },

    // 🌐 Configurações Web
    webpush: {
      notification: {
        icon: notification.icon || '/default-icon.png',
        badge: '/badge-icon.png'
      }
    },

    // 📊 Dados customizados
    data: notification.data ? Object.fromEntries(
      Object.entries(notification.data).map(([key, value]) => [key, String(value)])
    ) : undefined
  };
}
```

#### **Configurações de Retry e Timeout**
```typescript
// Configurações recomendadas para produção
const firebaseConfig = {
  // Timeout para envio
  timeout: 5000, // 5 segundos

  // Retry automático
  retry: {
    maxRetries: 3,
    retryInterval: 1000, // 1 segundo entre tentativas
    retryOnCodes: ['UNAVAILABLE', 'INTERNAL']
  }
};
```

## 🧪 Testes e Qualidade

### **Executar Testes**

```bash
# Todos os testes
npm run test

# Testes unitários
npm run test:unit

# Testes end-to-end
npm run test:e2e

# Cobertura de testes
npm run test:cov

# Testes em modo watch
npm run test:watch
```

### **Estrutura de Testes**

```
test/
├── unit/                          # Testes unitários
│   ├── domain/                   # Testes da camada de domínio
│   ├── application/              # Testes dos use cases
│   └── infrastructure/           # Testes do Firebase service
├── e2e/                          # Testes end-to-end
│   └── notifications.e2e-spec.ts # Testes da API completa
└── fixtures/                     # Dados de teste
    └── notification.fixtures.ts
```

### **Exemplo de Teste Unitário**

```typescript
// test/unit/application/send-notification.use-case.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { SendNotificationUseCase } from '../../../src/notifications/application';
import { INotificationService } from '../../../src/notifications/domain';

describe('SendNotificationUseCase', () => {
  let useCase: SendNotificationUseCase;
  let mockNotificationService: jest.Mocked<INotificationService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendNotificationUseCase,
        {
          provide: 'INotificationService',
          useValue: {
            sendToUser: jest.fn(),
            sendToAll: jest.fn(),
            sendToTopic: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<SendNotificationUseCase>(SendNotificationUseCase);
    mockNotificationService = module.get('INotificationService');
  });

  it('deve enviar notificação para usuário específico', async () => {
    // Arrange
    const dto = {
      notification: { title: 'Test', body: 'Test Body' },
      targetType: 'single' as const,
      targetValue: 'test-token'
    };

    mockNotificationService.sendToUser.mockResolvedValue({
      success: true,
      messageId: 'test-message-id',
      target: { type: 'single', value: 'test-token' }
    });

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(result.success).toBe(true);
    expect(result.messageId).toBe('test-message-id');
    expect(mockNotificationService.sendToUser).toHaveBeenCalled();
  });
});
```

### **Exemplo de Teste E2E**

```typescript
// test/e2e/notifications.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Notifications (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/notifications/send-user/:token (POST)', () => {
    return request(app.getHttpServer())
      .post('/notifications/send-user/test-token')
      .send({
        title: 'Test Notification',
        body: 'This is a test notification',
        data: { test: true }
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBeDefined();
        expect(res.body.target).toBeDefined();
      });
  });
});
```

## 📡 Uso da API

### Base URL
```bash
# Desenvolvimento
http://localhost:3001/notifications

# Produção (ajuste conforme necessário)
https://api.seu-dominio.com/notifications
```

### 🔗 Endpoints Disponíveis

#### 1. 📤 **Enviar Notificação Genérica**
```http
POST /notifications/send
Content-Type: application/json
```

**Estrutura do Body:**
```json
{
  "notification": {
    "title": "string (obrigatório)",
    "body": "string (obrigatório)",
    "data": {
      "tipo": "string",
      "id": "string",
      "acao": "string"
    },
    "imageUrl": "string (opcional)",
    "icon": "string (opcional)",
    "sound": "string (opcional)"
  },
  "targetType": "'all' | 'single' | 'topic'",
  "targetValue": "string (obrigatório para 'single' e 'topic')"
}
```

**Exemplo Prático:**
```bash
curl -X POST http://localhost:3001/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "notification": {
      "title": "Bem-vindo ao App! 🎉",
      "body": "Sua conta foi criada com sucesso. Explore nossos serviços!",
      "data": {
        "tipo": "boas_vindas",
        "userId": "12345",
        "acao": "abrir_tutorial"
      },
      "sound": "welcome"
    },
    "targetType": "single",
    "targetValue": "ePpGFh2OTB-JHLRk2ksdGO:APA91bHje7irVZenqHPsmO-Ik_sIrYN6EaiSfO3rY4ULCUjOgxQwP5DJ89BK9klChX6ruAOZTMJ3gbAKCEGQHzeSqiU_ZOEcoVTY4Zlay1OVPZNV7nzj4gs"
  }'
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "messageId": "projects/seu-projeto/messages/123456789",
  "target": {
    "type": "single",
    "value": "ePpGFh2OTB-JHLRk2ksdGO:APA91bHje7irVZenqHPsmO-Ik_sIrYN6EaiSfO3rY4ULCUjOgxQwP5DJ89BK9klChX6ruAOZTMJ3gbAKCEGQHzeSqiU_ZOEcoVTY4Zlay1OVPZNV7nzj4gs"
  }
}
```

#### 2. 🌍 **Enviar para Todos os Usuários**
```http
POST /notifications/send-all
Content-Type: application/json
```

**Exemplo:**
```bash
curl -X POST http://localhost:3001/notifications/send-all \
  -H "Content-Type: application/json" \
  -d '{
    "title": "🚨 Manutenção Programada",
    "body": "O app ficará indisponível das 02:00 às 04:00 para manutenção.",
    "data": {
      "tipo": "manutencao",
      "inicio": "2024-01-10T02:00:00Z",
      "fim": "2024-01-10T04:00:00Z"
    },
    "icon": "maintenance",
    "sound": "urgent"
  }'
```

#### 3. 👤 **Enviar para Usuário Específico**
```http
POST /notifications/send-user/{token}
Content-Type: application/json
```

**Exemplo com Token Específico:**
```bash
curl -X POST "http://localhost:3001/notifications/send-user/ePpGFh2OTB-JHLRk2ksdGO:APA91bHje7irVZenqHPsmO-Ik_sIrYN6EaiSfO3rY4ULCUjOgxQwP5DJ89BK9klChX6ruAOZTMJ3gbAKCEGQHzeSqiU_ZOEcoVTY4Zlay1OVPZNV7nzj4gs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pedido Confirmado! ✅",
    "body": "Seu pedido #1234 foi confirmado e está sendo preparado.",
    "data": {
      "tipo": "pedido_confirmado",
      "pedidoId": "1234",
      "status": "confirmado",
      "acao": "rastrear_pedido"
    },
    "sound": "success"
  }'
```

#### 4. 🏷️ **Enviar para Tópico Específico**
```http
POST /notifications/send-topic/{topic}
Content-Type: application/json
```

**Exemplo:**
```bash
curl -X POST "http://localhost:3001/notifications/send-topic/promocoes" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "🏷️ Super Promoção!",
    "body": "70% OFF em todos os produtos da categoria limpeza!",
    "data": {
      "tipo": "promocao",
      "categoria": "limpeza",
      "desconto": 70,
      "validade": "2024-01-15T23:59:59Z",
      "acao": "ver_produtos"
    },
    "imageUrl": "https://exemplo.com/promocao.jpg",
    "sound": "promotion"
  }'
```

#### 5. 🎯 **Gerenciar Inscrições em Tópicos**

**Inscrever Dispositivo:**
```http
POST /notifications/topics/subscribe
Content-Type: application/json
```

```bash
curl -X POST http://localhost:3001/notifications/topics/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "token": "ePpGFh2OTB-JHLRk2ksdGO:APA91bHje7irVZenqHPsmO-Ik_sIrYN6EaiSfO3rY4ULCUjOgxQwP5DJ89BK9klChX6ruAOZTMJ3gbAKCEGQHzeSqiU_ZOEcoVTY4Zlay1OVPZNV7nzj4gs",
    "topic": "promocoes"
  }'
```

**Cancelar Inscrição:**
```http
POST /notifications/topics/unsubscribe
Content-Type: application/json
```

```bash
curl -X POST http://localhost:3001/notifications/topics/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{
    "token": "ePpGFh2OTB-JHLRk2ksdGO:APA91bHje7irVZenqHPsmO-Ik_sIrYN6EaiSfO3rY4ULCUjOgxQwP5DJ89BK9klChX6ruAOZTMJ3gbAKCEGQHzeSqiU_ZOEcoVTY4Zlay1OVPZNV7nzj4gs",
    "topic": "promocoes"
  }'
```

## 💡 Exemplos Práticos de Uso

### 🏠 **Cenário: Plataforma de Serviços de Limpeza**

#### 📱 **1. Cliente Agenda um Serviço**
```typescript
// src/services/agendamento.service.ts
import { Injectable } from '@nestjs/common';
import { SendNotificationUseCase } from '../notifications/application';

@Injectable()
export class AgendamentoService {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {}

  async agendarServico(clienteToken: string, dadosServico: any) {
    // 1. Salva o serviço no banco
    const servico = await this.criarServico(dadosServico);

    // 2. Notifica o cliente que a solicitação foi enviada
    const notificacaoCliente: CreateNotificationDto = {
      title: 'Solicitação Enviada ✅',
      body: 'Sua solicitação de limpeza foi enviada! Aguarde confirmação dos prestadores.',
      data: {
        tipo: 'solicitacao_enviada',
        servicoId: servico.id,
        status: 'pendente',
        acao: 'visualizar_solicitacao'
      },
      sound: 'notification'
    };

    await this.sendNotificationUseCase.sendToUser(notificacaoCliente, clienteToken);

    // 3. Notifica prestadores interessados no tópico "limpeza"
    const notificacaoPrestadores: CreateNotificationDto = {
      title: '🧹 Nova Solicitação de Limpeza',
      body: `Nova solicitação de limpeza em ${dadosServico.endereco}`,
      data: {
        tipo: 'nova_solicitacao',
        servicoId: servico.id,
        categoria: 'limpeza',
        endereco: dadosServico.endereco,
        valor: dadosServico.valor
      },
      icon: 'broom'
    };

    await this.sendNotificationUseCase.sendToTopic(notificacaoPrestadores, 'limpeza');

    return servico;
  }
}
```

#### 👷 **2. Prestador Aceita o Serviço**
```typescript
// src/services/servico.service.ts
@Injectable()
export class ServicoService {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {}

  async aceitarServico(servicoId: string, prestadorId: string) {
    // 1. Busca dados do serviço e prestador
    const servico = await this.buscarServico(servicoId);
    const prestador = await this.buscarPrestador(prestadorId);

    // 2. Atualiza status do serviço
    await this.atualizarStatusServico(servicoId, 'confirmado');

    // 3. Notifica o cliente sobre a confirmação
    const notificacaoCliente: CreateNotificationDto = {
      title: '🎉 Serviço Confirmado!',
      body: `${prestador.nome} aceitou sua solicitação de limpeza! Serviço confirmado.`,
      data: {
        tipo: 'servico_confirmado',
        servicoId: servicoId,
        prestadorId: prestadorId,
        prestadorNome: prestador.nome,
        status: 'confirmado',
        dataServico: servico.dataAgendada,
        acao: 'visualizar_detalhes'
      },
      sound: 'success',
      icon: 'check_circle'
    };

    await this.sendNotificationUseCase.sendToUser(notificacaoCliente, servico.clienteToken);

    // 4. Notifica outros prestadores que o serviço não está mais disponível
    const notificacaoOutros: CreateNotificationDto = {
      title: 'Serviço Indisponível',
      body: `O serviço #${servicoId} foi aceito por outro prestador.`,
      data: {
        tipo: 'servico_indisponivel',
        servicoId: servicoId,
        status: 'indisponivel'
      }
    };

    await this.sendNotificationUseCase.sendToTopic(notificacaoOutros, `servico_${servicoId}`);

    return { sucesso: true };
  }
}
```

#### ⏰ **3. Lembrete de Serviço Agendado**
```typescript
// src/services/lembrete.service.ts
@Injectable()
export class LembreteService {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {}

  async enviarLembreteServico(servicoId: string) {
    const servico = await this.buscarServico(servicoId);

    const notificacaoLembrete: CreateNotificationDto = {
      title: '⏰ Lembrete: Serviço Hoje',
      body: `Seu serviço de limpeza está agendado para hoje às ${this.formatarHora(servico.dataAgendada)}`,
      data: {
        tipo: 'lembrete_servico',
        servicoId: servicoId,
        horario: servico.dataAgendada,
        endereco: servico.endereco,
        prestadorNome: servico.prestadorNome,
        acao: 'abrir_mapa'
      },
      sound: 'reminder',
      icon: 'schedule'
    };

    await this.sendNotificationUseCase.sendToUser(notificacaoLembrete, servico.clienteToken);

    // Registra que o lembrete foi enviado
    await this.registrarLembreteEnviado(servicoId);
  }

  // Método para agendamento automático de lembretes
  async agendarLembretesAutomaticos() {
    const servicosAmanhã = await this.buscarServicosAmanha();

    for (const servico of servicosAmanhã) {
      // Agenda lembrete para 9h do dia do serviço
      const horarioLembrete = new Date(servico.dataAgendada);
      horarioLembrete.setHours(9, 0, 0, 0);

      setTimeout(async () => {
        await this.enviarLembreteServico(servico.id);
      }, horarioLembrete.getTime() - Date.now());
    }
  }
}
```

#### 📢 **4. Campanhas de Marketing**
```typescript
// src/services/marketing.service.ts
@Injectable()
export class MarketingService {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {}

  async enviarPromocaoGeral() {
    const promocao: CreateNotificationDto = {
      title: '🏆 Oferta Especial!',
      body: '50% OFF na sua primeira limpeza residencial + brinde surpresa!',
      data: {
        tipo: 'promocao',
        desconto: 50,
        categoria: 'limpeza_residencial',
        cupom: 'PRIMEIRA50',
        brinde: true,
        validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
        acao: 'agendar_servico'
      },
      imageUrl: 'https://exemplo.com/promocao-limpeza.jpg',
      sound: 'promotion',
      icon: 'local_offer'
    };

    const resultado = await this.sendNotificationUseCase.sendToAll(promocao);

    await this.registrarCampanha('promocao_geral_janeiro', resultado);
    return resultado;
  }

  async enviarPromocaoSegmentada(categoria: string, desconto: number) {
    const promocao: CreateNotificationDto = {
      title: `🏷️ ${desconto}% OFF em ${categoria}`,
      body: `Aproveite ${desconto}% de desconto em todos os produtos de ${categoria}!`,
      data: {
        tipo: 'promocao_categoria',
        categoria: categoria,
        desconto: desconto,
        acao: 'ver_produtos'
      },
      sound: 'offer'
    };

    return await this.sendNotificationUseCase.sendToTopic(promocao, categoria);
  }
}
```

#### 🚨 **5. Notificações do Sistema**
```typescript
// src/services/sistema.service.ts
@Injectable()
export class SistemaService {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {}

  async notificarManutencao(inicio: Date, fim: Date) {
    const manutencao: CreateNotificationDto = {
      title: '🚨 Manutenção Programada',
      body: `O app ficará indisponível de ${this.formatarData(inicio)} até ${this.formatarData(fim)}`,
      data: {
        tipo: 'manutencao',
        inicio: inicio.toISOString(),
        fim: fim.toISOString(),
        duracao: `${Math.round((fim.getTime() - inicio.getTime()) / (1000 * 60))} minutos`
      },
      sound: 'urgent',
      icon: 'build'
    };

    return await this.sendNotificationUseCase.sendToAll(manutencao);
  }

  async notificarAtualizacaoCritica(versao: string, forcada: boolean = false) {
    const atualizacao: CreateNotificationDto = {
      title: forcada ? '🚨 Atualização Obrigatória' : '📱 Nova Versão Disponível',
      body: `Atualize para a versão ${versao} para continuar usando o app.`,
      data: {
        tipo: 'atualizacao',
        versao: versao,
        forcada: forcada,
        acao: forcada ? 'atualizar_agora' : 'atualizar_opcional'
      },
      sound: forcada ? 'urgent' : 'notification'
    };

    return await this.sendNotificationUseCase.sendToAll(atualizacao);
  }
}
```

### 🎯 **Gerenciamento de Preferências do Usuário**
```typescript
// src/services/preferencias.service.ts
@Injectable()
export class PreferenciasService {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly topicManagementUseCase: TopicManagementUseCase
  ) {}

  async atualizarPreferenciasUsuario(userToken: string, preferencias: {
    receberPromocoes: boolean;
    receberLembretes: boolean;
    categoriasInteresse: string[];
  }) {
    const resultados = [];

    // Gerenciar inscrição em promoções
    if (preferencias.receberPromocoes) {
      resultados.push(await this.topicManagementUseCase.subscribeToTopic(userToken, 'promocoes'));
    } else {
      resultados.push(await this.topicManagementUseCase.unsubscribeFromTopic(userToken, 'promocoes'));
    }

    // Gerenciar inscrição em lembretes
    if (preferencias.receberLembretes) {
      resultados.push(await this.topicManagementUseCase.subscribeToTopic(userToken, 'lembretes'));
    } else {
      resultados.push(await this.topicManagementUseCase.unsubscribeFromTopic(userToken, 'lembretes'));
    }

    // Gerenciar categorias de interesse
    const categoriasAtuais = await this.buscarTopicosUsuario(userToken);
    const categoriasParaRemover = categoriasAtuais.filter(cat => !preferencias.categoriasInteresse.includes(cat));
    const categoriasParaAdicionar = preferencias.categoriasInteresse.filter(cat => !categoriasAtuais.includes(cat));

    for (const categoria of categoriasParaRemover) {
      resultados.push(await this.topicManagementUseCase.unsubscribeFromTopic(userToken, categoria));
    }

    for (const categoria of categoriasParaAdicionar) {
      resultados.push(await this.topicManagementUseCase.subscribeToTopic(userToken, categoria));
    }

    // Notificar usuário sobre mudança de preferências
    const notificacao: CreateNotificationDto = {
      title: 'Preferências Atualizadas ✅',
      body: 'Suas preferências de notificação foram atualizadas com sucesso.',
      data: {
        tipo: 'preferencias_atualizadas',
        promocoes: preferencias.receberPromocoes,
        lembretes: preferencias.receberLembretes,
        categorias: preferencias.categoriasInteresse
      }
    };

    await this.sendNotificationUseCase.sendToUser(notificacao, userToken);

    return { sucesso: true, resultados };
  }
}
```

## 📁 Estrutura do Projeto

```
src/
├── notifications/
│   ├── domain/                    # Camada de Domínio
│   │   ├── entities/
│   │   │   └── notification.entity.ts
│   │   ├── interfaces/
│   │   │   └── notification.service.interface.ts
│   │   └── index.ts
│   ├── application/               # Camada de Aplicação
│   │   ├── dto/
│   │   │   └── notification.dto.ts
│   │   ├── use-cases/
│   │   │   ├── send-notification.use-case.ts
│   │   │   └── topic-management.use-case.ts
│   │   └── index.ts
│   ├── infrastructure/            # Camada de Infraestrutura
│   │   ├── config/
│   │   │   └── firebase.config.ts
│   │   ├── firebase/
│   │   │   └── firebase-notification.service.ts
│   │   └── index.ts
│   ├── presentation/              # Camada de Apresentação
│   │   ├── controllers/
│   │   │   └── notification.controller.ts
│   │   └── index.ts
│   └── notification.module.ts     # Módulo Principal
├── firebase/
│   └── firebase.module.ts         # Módulo Firebase
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

## 🔧 Troubleshooting

### **Problemas Comuns e Soluções**

#### **❌ Erro: "EADDRINUSE: address already in use"**
```bash
# Verificar processos usando a porta
lsof -i :3001

# Matar processo específico
kill -9 <PID>

# Ou matar todos os processos Node.js
pkill -f node
```

#### **❌ Erro: "Firebase project not found"**
- ✅ Verifique se o arquivo `config/*.json` existe e está correto
- ✅ Confirme se o `project_id` no JSON corresponde ao projeto Firebase
- ✅ Verifique se a conta de serviço tem permissões adequadas

#### **❌ Erro: "Invalid registration token"**
```typescript
// O token FCM pode ter expirado ou ser inválido
// Sempre valide o token antes de enviar
if (!token || !token.includes(':')) {
  throw new Error('Token FCM inválido');
}
```

#### **❌ Erro: "Message rate exceeded"**
- ✅ Implemente controle de taxa (rate limiting)
- ✅ Use filas para envios em lote
- ✅ Aguarde entre envios consecutivos

#### **❌ Notificações não chegam no dispositivo**
```typescript
// Verifique se o dispositivo está registrado corretamente
const debugNotification = {
  title: 'Teste de Conectividade',
  body: 'Se você recebeu esta notificação, o FCM está funcionando!',
  data: {
    tipo: 'teste_conectividade',
    timestamp: new Date().toISOString()
  }
};
```

### **📊 Monitoramento e Logs**

#### **Logs Estruturados**
```typescript
// Exemplo de log estruturado
logger.log({
  level: 'info',
  message: 'Notificação enviada com sucesso',
  notificationId: notification.id,
  target: result.target,
  messageId: result.messageId,
  timestamp: new Date().toISOString()
});
```

#### **Métricas Recomendadas**
- Taxa de sucesso de envio
- Tempo médio de resposta do FCM
- Número de tokens inválidos
- Distribuição por tipo de notificação
- Taxa de abertura (se implementado no app)

## 💡 Melhores Práticas

### **📱 Notificações**

1. **Seja Conciso**: Títulos até 40 caracteres, corpo até 160
2. **Use Ação Clara**: Campo `data.acao` para deep linking
3. **Personalize**: Use dados do usuário quando possível
4. **Evite Spam**: Respeite frequência de notificações
5. **Teste**: Sempre teste em diferentes dispositivos

### **🏗️ Arquitetura**

1. **Use Cases**: Sempre use os Use Cases em vez de acessar infraestrutura diretamente
2. **DTOs**: Mantenha a separação entre camadas usando DTOs
3. **Injeção**: Use injeção de dependências para facilitar testes
4. **Logs**: Implemente logging adequado em todos os níveis
5. **Tratamento de Erros**: Sempre trate erros gracefully

### **🔒 Segurança**

1. **Validação**: Sempre valide tokens e dados de entrada
2. **Rate Limiting**: Implemente controle de taxa para prevenir abuso
3. **Auditoria**: Mantenha histórico de todas as notificações enviadas
4. **Privacidade**: Não inclua dados sensíveis no payload

### **📈 Performance**

1. **Cache**: Cache tokens válidos quando possível
2. **Batch**: Use envios em lote para múltiplas notificações
3. **Async**: Sempre use operações assíncronas
4. **Pool**: Considere connection pooling para alta carga
5. **Monitor**: Monitore métricas de performance

### **🧪 Testes**

1. **Mocks**: Use mocks para serviços externos (Firebase)
2. **Cenários**: Teste casos de sucesso e falha
3. **Integração**: Teste integração completa quando possível
4. **Performance**: Teste carga em ambiente de staging
5. **Regressão**: Mantenha testes para evitar regressões

## 🚀 Deploy e Produção

### **Variáveis de Ambiente para Produção**

```bash
# .env.production
NODE_ENV=production
PORT=3001

# Firebase já configurado via arquivo JSON
# Database URL se usar Firestore
DATABASE_URL=your-database-url

# Logging
LOG_LEVEL=warn

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# Cache (se implementado)
REDIS_URL=redis://localhost:6379
```

### **Docker**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Build da aplicação
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  notifications:
    build: .
    ports:
      - "3001:3001"
    volumes:
      - ./config:/app/config:ro
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### **Health Checks**

```typescript
// src/app.controller.ts
@Get('health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
}
```

### **Métricas e Observabilidade**

```typescript
// Exemplo com Prometheus
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [PrometheusModule.register()],
})
export class AppModule {}

// Endpoint: /metrics
```

## 🔧 Uso Interno na Aplicação

### 📦 **Injeção de Dependências**

Para usar o serviço de notificações dentro de outros módulos da aplicação:

```typescript
// src/qualquer-modulo/qualquer.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { SendNotificationUseCase, TopicManagementUseCase } from '../notifications/application';
import { CreateNotificationDto } from '../notifications/application';

@Injectable()
export class MeuServico {
  constructor(
    @Inject('INotificationService')
    private readonly notificationService: INotificationService,

    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly topicManagementUseCase: TopicManagementUseCase
  ) {}

  async exemploUsoInterno(userToken: string) {
    // Usando o Use Case (recomendado)
    const notificacao: CreateNotificationDto = {
      title: 'Olá Interno!',
      body: 'Esta notificação veio do código interno',
      data: { origem: 'codigo_interno' }
    };

    return await this.sendNotificationUseCase.sendToUser(notificacao, userToken);

    // Ou usando o serviço diretamente
    // const notificationEntity = NotificationEntity.create('Título', 'Corpo');
    // return await this.notificationService.sendToUser(notificationEntity, userToken);
  }
}
```

### 🏗️ **Estrutura para Novos Módulos**

```typescript
// src/meu-modulo/meu-modulo.module.ts
import { Module } from '@nestjs/common';
import { NotificationModule } from '../notifications/notification.module';
import { MeuServico } from './meu-servico.service';

@Module({
  imports: [NotificationModule], // Importa o módulo de notificações
  providers: [MeuServico],
  exports: [MeuServico]
})
export class MeuModuloModule {}
```

### 🎯 **Padrões Recomendados**

```typescript
// src/shared/services/notification-facade.service.ts
import { Injectable } from '@nestjs/common';
import { SendNotificationUseCase } from '../notifications/application';
import { CreateNotificationDto } from '../notifications/application';

@Injectable()
export class NotificationFacadeService {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {}

  // Método helper para notificações de pedido
  async notificarPedidoStatus(userToken: string, pedidoId: string, status: string) {
    const mensagens = {
      'confirmado': { title: '✅ Pedido Confirmado', body: `Pedido #${pedidoId} confirmado!` },
      'preparando': { title: '👨‍🍳 Preparando', body: `Seu pedido #${pedidoId} está sendo preparado.` },
      'pronto': { title: '🚀 Pedido Pronto', body: `Pedido #${pedidoId} pronto para retirada!` },
      'entregue': { title: '📦 Pedido Entregue', body: `Pedido #${pedidoId} entregue com sucesso!` }
    };

    const config = mensagens[status];
    if (!config) return;

    const notificacao: CreateNotificationDto = {
      title: config.title,
      body: config.body,
      data: {
        tipo: 'status_pedido',
        pedidoId: pedidoId,
        status: status,
        acao: 'ver_pedido'
      },
      sound: status === 'entregue' ? 'success' : 'notification'
    };

    return await this.sendNotificationUseCase.sendToUser(notificacao, userToken);
  }

  // Método helper para promoções
  async enviarPromocao(categoria: string, desconto: number, titulo: string, descricao: string) {
    const promocao: CreateNotificationDto = {
      title: titulo,
      body: descricao,
      data: {
        tipo: 'promocao',
        categoria: categoria,
        desconto: desconto,
        acao: 'ver_oferta'
      },
      sound: 'promotion'
    };

    return await this.sendNotificationUseCase.sendToTopic(promocao, categoria);
  }
}
```

## 📚 Documentação Técnica

### 🏛️ **Arquitetura Detalhada**

#### **Clean Architecture Layers**

```
┌─────────────────────────────────────┐
│         📱 Presentation Layer       │
│  - Controllers REST                 │
│  - DTOs de entrada/saída            │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│       🏃 Application Layer          │
│  - Use Cases (SendNotification)     │
│  - DTOs de aplicação               │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│         🎯 Domain Layer             │
│  - Entities (NotificationEntity)   │
│  - Interfaces (INotificationService)│
│  - Business Rules                   │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│       🔧 Infrastructure Layer       │
│  - Firebase Service                 │
│  - Repositories                     │
│  - External APIs                    │
└─────────────────────────────────────┘
```

### 🔌 **Interfaces Principais**

#### **INotificationService**
```typescript
interface INotificationService {
  // Envio direto para diferentes alvos
  sendToAll(notification: NotificationEntity): Promise<NotificationResult>;
  sendToUser(notification: NotificationEntity, token: string): Promise<NotificationResult>;
  sendToTopic(notification: NotificationEntity, topic: string): Promise<NotificationResult>;

  // Envio genérico com alvo dinâmico
  send(notification: NotificationEntity, target: NotificationTarget): Promise<NotificationResult>;

  // Gerenciamento de tópicos
  subscribeToTopic(token: string, topic: string): Promise<boolean>;
  unsubscribeFromTopic(token: string, topic: string): Promise<boolean>;
}
```

#### **NotificationEntity**
```typescript
class NotificationEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly body: string,
    public readonly data?: Record<string, any>,    // Dados customizados
    public readonly imageUrl?: string,             // URL da imagem
    public readonly icon?: string,                 // Ícone (Android)
    public readonly sound?: string,                // Som da notificação
  ) {}

  // Método factory para criar notificações
  static create(
    title: string,
    body: string,
    data?: Record<string, any>,
    imageUrl?: string,
    icon?: string,
    sound?: string,
  ): NotificationEntity

  // Converte para formato de resposta
  toResponse(): object
}
```

#### **NotificationTarget**
```typescript
interface NotificationTarget {
  type: 'all' | 'single' | 'topic';  // Tipo de envio
  value?: string;                    // Token (single) ou nome do tópico (topic)
}
```

#### **NotificationResult**
```typescript
interface NotificationResult {
  success: boolean;           // Se o envio foi bem-sucedido
  messageId?: string;         // ID da mensagem FCM (sucesso)
  error?: string;            // Mensagem de erro (falha)
  target: NotificationTarget; // Alvo da notificação
}
```

### Configuração FCM

O serviço configura automaticamente:

- **Android**: Prioridade alta, som padrão, click action
- **iOS**: Badge count, som personalizado, configurações APNS
- **Web**: Suporte completo para notificações web

### Tratamento de Erros

- **Token Inválido**: Retorna erro específico
- **Tópico Não Existe**: Cria tópico automaticamente
- **Limite de FCM**: Implementa retry logic
- **Conectividade**: Logging detalhado de falhas

## 🔧 Desenvolvimento

### Comandos Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia em modo desenvolvimento
npm run build             # Compila para produção
npm run start:prod        # Executa versão compilada

# Qualidade de Código
npm run lint              # Executa ESLint
npm run format            # Formata código com Prettier

# Testes
npm run test              # Executa testes unitários
npm run test:e2e          # Executa testes end-to-end
npm run test:cov          # Gera relatório de cobertura
```

### Extensibilidade

O serviço foi projetado para ser facilmente extensível:

- **Novos Provedores**: Implemente `INotificationService`
- **Novos Canais**: Adicione métodos na interface
- **Middleware**: Use cases podem ser decorados
- **Configurações**: Firebase config é injetável

## ❓ FAQ - Perguntas Frequentes

### **🔑 Como obter o token FCM do dispositivo?**

```typescript
// No app Flutter/React Native, importe o Firebase Messaging
import 'package:firebase_messaging/firebase_messaging.dart';

// Solicitar permissão e obter token
FirebaseMessaging messaging = FirebaseMessaging.instance;

NotificationSettings settings = await messaging.requestPermission();

String? token = await messaging.getToken();
print('FCM Token: $token');
```

### **📱 As notificações funcionam quando o app está fechado?**

✅ **Sim!** As notificações push do FCM funcionam mesmo com o app fechado, desde que:
- O dispositivo tenha conexão com internet
- O token FCM seja válido
- As permissões de notificação estejam concedidas

### **♻️ Como renovar tokens expirados?**

```typescript
// No app mobile, escute mudanças no token
FirebaseMessaging.instance.onTokenRefresh.listen((newToken) {
  // Envie o novo token para seu servidor
  updateUserToken(userId, newToken);
});
```

### **🎯 Qual a diferença entre tópicos e tokens individuais?**

| Aspecto | Token Individual | Tópico |
|---------|------------------|--------|
| **Alvo** | 1 dispositivo específico | Múltiplos dispositivos |
| **Gerenciamento** | Automático pelo FCM | Manual (subscribe/unsubscribe) |
| **Uso** | Notificações pessoais | Campanhas, categorias |
| **Limite** | Ilimitado | 2000 tópicos por app |

### **⚡ Como melhorar a performance?**

```typescript
// 1. Use batch sending para múltiplas notificações
const batch = admin.messaging().sendAll(messages);

// 2. Implemente cache de tokens válidos
const cachedTokens = await redis.get('valid_tokens');

// 3. Use connection pooling
const firebaseConfig = {
  httpAgent: new Agent({ keepAlive: true, maxSockets: 10 })
};
```

### **🔒 É seguro enviar dados sensíveis?**

❌ **Não!** Evite dados sensíveis no payload das notificações. Use apenas:
- IDs de referência
- URLs de deep linking
- Metadados não sensíveis

Para dados sensíveis, faça o app buscar do servidor quando a notificação for aberta.

### **🌍 Como funciona em diferentes países?**

✅ **Totalmente suportado!** O FCM funciona globalmente, mas considere:
- Fusos horários para agendamento
- Idiomas locais para mensagens
- Regulamentações locais (LGPD, GDPR, etc.)

## 🤝 Contribuição

### **Fluxo de Desenvolvimento**

1. 🍴 **Fork** o projeto
2. 🌿 **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. ✅ **Implemente** seguindo os padrões estabelecidos
4. 🧪 **Adicione testes** para sua funcionalidade
5. 📝 **Atualize a documentação** se necessário
6. 🚀 **Commit** suas mudanças:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade"
   ```
7. 📤 **Push** para sua branch:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
8. 🔄 **Abra um Pull Request**

### **Padrões de Código**

- 📏 **ESLint**: Seguir configuração padrão
- 🎨 **Prettier**: Formatação automática
- 🧪 **Testes**: Cobertura mínima de 80%
- 📚 **TypeScript**: Tipagem rigorosa
- 🏗️ **Clean Architecture**: Respeitar camadas

### **Tipos de Commit**

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| ✨ `feat` | Nova funcionalidade | `feat: adiciona suporte a tópicos` |
| 🐛 `fix` | Correção de bug | `fix: corrige envio para tópicos` |
| 📚 `docs` | Documentação | `docs: atualiza README` |
| 🎨 `style` | Formatação | `style: formata código` |
| ♻️ `refactor` | Refatoração | `refactor: simplifica use case` |
| 🧪 `test` | Testes | `test: adiciona testes unitários` |

## 📄 Licença

Este projeto está sob a licença **UNLICENSED**.

## 🆘 Suporte e Contato

### **Canais de Suporte**

- 📧 **Email**: suporte@empresa.com
- 💬 **Discord/Slack**: #notificacoes
- 📋 **Issues**: [GitHub Issues](https://github.com/seu-repo/issues)
- 📖 **Documentação**: Este README
- 🧪 **Exemplos**: Pasta `src/notifications/examples/`

### **Reportando Problemas**

Ao reportar um bug, inclua:

```markdown
**Descrição:**
Breve descrição do problema

**Para Reproduzir:**
1. Passos para reproduzir
2. Comportamento esperado
3. Comportamento atual

**Ambiente:**
- Versão do Node.js:
- Sistema Operacional:
- Versão do Firebase Admin SDK:

**Logs:**
```
2024-01-10 10:30:00 ERROR [FirebaseNotificationService] Erro ao enviar...
```

**Código de Exemplo:**
```typescript
// Código que causou o problema
await sendNotificationUseCase.sendToUser(notification, token);
```
```

---

## 🎉 **Resumo Final**

Este é um **sistema completo e robusto** de notificações push construído com:

- 🏗️ **Clean Architecture** para manutenibilidade
- 🔧 **NestJS** para estrutura enterprise
- 🔥 **Firebase Cloud Messaging** para delivery confiável
- 📱 **Suporte multiplataforma** (Android, iOS, Web)
- 🧪 **Testes abrangentes** e documentação completa
- 🚀 **Pronto para produção** com configurações otimizadas

### **🚀 Começando Agora**

```bash
# 1. Clone e instale
git clone <repository-url>
cd notifications-nestjs
npm install

# 2. Configure Firebase
cp config/esplendidoapp-321a8-firebase-adminsdk-fbsvc-e395ed8b7f.json config/

# 3. Execute
npm run start:dev

# 4. Teste a API
curl -X POST http://localhost:3001/notifications/send-user/ePpGFh2OTB-JHLRk2ksdGO:APA91bHje7irVZenqHPsmO-Ik_sIrYN6EaiSfO3rY4ULCUjOgxQwP5DJ89BK9klChX6ruAOZTMJ3gbAKCEGQHzeSqiU_ZOEcoVTY4Zlay1OVPZNV7nzj4gs \
  -H "Content-Type: application/json" \
  -d '{"title": "Olá!", "body": "Seu primeiro teste funcionou! 🎉"}'
```

**🎯 Resultado esperado**: Notificação recebida no dispositivo com o token especificado!

---

## 📁 **Arquivos Adicionais**

- 📄 **[EXEMPLOS PRÁTICOS](./EXAMPLES.md)** - Casos de uso detalhados e código pronto para copiar
- 🧪 **[TESTES](./test/)** - Exemplos de testes unitários e E2E
- 🔧 **[CONFIGURAÇÕES](./config/)** - Arquivos de configuração do Firebase

---

**Desenvolvido com ❤️ usando NestJS e Firebase Cloud Messaging**
