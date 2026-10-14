import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export type PresetView = 'rear' | 'three-quarter' | 'front' | 'side' | 'close-up';

export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  label: string;
}

export const CAMERA_PRESETS: Record<PresetView, CameraPreset> = {
  'rear': {
    position: [0, 0, -14],
    target: [0, 0, 0],
    label: 'Rear View',
  },
  'three-quarter': {
    position: [5.5, 2, -10],
    target: [0, 0, 0],
    label: 'Three-Quarter',
  },
  'front': {
    position: [0, 0, 14],
    target: [0, 0, 0],
    label: 'Front View',
  },
  'side': {
    position: [14, 0, 0],
    target: [0, 0, 0],
    label: 'Side View',
  },
  'close-up': {
    position: [0, -1.5, -9],
    target: [0, -1.5, 0],
    label: 'Cover Close-Up',
  },
};

interface PhoneViewPresetsProps {
  activePreset: PresetView;
  onPresetChange: (preset: PresetView) => void;
  autoRotate: boolean;
  onAutoRotateToggle: () => void;
}

export const PhoneViewPresets: React.FC<PhoneViewPresetsProps> = ({
  activePreset,
  onPresetChange,
  autoRotate,
  onAutoRotateToggle,
}) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {(Object.keys(CAMERA_PRESETS) as PresetView[]).map((key) => (
        <button
          key={key}
          onClick={() => onPresetChange(key)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
            activePreset === key
              ? 'bg-[#24232E] text-white shadow-sm'
              : 'bg-white border border-[#ECEBF0] text-[#777681] hover:text-[#22212A] hover:border-[#DDDCE3]'
          }`}
        >
          {CAMERA_PRESETS[key].label}
        </button>
      ))}
      <button
        onClick={onAutoRotateToggle}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
          autoRotate
            ? 'bg-[#A58BFA] text-white shadow-sm'
            : 'bg-white border border-[#ECEBF0] text-[#777681] hover:text-[#22212A]'
        }`}
      >
        {autoRotate ? '⏸ Auto-Rotate' : '▶ Auto-Rotate'}
      </button>
    </div>
  );
};
