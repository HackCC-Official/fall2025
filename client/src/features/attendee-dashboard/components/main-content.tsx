import { DeadlinesSection } from "./deadlines-section";
import { HackPassSection } from "./hack-pass-section";
import { RemindersSection } from "./reminders-section";
import { RulesSection } from "./rules-section";
import { ScheduleSection } from "./schedule-section";

export function MainContent({ activeSection } : { activeSection: string }) {
    const renderSection = () => {
        switch (activeSection) {
            case 'hackpass':
                return <HackPassSection />;
            case 'schedule':
                return <ScheduleSection />;
            case 'deadlines':
                return <DeadlinesSection />;
            case 'reminders':
                return <RemindersSection />;
            case 'rules':
                return <RulesSection />;
            default:
                return <HackPassSection />;
        }
    };

    return (
        <main className="flex-1 p-6 md:p-10 overflow-y-auto" style={{ maxHeight: '100vh' }}>
            {renderSection()}
        </main>
    );
};