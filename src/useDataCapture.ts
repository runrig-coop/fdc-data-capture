import type Connector from '../../../src/Connector';
import type { Subscription } from '../../../src/observer';
import type { DataCapOpts } from './DataCapture';
import DataCapture from './DataCapture';
import { getEnvVarBool, getEnvVarString } from './env';

interface DataCapState {
  observer: DataCapture;
  subscription: Subscription;
}

type OptionOverrides = DataCapOpts & {
  url?: ConstructorParameters<typeof DataCapture>[0];
}

export default function useDataCapture(connector: Connector, overrides?: OptionOverrides): DataCapState {
  let { url, ...options } = overrides || {};
  options as DataCapOpts;

  if (typeof options.verbose !== 'boolean') {
    const verbose = getEnvVarBool('EXPERIMENTAL_DATA_CAPTURE_VERBOSE');
    if (typeof verbose === 'boolean') options.verbose = verbose;
  }

  if (typeof url !== 'string' && !(url instanceof URL)) {
    url = getEnvVarString('EXPERIMENTAL_DATA_CAPTURE_EXPORT_URL');
  }

  const observer = new DataCapture(url, options);
  const subscription = connector.subscribe('export', observer);

  return { observer, subscription };
}
