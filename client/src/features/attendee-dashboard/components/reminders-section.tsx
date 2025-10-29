export function RemindersSection() {
    return (
        <div>
            <h1 className="mb-8 font-mont font-bold text-white text-4xl">Reminders</h1>
            <div className="bg-[#4A376B] shadow-lg p-8 border border-[#523B75] rounded-lg">
                <h2 className="font-mont text-gray-300 text-2xl text-center">
                    No active reminders.
                </h2>
                <p className="mt-4 font-mont text-gray-400 text-center">
                    We'll post important announcements and reminders here.
                </p>
            </div>
        </div>
    );
};