import React from 'react';
import { Path, Svg } from 'react-native-svg';

interface TrashProps {
  size?: number;
  color?: string;
}

export function Trash({ size = 24, color = '#000' }: TrashProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 5v6m4-6v6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Trash;