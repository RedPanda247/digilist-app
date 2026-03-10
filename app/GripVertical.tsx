import React from 'react';
import { Circle, Svg } from 'react-native-svg';

interface GripVerticalProps {
  size?: number;
  color?: string;
}

export function GripVertical({ size = 24, color = '#000' }: GripVerticalProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="6" r="1.5" fill={color} />
      <Circle cx="15" cy="6" r="1.5" fill={color} />
      <Circle cx="9" cy="12" r="1.5" fill={color} />
      <Circle cx="15" cy="12" r="1.5" fill={color} />
      <Circle cx="9" cy="18" r="1.5" fill={color} />
      <Circle cx="15" cy="18" r="1.5" fill={color} />
    </Svg>
  );
}

export default GripVertical;
