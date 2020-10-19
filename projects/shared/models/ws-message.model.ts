export interface WsMessageModel<T = any> {
  action: string;
  data?: T;
}
