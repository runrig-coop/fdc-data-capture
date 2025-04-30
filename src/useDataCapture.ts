import { Buffer } from 'node:buffer';
import Undici, { Headers } from 'undici';
import type { Connector } from '@datafoodconsortium/connector';
import type { Subscription } from '@datafoodconsortium/connector/lib/observer';
import type { DataCapOpts } from './DataCapture';
import DataCapture from './DataCapture.js';
import {
  EXPERIMENTAL_DATA_CAPTURE_EXPORT_URL,
  EXPERIMENTAL_DATA_CAPTURE_PASSWORD,
  EXPERIMENTAL_DATA_CAPTURE_USERNAME,
  EXPERIMENTAL_DATA_CAPTURE_VERBOSE,
  getEnvVarBool,
  getEnvVarString,
} from './environment.js';

interface DataCapState {
  observer: DataCapture | null;
  subscription: Subscription | null;
}

type OptionOverrides = DataCapOpts & {
  url?: ConstructorParameters<typeof DataCapture>[0];
}

export default function useDataCapture(connector: Connector, overrides?: OptionOverrides): DataCapState {
  let { url, ...options } = overrides || {};
  options as DataCapOpts;

  const fetchIsMissing = typeof options.fetch !== 'function'
    && typeof globalThis?.fetch !== 'function';
  if (fetchIsMissing) options.fetch = Undici.fetch;

  if (typeof options.verbose !== 'boolean') {
    const verbose = getEnvVarBool(EXPERIMENTAL_DATA_CAPTURE_VERBOSE);
    if (typeof verbose === 'boolean') options.verbose = verbose;
  }

  if (typeof url !== 'string' && !(url instanceof URL)) {
    url = getEnvVarString(EXPERIMENTAL_DATA_CAPTURE_EXPORT_URL);
  }

  const username = getEnvVarString(EXPERIMENTAL_DATA_CAPTURE_USERNAME);
  const password = getEnvVarString(EXPERIMENTAL_DATA_CAPTURE_PASSWORD);
  if (username && password) {
    options.headers = new Headers(options.headers);
    if (!options.headers.has('Authorization')) {
      const buf = Buffer.from(username + ':' + password, 'utf-8');
      const credentials = `Basic ${buf.toString('base64')}`;
      options.headers.set('Authorization', credentials);
    }
  }

  try {
    const observer = new DataCapture(url, options);
    const subscription = connector.subscribe('export', observer);
    return { observer, subscription };
  } catch (error) {
    if (options.verbose) {
      console.error(error);
      const warning = 'DataCapture failed to instantiate and cannot transmit '
        + 'captured data to the remote store as configured. The overrides '
        + 'passed to useDataCapture and the options passed to the DataCapture '
        + 'constructor were the following:';
      console.warn(warning);
      console.table({ overrides, options });
    }
    return { observer: null, subscription: null };
  }
}
