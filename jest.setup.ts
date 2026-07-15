// jest.setup.ts
// Polyfill global fetch API structures directly from Node's built-in globalThis

import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as any;
}

// Map native globalThis fetch primitives to global context so JSDOM registers them
if (typeof global.Request === 'undefined') {
  global.Request = (globalThis as any).Request;
  global.Response = (globalThis as any).Response;
  global.Headers = (globalThis as any).Headers;
  global.fetch = (globalThis as any).fetch;
}
