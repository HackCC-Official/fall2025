import React from 'react';
import { Badge } from '../types/badge-interface';

// Define the props interface for the component
interface BadgeModalProps {
  badge: Badge | null;
  onClose: () => void;
}

/**
 * A modal component to display detailed information about a badge.
 */
export function BadgeInformationComponent({ badge, onClose }: BadgeModalProps) {
  if (!badge) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <img
          src={badge.imageUrl}
          alt={badge.name}
          className="modal-badge-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://placehold.co/250x250/cccccc/ffffff?text=Error`;
          }}
        />
        <h2 className="modal-badge-name">{badge.name}</h2>
        <span
          className={`modal-badge-status ${
            badge.achieved ? 'achieved' : 'unachieved'
          }`}
        >
          {badge.achieved ? 'Achieved' : 'Not Achieved'}
        </span>
        <p className="modal-badge-description">{badge.description}</p>
        <h4 className="modal-how-to-get-title">How to get this badge:</h4>
        <p className="modal-how-to-get-text">{badge.howToGet}</p>
      </div>
    </div>
  );
}

