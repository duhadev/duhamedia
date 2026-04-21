import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _client: NeonQueryFunction<false, false> | null = null;

function client(): NeonQueryFunction<false, false> {
  if (!_client) {
    const url = process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL;
    if (!url) throw new Error("NEON_DATABASE_URL is not set");
    _client = neon(url);
  }
  return _client;
}

// Tagged-template query — deferred so builds succeed without DATABASE_URL.
const _sql = (strings: TemplateStringsArray, ...params: unknown[]) =>
  client()(strings, ...params);

// Forward the extra methods (query, unsafe, transaction) lazily.
Object.defineProperties(_sql, {
  query: { get: () => client().query.bind(client()) },
  unsafe: { get: () => client().unsafe.bind(client()) },
  transaction: { get: () => client().transaction.bind(client()) },
});

export const sql = _sql as unknown as NeonQueryFunction<false, false>;
