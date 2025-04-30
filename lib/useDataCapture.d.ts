import type { Connector } from '@jgaehring/connector';
import type { Subscription } from '@jgaehring/connector/lib/observer';
import type { DataCapOpts } from './DataCapture';
import DataCapture from './DataCapture.js';
interface DataCapState {
    observer: DataCapture | null;
    subscription: Subscription | null;
}
type OptionOverrides = DataCapOpts & {
    url?: ConstructorParameters<typeof DataCapture>[0];
};
export default function useDataCapture(connector: Connector, overrides?: OptionOverrides): DataCapState;
export {};
//# sourceMappingURL=useDataCapture.d.ts.map