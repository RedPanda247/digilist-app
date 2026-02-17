import React from 'react';
import { Circle, Path, Svg } from 'react-native-svg';

interface PaletteProps {
  size?: number;
  color?: string;
}

export function Palette({ size = 24, color = '#000' }: PaletteProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.48-9-10-9z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="6.5" cy="11.5" r="1.5" fill={color} />
      <Circle cx="9.5" cy="7.5" r="1.5" fill={color} />
      <Circle cx="14.5" cy="7.5" r="1.5" fill={color} />
      <Circle cx="17.5" cy="11.5" r="1.5" fill={color} />
    </Svg>
  );
}

export default Palette;
