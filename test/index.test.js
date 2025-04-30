import expect from 'node:assert';
import { suite, test } from 'node:test';
import { MockAgent, setGlobalDispatcher } from 'undici';
import { Connector } from '@jgaehring/connector';
import { useDataCapture } from '../lib';

suite('DataCapture', async () => {
  const agent = new MockAgent({ enableCallHistory: true });
  setGlobalDispatcher(agent);

  const capOrigin = 'http://api.example.com';
  const capPath = '/v1/triplestore';
  const capUrl = capOrigin + capPath;

  const connector = new Connector();

  const address = connector.createAddress({
      semanticId: "http://myplatform.com/address/address1",
      street: "1, place or Europe",
      postalCode: "00001",
      city: "Brussels",
      country: "Belgium",
  });

  const json = '{"@context":"https://www.datafoodconsortium.org","@id":"http://myplatform.com/address/address1","@type":"dfc-b:Address","dfc-b:hasCity":"Brussels","dfc-b:hasCountry":"Belgium","dfc-b:hasPostalCode":"00001","dfc-b:hasStreet":"1, place or Europe"}';

  test('useDataCapture', async () => {
    const pool = agent.get(capOrigin);
    pool.intercept({
      path: capPath,
      method: 'POST',
    }).reply(200, ({ body }) => ({ body }));

    const capOpts = { verbose: true };
    const { observer, subscription } = useDataCapture(connector, capOpts);
    observer.url = capUrl;
    observer.verbose = false;

    const serialized = await connector.export([address]);

    const capCalls = agent.getCallHistory()?.filterCallsByOrigin(capOrigin);
    expect.ok(capCalls);
    expect.ok(capCalls.length === 1);

    const [{ body }] = capCalls;
    expect.strictEqual(body, json)
    expect.strictEqual(serialized, json);

    expect.doesNotThrow(() => {
        observer.complete();
        subscription.unsubscribe();
    }, '#unsubscribe');

    await pool.close();
  });
});
