/**
 * Represents a member of an outreach team
 */
export type OutreachTeamDto = {
    id?: string;
    email: string;
    name: string;
    major: string;
    year: "Freshman" | "Sophomore" | "Junior" | "Senior" | "Graduate";
    school: string;
    position: string;
};
