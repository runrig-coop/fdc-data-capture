import type { fetch as UndiciFetch, Headers, HeadersInit } from 'undici';
import type { Observer } from '@datafoodconsortium/connector/lib/observer';

function validate(maybeUrl: unknown): URL | false {
  if (!(maybeUrl instanceof URL || typeof maybeUrl === 'string')) return false;
  try { return new URL(maybeUrl); }
  catch (_) { return false; }
}

type fetchFn = typeof UndiciFetch | typeof globalThis.fetch;
export interface DataCapOpts {
  verbose?: boolean;
  fetch?: fetchFn;
  headers?: HeadersInit;
}

export default class DataCapture implements Observer<string> {
  private _url: URL | null = null;
  private fetchFn: fetchFn;

  public readonly headers: Headers;
  public verbose: boolean = false;

  constructor(maybeUrl?: URL | string, options?: DataCapOpts) {
    const h = options?.headers as globalThis.HeadersInit;
    this.headers = new globalThis.Headers(h) as Headers;
    if (!this.headers.has('Content-Type')) {
      this.headers.set('Content-Type', 'application/ld+json');
    }

    if (typeof options?.verbose === 'boolean') this.verbose = options.verbose;

    if (typeof options?.fetch === 'function') this.fetchFn = options.fetch;
    else if (typeof globalThis?.fetch === 'function') {
      this.fetchFn = globalThis.fetch;
    } else {
      const msg = 'No fetch function found. To instantiate DataCapture, '
        + 'set options.fetch to a valid fetch function or upgrade to a valid '
        + 'application environment that provides globalThis.fetch. For more '
        + 'information on fetch in Node or browsers, respectively, see:\n'
        + 'https://nodejs.org/en/learn/getting-started/fetch\n'
        + 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch';
      throw new Error(msg);
    }

    const url = validate(maybeUrl);
    if (url) this._url = url;
    if (url && this.verbose) {
      const msg = `A new DataCapture observer was instantiated with a ` +
        `destination URL of ${url}.`;
      console.info(msg);
    } else if (this.verbose) {
      const msg =
        'DataCapture observer was initialized without a destination URL. ' +
        'Set DataCapture.prototype.url to a valid URL to begin capturing ' +
        'data from the DFC Connector\'s export events.';
      console.warn(msg);
    }
  }

  get url (): URL | null {
    return this._url;
  }

  set url(maybeUrl: unknown) {
    const url = validate(maybeUrl);
    if (url) this._url = url;
    else {
      const msg =
        `An attempt to set the DataCapture observer's destination URL failed ` +
        `because a non-nullish but invalid URL was provided: ${maybeUrl}. ` +
        `The stored URL has reverted to its previous value: ${this.url}.`;
      throw new Error(msg);
    }
  }

  next(json: string): void {
    if (this._url) {
      const opts = { method: 'POST', headers: this.headers, body: json };
      const request = this.fetchFn(this._url, opts);
      if (this.verbose) {
        request.then((response) => { console.info(response); })
          .catch((reason) => { console.error(reason); });
      }
    }
  }

  error(error: Error): void {
    if (this.verbose) console.error(error);
  }

  complete(): void {
    if (this.verbose) {
      console.info(`DataCapture observer for ${this._url} has been closed.`);
    }
  }
}
