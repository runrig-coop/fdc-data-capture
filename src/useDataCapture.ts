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

export default function useDataCapture(connector: Connector, overrides?: OptionOverrides): DataCapState {
  // @ts-ignore
  const { env = {} } = process || {};
  let {
    EXPERIMENTAL_DATA_CAPTURE_EXPORT_URL: url = '',
    EXPERIMENTAL_DATA_CAPTURE_VERBOSE: verbose = false,
  } = env;

  if (overrides?.url) url = overrides.url;
  if (typeof overrides?.verbose === 'boolean') verbose = overrides.verbose;
  const opts = { verbose };

  const observer = new DataCapture(url, opts);
  if (verbose === true) {
    const msg = `A new DataCapture observer was instantiated with a ` +
      `destination URL of ${url}.`;
    console.info(msg);
  }

  const subscription = connector.subscribe('export', observer);

  return { observer, subscription };
}
