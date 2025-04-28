import type { Observer } from '@jgaehring/connector/lib/observer';

function validate(maybeUrl: unknown): URL | false {
  if (!(maybeUrl instanceof URL || typeof maybeUrl === 'string')) return false;
  try { return new URL(maybeUrl); }
  catch (_) { return false; }
}

export interface DataCapOpts {
  verbose?: boolean;
}

export default class DataCapture implements Observer<string> {
  private _url: URL | null = null;

  public verbose: boolean = false;

  constructor(maybeUrl?: URL | string, options?: DataCapOpts) {
    if (options) {
      const { verbose = false } = options;
      this.verbose = verbose;
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
      const request = fetch(this._url, { method: 'POST', body: json });
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
