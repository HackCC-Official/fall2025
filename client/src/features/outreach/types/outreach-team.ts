/**
 * Represents a member of an outreach team
 */
export type OutreachTeamDto = {
    email: string;
    name: string;
    major: string;
    year: "Freshman" | "Sophomore" | "Junior" | "Senior" | "Graduate";
    school: string;
    position: string;
};
