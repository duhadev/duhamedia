import React, { useId } from 'react'

/**
 * Static, server-rendered monochrome service-area locator (R9, MERGED Conflict
 * 9). Replaces the design's D3 + OpenStreetMap-tile mockups: no script, no tile
 * request, no dependency. It is a SCHEMATIC, not a street map: an equirectangular
 * projection of real coordinates (towns, lake shoreline, 10-mile graticule)
 * around the office, the service-radius ring and a scale bar.
 */

export type MapSize = 'mobile' | 'desktop'
const SIZES: Record<MapSize, [number, number]> = { mobile: [390, 360], desktop: [640, 340] }

/** The coordinates line printed over the map's bottom-left corner (rendered as HTML by the block). */
export const mapStamp = (placeName: string, lat: number, lon: number) =>
  `${placeName} · ${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`

type Props = {
  size: MapSize
  lat: number
  lon: number
  radiusMiles: number
  zoom: number
  placeName: string
  description: string
}

const MILES_PER_DEG_LAT = 69.0

/** Reference towns [name, lat, lon, label dx, label dy, anchor]. Fixed: the map treatment is fixed (R9). */
const TOWNS: [string, number, number, number, number, 'start' | 'end'][] = [
  ['Chicago', 41.8781, -87.6298, -8, -7, 'end'], // label west of the dot: land side, clear of the shoreline + hatching,
  ["O'Hare", 41.9742, -87.9073, 8, -7, 'start'],
  ['Schaumburg', 42.0334, -88.0834, -8, -7, 'end'],
  ['Naperville', 41.7508, -88.1473, -8, 15, 'end'],
  ['Aurora', 41.7606, -88.3201, -8, -7, 'end'],
  ['Joliet', 41.525, -88.0817, 8, 15, 'start'],
]

/** Western shore of Lake Michigan (lat, lon), north to south, then round the south end. */
const SHORE: [number, number][] = [
  [43.0, -87.88],
  [42.58, -87.82],
  [42.36, -87.82],
  [42.05, -87.68],
  [41.88, -87.61],
  [41.62, -87.5],
  [41.6, -87.33],
  [41.7, -86.9],
  [43.0, -86.2],
]

export function ServiceAreaMap({ size, lat, lon, radiusMiles, zoom, placeName, description }: Props) {
  const [W, H] = SIZES[size]
  // Unique per instance (mobile + desktop copies, repeated blocks): a shared id would resolve to the display:none copy.
  const waterId = `dc-water-${size}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const milesPerDegLon = 69.17 * Math.cos((lat * Math.PI) / 180)
  // Zoom 1 draws the ring at 128px radius whatever its length in miles.
  const ppm = (128 / Math.max(radiusMiles, 1)) * zoom
  const cx = W / 2
  const cy = H / 2
  const project = (la: number, lo: number): [number, number] => [
    cx + (lo - lon) * milesPerDegLon * ppm,
    cy - (la - lat) * MILES_PER_DEG_LAT * ppm,
  ]
  const inView = ([x, y]: [number, number]) => x > 24 && x < W - 24 && y > 24 && y < H - 44

  const lake = [...SHORE, [43.0, -86.2]].map(([la, lo]) => project(la, lo).map((n) => n.toFixed(1)).join(',')).join(' ')

  // 10-mile graticule through the office.
  const grid: React.ReactElement[] = []
  const stepPx = 10 * ppm
  for (let i = -Math.ceil(cx / stepPx); i <= Math.ceil(cx / stepPx); i++) {
    const x = cx + i * stepPx
    grid.push(<line key={`v${i}`} x1={x} y1={0} x2={x} y2={H} />)
  }
  for (let i = -Math.ceil(cy / stepPx); i <= Math.ceil(cy / stepPx); i++) {
    const y = cy + i * stepPx
    grid.push(<line key={`h${i}`} x1={0} y1={y} x2={W} y2={y} />)
  }

  const towns = TOWNS.map(([name, la, lo, dx, dy, anchor]) => ({ name, p: project(la, lo), dx, dy, anchor })).filter((t) => inView(t.p))
  const lakeLabel = project(42.2, -87.3)
  const scalePx = 10 * ppm
  const barEnd = cx + Math.min(W / 2 - 60, 220)

  return (
    <svg
      role="img"
      aria-label={description}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="block size-full"
    >
      <defs>
        <pattern id={waterId} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#111111" strokeOpacity="0.14" strokeWidth="1.5" />
        </pattern>
      </defs>
      <g stroke="#747069" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="2 5">
        {grid}
      </g>
      <polygon points={lake} fill={`url(#${waterId})`} stroke="#111111" strokeOpacity="0.45" strokeWidth="1.5" />
      {inView(lakeLabel) && lakeLabel[0] < W - 90 && (
        <text
          x={lakeLabel[0]}
          y={lakeLabel[1]}
          textAnchor="middle"
          fill="#747069"
          fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
          fontSize="10"
          letterSpacing="1.6"
        >
          LAKE MICHIGAN
        </text>
      )}
      <circle cx={cx} cy={cy} r={radiusMiles * ppm} fill="#111111" fillOpacity="0.06" stroke="#111111" strokeWidth="2" />
      <text
        x={cx}
        y={cy + radiusMiles * ppm + 14}
        textAnchor="middle"
        fill="#747069"
        fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
        fontSize="10"
        letterSpacing="1.2"
      >
        {`~${Math.round(radiusMiles)} MI`}
      </text>
      {towns.map((t) => (
        <g key={t.name}>
          <circle cx={t.p[0]} cy={t.p[1]} r="3" fill="#111111" />
          <text x={t.p[0] + t.dx} y={t.p[1] + t.dy} textAnchor={t.anchor} fill="#111111" fontSize="11" fontWeight="700">
            {t.name}
          </text>
        </g>
      ))}
      <rect
        x={cx - 8}
        y={cy - 8}
        width="16"
        height="16"
        transform={`rotate(45 ${cx} ${cy})`}
        fill="#c20e59"
        stroke="#111111"
        strokeWidth="2.5"
      />
      <text x={cx} y={cy + 30} textAnchor="middle" fill="#111111" style={{ fontFamily: 'var(--font-display)' }} fontSize="13" letterSpacing="0.5">
        {placeName.toUpperCase()}
      </text>
      <g stroke="#111111" strokeWidth="2">
        <line x1={barEnd - scalePx} y1={H - 30} x2={barEnd} y2={H - 30} />
        <line x1={barEnd - scalePx} y1={H - 34} x2={barEnd - scalePx} y2={H - 26} />
        <line x1={barEnd} y1={H - 34} x2={barEnd} y2={H - 26} />
      </g>
      <text
        x={barEnd - scalePx / 2}
        y={H - 38}
        textAnchor="middle"
        fill="#747069"
        fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
        fontSize="10"
        letterSpacing="1"
      >
        10 MI
      </text>
    </svg>
  )
}
