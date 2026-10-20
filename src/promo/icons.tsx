// Icon set from the prototype (24px grid, 1.9 stroke).
import React from "react";

const PATHS: Record<string, string> = {
  pulse: '<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
  send: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>',
  chart: '<path d="M5 20v-8M11 20V5M17 20v-5M3 20h18"/>',
  doc: '<path d="M7 3h7l5 5v13H7zM14 3v5h5M10 14.5l2 2 4-4"/>',
  bell: '<path d="M12 3.5a5.5 5.5 0 0 0-5.5 5.5v3.8L4.6 16h14.8l-1.9-3.2V9A5.5 5.5 0 0 0 12 3.5zM9.8 18.5a2.2 2.2 0 0 0 4.4 0"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  cal: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M7 7l10 10M17 7L7 17"/>',
  alert: '<path d="M12 4.5l8.5 15h-17zM12 10v4.5M12 17.2v.3"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.3"/>',
  store: '<path d="M4 9.5L5.5 4h13L20 9.5M4.5 9.5V20h15V9.5M4 9.5h16M10 20v-5h4v5"/>',
  truck: '<path d="M3 6.5h11V16H3zM14 10h3.5l3.5 3.5V16h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  users: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  play: '<path d="M8 5.5l11 6.5-11 6.5z"/>',
};

export const Icon: React.FC<{ name: string; size?: number; color?: string; style?: React.CSSProperties }> = ({
  name,
  size = 18,
  color = "currentColor",
  style,
}) => {
  if (name === "sparkle") {
    return (
      <svg viewBox="0 0 16 16" width={size} height={size} style={{ flex: "none", display: "block", ...style }}>
        <path d="M8 0l1.8 6.2L16 8l-6.2 1.8L8 16l-1.8-6.2L0 8l6.2-1.8z" fill={color} />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "none", display: "block", ...style }}
      dangerouslySetInnerHTML={{ __html: PATHS[name] ?? "" }}
    />
  );
};
