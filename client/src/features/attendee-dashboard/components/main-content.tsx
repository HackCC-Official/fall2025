import { DeadlinesSection } from "./deadlines-section";
import { ProfileSection } from "./profile-section";
import { TeamUpSection } from "./team-up";
import { RulesSection } from "./rules-section";
import { ScheduleSection } from "./schedule-section";
import { HackpassSection } from "./hackpass-section";

export function MainContent({ activeSection } : { activeSection: string }) {
    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return <ProfileSection />;
            case 'hackpass':
                return <HackpassSection />;
            case 'schedule':
                return <ScheduleSection />;
            case 'deadlines':
                return <DeadlinesSection />;
            case 'teamup':
                return <TeamUpSection />;
            case 'rules':
                return <RulesSection />;
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