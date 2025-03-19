export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPERIMENTAL_DATA_CAPTURE_EXPORT_URL?: string;
      EXPERIMENTAL_DATA_CAPTURE_VERBOSE?: boolean;
      ENV?: 'test' | 'dev' | 'prod';
    }
  }
}
