import expect from 'node:assert';
import { test } from 'node:test';
import { MockAgent } from 'undici';
import { Connector } from '@jgaehring/connector';
import useDataCapture from '../dist/useDataCapture.js';

const connector = new Connector();

const address = connector.createAddress({
    semanticId: "http://myplatform.com/address/address1",
    street: "1, place or Europe",
    postalCode: "00001",
    city: "Brussels",
    country: "Belgium",
});

const json = '{"@context":"https://www.datafoodconsortium.org","@id":"http://myplatform.com/address/address1","@type":"dfc-b:Address","dfc-b:hasCity":"Brussels","dfc-b:hasCountry":"Belgium","dfc-b:hasPostalCode":"00001","dfc-b:hasStreet":"1, place or Europe"}';


test('Address:import', async () => {
  const agent = new MockAgent();
  const dataCapOpts = { fetch: agent.request, verbose: true };
  const { observer, subscription } = useDataCapture(connector, dataCapOpts);
  observer.url = 'http://api.example.com/v1/triplestore';
  observer.verbose = false;

  const imported = await connector.import(json);
  const expected = imported[0];
  expect.strictEqual(imported.length, 1);
  expect.strictEqual(expected.equals(address), true);

  expect.doesNotThrow(() => {
      observer.complete();
      subscription.unsubscribe();
  }, '#unsubscribe');
});
