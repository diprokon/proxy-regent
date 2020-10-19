export interface WsActionModel<T = any> {
  action: string;
  data?: T;
}
