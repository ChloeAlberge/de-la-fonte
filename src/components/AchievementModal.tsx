import { useState } from 'react';
import type { Series } from '../models/series';
import type { Session } from '../models/session';
import { ACHIEVEMENTS, type Achievement, type Character } from '../models/achievement';
import { computeUnlockedAchievements } from '../stats/achievementStats';
import { Modal } from './Modal';
import { AchievementImage } from './AchievementImage';

interface AchievementModalProps {
  series: Series[];
  sessions: Session[];
  onClose: () => void;
}

const CHARACTER_LABELS: Record<Character, string> = {
  coach: 'Le coach',
  veteran: 'Le vétéran',
  upper_body: 'Haut du corps',
  lower_body: 'Bas du corps',
  mystery: 'Le mystère',
};

const CHARACTER_INITIAL: Record<Character, string> = {
  coach: 'C',
  veteran: 'V',
  upper_body: 'H',
  lower_body: 'B',
  mystery: '?',
};

export function AchievementModal({ series, sessions, onClose }: AchievementModalProps) {
  const [selected, setSelected] = useState<Achievement | null>(null);

  const unlocked = computeUnlockedAchievements(series, sessions);
  const unlockedIds = new Set(unlocked.map((a) => a.id));

  return (
    <Modal onClose={onClose} variant="hud">
      <h2>Mes succès</h2>

      <div className="achievement-grid">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlockedIds.has(achievement.id);
          const isMystery = achievement.character === 'mystery';
          const displayTitle = isMystery && !isUnlocked ? '???' : achievement.title;

          return (
            <button
              key={achievement.id}
              type="button"
              className={`achievement-card ${isUnlocked ? 'achievement-unlocked' : 'achievement-locked'}`}
              onClick={() => setSelected(achievement)}
            >
              <AchievementImage
                character={achievement.character}
                fallbackLabel={CHARACTER_INITIAL[achievement.character]}
              />
              <span>{displayTitle}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="achievement-detail-overlay" onClick={() => setSelected(null)}>
          <div className="achievement-detail-card" onClick={(e) => e.stopPropagation()}>
            <AchievementImage
              character={selected.character}
              fallbackLabel={CHARACTER_INITIAL[selected.character]}
              size="large"
            />
            <h3>
              {selected.character === 'mystery' && !unlockedIds.has(selected.id)
                ? '???'
                : selected.title}
            </h3>
            <p>{CHARACTER_LABELS[selected.character]}</p>
            <p>
              {selected.character === 'mystery' && !unlockedIds.has(selected.id)
                ? 'Continue régulièrement pour percer le mystère...'
                : selected.description}
            </p>
            <button type="button" onClick={() => setSelected(null)}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}