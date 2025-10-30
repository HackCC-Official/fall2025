// /Components/BadgeCard.tsx
import React from 'react';
import { Badge } from '../types/badge-interface';

// Define the props interface for the component
interface BadgeCardProps {
  badge: Badge;
  onClick: (badge: Badge) => void;
}

/**
 * A component to display a single badge.
 * Applies a grayscale filter if the badge is not yet achieved.
 */
function BadgeCard({ badge, onClick }: BadgeCardProps) {
  const cardClasses = `badge-card ${badge.achieved ? 'achieved' : 'unachieved'}`;

  function handleClick() {
    onClick(badge);
  }

  return (
    <div className={cardClasses} onClick={handleClick}>
      <img
        src={badge.imageUrl}
        alt={badge.name}
        className="badge-image"
        onError={(e) => {
          // Fallback in case the image fails to load
          const target = e.target as HTMLImageElement;
          target.src = `https://placehold.co/150x150/cccccc/ffffff?text=Error`;
        }}
      />
      <h3 className="badge-name">{badge.name}</h3>
    </div>
  );
}

export default BadgeCard;
