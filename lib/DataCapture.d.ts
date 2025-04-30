import type { fetch as UndiciFetch, Headers, HeadersInit } from 'undici';
import type { Observer } from '@jgaehring/connector/lib/observer';
type fetchFn = typeof UndiciFetch | typeof globalThis.fetch;
export interface DataCapOpts {
    verbose?: boolean;
    fetch?: fetchFn;
    headers?: HeadersInit;
}
export default class DataCapture implements Observer<string> {
    private _url;
    private fetchFn;
    readonly headers: Headers;
    verbose: boolean;
    constructor(maybeUrl?: URL | string, options?: DataCapOpts);
    get url(): URL | null;
    set url(maybeUrl: unknown);
    next(json: string): void;
    error(error: Error): void;
    complete(): void;
}
export {};
//# sourceMappingURL=DataCapture.d.ts.map