/**
 * Ad hoc parsing for environment variables. This should probably be replaced
 * by something like dotenv from NPM once packaging decisions have been made.
 * They each take a key and the Node environment object (i.e., `process.env`).
 */
/// <reference path="../types/environment.d.ts" />
type EnvVarKey = keyof NodeJS.ProcessEnv;
export declare const EXPERIMENTAL_DATA_CAPTURE_EXPORT_URL = "EXPERIMENTAL_DATA_CAPTURE_EXPORT_URL";
export declare const EXPERIMENTAL_DATA_CAPTURE_VERBOSE = "EXPERIMENTAL_DATA_CAPTURE_VERBOSE";
export declare const EXPERIMENTAL_DATA_CAPTURE_USERNAME = "EXPERIMENTAL_DATA_CAPTURE_USERNAME";
export declare const EXPERIMENTAL_DATA_CAPTURE_PASSWORD = "EXPERIMENTAL_DATA_CAPTURE_PASSWORD";
export declare function getEnvVarBool(key: EnvVarKey): boolean;
export declare function getEnvVarString(key: EnvVarKey): string;
export {};
//# sourceMappingURL=environment.d.ts.map