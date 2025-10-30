export function RulesSection() {
    return (
        <div>
            <h1 className="mb-8 font-mont font-bold text-white text-4xl">Rules, Team-Up & Judging</h1>
            <div className="space-y-6">
                <div className="bg-[#4A376B] shadow-lg p-8 border border-[#523B75] rounded-lg">
                    <h2 className="mb-4 font-mont font-semibold text-white text-2xl">
                        Hackathon Rules
                    </h2>
                    <ul className="space-y-2 font-mont text-gray-300 list-disc list-inside">
                        <li>Teams must be between 1-4 members.</li>
                        <li>All code must be written during the hackathon.</li>
                        <li>Be respectful to all attendees, mentors, and staff. (Code of Conduct)</li>
                        <li>Have fun and build something awesome!</li>
                    </ul>
                </div>
                <div className="bg-[#4A376B] shadow-lg p-8 border border-[#523B75] rounded-lg">
                    <h2 className="mb-4 font-mont font-semibold text-white text-2xl">
                        Judging Criteria
                    </h2>
                    <ul className="space-y-2 font-mont text-gray-300 list-disc list-inside">
                        <li><span className="font-semibold">Technology:</span> Technical complexity and quality of the hack.</li>
                        <li><span className="font-semibold">Design:</span> UI/UX and overall user experience.</li>
                        <li><span className="font-semibold">Innovation:</span> Originality and creativity of the idea.</li>
                        <li><span className="font-semibold">Completion:</span> How much of the project was completed.</li>
                        <li><span className="font-semibold">Presentation:</span> Clarity and quality of the demo.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};