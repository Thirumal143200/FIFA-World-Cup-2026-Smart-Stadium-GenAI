// jest.setup.ts
// Polyfill global fetch API structures directly from Node's built-in globalThis

import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
}

// Map native globalThis fetch primitives to global context so JSDOM registers them
if (typeof global.Request === 'undefined') {
  global.Request = globalThis.Request;
  global.Response = globalThis.Response;
  global.Headers = globalThis.Headers;
  global.fetch = globalThis.fetch;
}
