import type { ServiceDefinition } from '../contracts/service-definition.contract';

export const serviceMap: Record<string, ServiceDefinition> = {
  recuperar_dados: { method: 'GET', path: '/popups/data' },
  enviar_feedback: { method: 'POST', path: '/feedback' },
};