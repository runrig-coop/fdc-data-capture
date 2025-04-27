import { Buffer } from 'node:buffer';
import { Connector } from '@jgaehring/connector';
import useDataCapture from '../dist/useDataCapture.js';

const connector = new Connector();
const address = connector.createAddress({
  semanticId: "http://myplatform.com/address/addressF",
  street: "f, place or Europe",
  postalCode: "0000f",
  city: "Brussels",
  country: "Belgium",
});

const capOrigin = 'http://localhost:3030';
const capPath = '/datacap';
const capUrl = capOrigin + capPath;

const username = 'admin';
const password = 'admin';
const buf = Buffer.from(username + ':' + password, 'utf-8');
const basicauth = `Basic ${buf.toString('base64')}`;
const headers = new Headers();
headers.set('Authorization', basicauth);

useDataCapture(connector, { url: capUrl, verbose: true, headers });

await connector.export([address]);
