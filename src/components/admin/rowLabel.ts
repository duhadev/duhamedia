// Config-side helper for the shared array RowLabel (F62). Not a client file: it only builds
// the PayloadComponent object (path + clientProps) that `admin.components.RowLabel` takes.
// Verified payload@3.91.0: admin.components.RowLabel is RowLabelComponent; the object form
// `{ path, exportName, clientProps }` is RawPayloadComponent (payload/dist/config/types.d.ts).
export const rowLabel = (fields: string[], fallback: string, opts: { scarcityKeys?: boolean } = {}) =>
  ({
    path: '/components/admin/FieldRowLabel',
    exportName: 'FieldRowLabel',
    clientProps: { fields, fallback, ...opts },
  }) as const
