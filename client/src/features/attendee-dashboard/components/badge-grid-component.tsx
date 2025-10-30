// /Components/BadgeGrid.tsx
import React from 'react';
import { Badge } from '../types/badge-interface';
import BadgeCard from './badge-card-component';

// Define the props interface for the component
interface BadgeGridProps {
  badges: Badge[];
  onBadgeClick: (badge: Badge) => void;
}

/**
 * A component to display a grid of all badges.
 */
function BadgeGrid({ badges, onBadgeClick }: BadgeGridProps) {
  return (
    <div className="badge-grid">
      {badges.map((badge) => (
        <BadgeCard key={badge.id} badge={badge} onClick={onBadgeClick} />
      ))}
    </div>
  );
}

export default BadgeGrid;
