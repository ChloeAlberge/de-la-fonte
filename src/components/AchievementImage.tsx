import { useState } from 'react';
import type { Character } from '../models/achievement';

interface AchievementImageProps {
  character: Character;
  fallbackLabel: string;
  size?: 'small' | 'large';
}

export function AchievementImage({ character, fallbackLabel, size = 'small' }: AchievementImageProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return (
      <div className={`achievement-placeholder ${size === 'large' ? 'achievement-placeholder-large' : ''}`}>
        {fallbackLabel}
      </div>
    );
  }

  return (
    <img
      src={`/achievements/${character}.png`}
      alt=""
      className={`achievement-image ${size === 'large' ? 'achievement-image-large' : ''}`}
      onError={() => setImageFailed(true)}
    />
  );
}