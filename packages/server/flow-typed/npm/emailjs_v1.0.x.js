// flow-typed signature: 54c5cd5e725788328eed12bc4927ab33
// flow-typed version: <<STUB>>/emailjs_v^1.0.8/flow_v0.39.0

declare module 'emailjs' {
  declare type connect = (serverConfig: Object) => Client

  declare interface Client {
    send: (msg: Object, callback: Function) => void
  }

  declare interface Server {
    connect: connect,
    Client: Client,
  }

  declare var server: Server;
}
