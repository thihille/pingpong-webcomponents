import { serviceMap } from './service-map';

export function resolveService(name: string) {
  const service = serviceMap[name];
  if (!service) {
    throw new Error(`Serviço "${name}" não encontrado no service-registry`);
  }
  return service;
}