export interface Configuration {
  // Two factor app name
  appName?: string;
  // Two factor secret length, default to 20
  secretLength?: number;
  window?: number;
}