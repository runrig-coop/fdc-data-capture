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
  const verbose = typeof overrides?.verbose === 'boolean'
    ? overrides.verbose
    : getEnvVarBool('EXPERIMENTAL_DATA_CAPTURE_VERBOSE');
  const url = typeof overrides?.url === 'string' || overrides?.url instanceof URL
    ? overrides.url
    : getEnvVarString('EXPERIMENTAL_DATA_CAPTURE_EXPORT_URL');

  const observer = new DataCapture(url, { verbose });
  const subscription = connector.subscribe('export', observer);

  return { observer, subscription };
}
