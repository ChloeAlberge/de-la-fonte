import { useState } from 'react';
import { getProfile, setDisplayName } from '../storage/profileStorage';
import { getAllSessions } from '../storage/sessionStorage';
import { computeUnlockedAchievements } from '../stats/achievementStats';
import { ACHIEVEMENTS } from '../models/achievement';
import type { Series } from '../models/series';
import { AchievementModal } from './AchievementModal';

interface ProfileSectionProps {
  series: Series[];
}

export function ProfileSection({ series }: ProfileSectionProps) {
  const [profile, setProfile] = useState(() => getProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(profile.displayName);
  const [showAchievements, setShowAchievements] = useState(false);

  const sessions = getAllSessions();
  const completedSessionsCount = sessions.filter((s) => s.endedAt !== null).length;
  const unlockedCount = computeUnlockedAchievements(series, sessions).length;

  function handleSave() {
    const updated = setDisplayName(draftName);
    setProfile(updated);
    setIsEditing(false);
  }

  return (
    <div className="panel">
      <h2>Profil</h2>

      {isEditing ? (
        <>
          <label>
            Nom d'affichage
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
            />
          </label>
          <div className="series-actions">
            <button onClick={handleSave}>Enregistrer</button>
            <button onClick={() => setIsEditing(false)}>Annuler</button>
          </div>
        </>
      ) : (
        <>
          <p className="profile-name">{profile.displayName || 'Aucun nom défini'}</p>
          <div className="profile-stats">
            <div className="stat-tile">
              <div className="stat-label">Séances</div>
              <div className="stat-value">{completedSessionsCount}</div>
            </div>
            <div className="stat-tile">
              <div className="stat-label">Succès débloqués</div>
              <div className="stat-value">{unlockedCount}/{ACHIEVEMENTS.length}</div>
            </div>
          </div>
          <div className="series-actions">
            <button onClick={() => setIsEditing(true)}>Modifier le nom</button>
            <button onClick={() => setShowAchievements(true)}>Voir mes succès</button>
          </div>
        </>
      )}

      {showAchievements && (
        <AchievementModal series={series} sessions={sessions} onClose={() => setShowAchievements(false)} />
      )}
    </div>
  );
}