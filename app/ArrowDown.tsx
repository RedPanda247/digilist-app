import React from 'react';
import { Line, Polyline, Svg } from 'react-native-svg';

interface ArrowDownProps {
  size?: number;
  color?: string;
}

export function ArrowDown({ size = 24, color = '#000' }: ArrowDownProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Polyline points="5 12 12 19 19 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export default ArrowDown;
