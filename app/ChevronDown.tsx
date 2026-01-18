import React from 'react';
import { Path, Svg } from 'react-native-svg';

interface ChevronDownProps {
  size?: number;
  color?: string;
}

export function ChevronDown({ size = 24, color = '#000' }: ChevronDownProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9l6 6 6-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}