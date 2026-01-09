import * as admin from 'firebase-admin';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

/**
 * Configuração e inicialização do Firebase Admin SDK
 */
@Injectable()
export class FirebaseConfig {
  private static initialized = false;

  constructor() {
    this.initializeFirebase();
  }

  /**
   * Inicializa o Firebase Admin SDK se ainda não foi inicializado
   */
  private initializeFirebase(): void {
    if (!FirebaseConfig.initialized) {
      // Caminho absoluto para o arquivo de configuração
      const configPath = path.resolve(__dirname, '../../../../../config/esplendidoapp-321a8-firebase-adminsdk-fbsvc-e395ed8b7f.json');
      const serviceAccount = require(configPath);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });

      FirebaseConfig.initialized = true;
    }
  }

  /**
   * Retorna a instância do Firebase Admin
   */
  getFirebaseAdmin(): typeof admin {
    return admin;
  }

  /**
   * Retorna o serviço de messaging do Firebase
   */
  getMessaging(): admin.messaging.Messaging {
    return admin.messaging();
  }
}