export function PixelLifter() {
  return (
    <svg
      className="pixel-lifter"
      viewBox="0 0 10 11"
      width="28"
      height="31"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <g className="pixel-lifter-frame-a">
        <rect x="1" y="4" width="8" height="1" />
        <rect x="1" y="3" width="1" height="3" />
        <rect x="8" y="3" width="1" height="3" />
        <rect x="3" y="4" width="1" height="1" />
        <rect x="6" y="4" width="1" height="1" />
        <rect x="4" y="3" width="2" height="2" />
        <rect x="4" y="5" width="2" height="3" />
        <rect x="2" y="8" width="1" height="3" />
        <rect x="7" y="8" width="1" height="3" />
      </g>
      <g className="pixel-lifter-frame-b">
        <rect x="0" y="0" width="10" height="1" />
        <rect x="0" y="0" width="1" height="2" />
        <rect x="9" y="0" width="1" height="2" />
        <rect x="2" y="1" width="1" height="2" />
        <rect x="7" y="1" width="1" height="2" />
        <rect x="4" y="2" width="2" height="2" />
        <rect x="4" y="4" width="2" height="4" />
        <rect x="3" y="8" width="1" height="3" />
        <rect x="6" y="8" width="1" height="3" />
      </g>
    </svg>
  );
}