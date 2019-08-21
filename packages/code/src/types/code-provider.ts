export interface CodeProvider {
  sendToClient(serviceId: string, code: string): Promise<void>;
}
