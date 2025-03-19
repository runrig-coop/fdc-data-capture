import type Connector from '../../../src/Connector';
import type { Subscription } from '../../../src/observer';
import DataCapture from './DataCapture';
import type { DataCapOpts } from './DataCapture';

interface DataCapState {
  observer: DataCapture;
  subscription: Subscription;
}

type OptionOverrides = DataCapOpts & {
  url?: ConstructorParameters<typeof DataCapture>[0];
}

export default function useDataCapture(connector: Connector, overrides: OptionOverrides = {}): DataCapState {
  // @ts-ignore
  const { env = {} } = process || {};
  let {
    EXPERIMENTAL_DATA_CAPTURE_EXPORT_URL: url = '',
    EXPERIMENTAL_DATA_CAPTURE_VERBOSE: verbose = false,
  } = env;

  if ('url' in overrides) url = overrides.url;
  if ('verbose' in overrides) verbose = overrides.verbose;
  const opts = { verbose };

  // An explicitly undefined or nullish url parameter (eg, '') will never throw,
  // but a malformed string or other invalid object may. Therefore, the observer
  // is instantiated without a URL, only the options, then set separately via
  // assignment, safely within a try..catch block.
  const observer = new DataCapture(undefined, opts);
  try {
    observer.url = url;
    if (verbose === true) {
      const msg = `A new DataCapture observer was instantiated with a ` +
        `destination URL of ${url}.`;
      console.info(msg);
    }
  } catch (error) {
    if (verbose === true) console.error(error);
  }

  // Subscribe to export events regardless; a new url can be set later.
  const subscription = connector.subscribe('export', observer);

  return { observer, subscription };
}
