import ActivitiesSection from "./activities-section";
import { DeadlinesSection } from "./deadlines-section";
import { ProfileSection } from "./profile-section";
import { TeamUpSection } from "./team-up";

export function MainContent({ activeSection } : { activeSection: string }) {
    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return <ProfileSection />;
            case 'deadlines':
                return <DeadlinesSection />;
            case 'activities':
                return <ActivitiesSection />;
            default:
                return <ProfileSection />;
        }
    };

    return (
        <main className="flex-1 p-6 md:p-10 overflow-y-auto" style={{ maxHeight: '100vh' }}>
            {renderSection()}
        </main>
    );
};