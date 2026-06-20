declare module 'htmlparser2-without-node-native';

declare module 'entities' {
  export function decodeHTML(html: string): string;
}

declare module '@env' {
  export const API_BASE: string;
  export const API_URL: string;
  export const API_URL_LOCAL: string;
  export const APP_NAME: string;
  export const ONE_SIGNAL_APP_ID: string;
}
