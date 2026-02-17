import React from 'react';
import { Circle, Svg } from 'react-native-svg';

interface MoreVerticalProps {
  size?: number;
  color?: string;
}

export function MoreVertical({ size = 24, color = '#000' }: MoreVerticalProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="5" r="1.5" fill={color} />
      <Circle cx="12" cy="12" r="1.5" fill={color} />
      <Circle cx="12" cy="19" r="1.5" fill={color} />
    </Svg>
  );
}

export default MoreVertical;
