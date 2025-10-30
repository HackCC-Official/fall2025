import { useState } from 'react';
import { BadgeInformationComponent } from './badge-information-component';
import BadgeGridComponent from './badge-grid-component';
import { Badge } from '../types/badge-interface';
// Import your actual badge data
import { BADGE_DATA } from '../data/badge-data'; // Assuming the export is named BADGE_DATA

export function HackpassSection() {
  // --- State ---
  // Keep track of all badges, initialized with your data
  const [badges] = useState<Badge[]>(BADGE_DATA);
  // Keep track of the currently selected badge, starting with none (null)
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // --- Handlers ---
  // This function will be called by BadgeGridComponent when a badge is clicked
  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
  };

  // This function will be called by BadgeInformationComponent to close the details view
  const handleCloseInfo = () => {
    setSelectedBadge(null);
  };

  return (
    <div>
      <h1 className="mb-8 font-mont font-bold text-white text-4xl">
        Your Hackpass
      </h1>
      <div className="bg-[#41374d] shadow-lg p-8 border border-[#534b75] rounded-lg">
        {/* We use a conditional (ternary) operator:
          - IF selectedBadge is not null, show BadgeInformationComponent.
          - ELSE (if selectedBadge is null), show BadgeGridComponent.
        */}
        {selectedBadge ? (
          <BadgeInformationComponent
            badge={selectedBadge}
            onClose={handleCloseInfo}
          />
        ) : (
          <BadgeGridComponent badges={badges} onBadgeClick={handleBadgeClick} />
        )}

        {/* Alternatively, if you want to show BOTH at the same time
          (like info on top, grid below), you can do this instead:
        */}

        {/* <BadgeInformationComponent
          badge={selectedBadge}
          onClose={handleCloseInfo}
        />
        <div className="mt-8">
          <BadgeGridComponent badges={badges} onBadgeClick={handleBadgeClick} />
        </div>
        */}
      </div>
    </div>
  );
}

