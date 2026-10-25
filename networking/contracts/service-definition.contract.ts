export interface ServiceDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
}