// /Data/BadgeData.ts
import { Badge } from "../types/badge-interface";

/**
 * Mock data for the HackPass badges.
 */
export const BADGE_DATA: Badge[] = [
  {
    id: 'b1',
    name: 'First Commit',
    description: 'Awarded for making your first commit to a project.',
    howToGet: 'Push your first commit to any repository during the hackathon.',
    imageUrl: 'https://placehold.co/150x150/3498db/ffffff?text=Commit',
    achieved: true,
  },
  {
    id: 'b2',
    name: 'Team Player',
    description: 'Awarded for collaborating with a team.',
    howToGet: 'Be part of a team that submits a project.',
    imageUrl: 'https://placehold.co/150x150/2ecc71/ffffff?text=Team',
    achieved: true,
  },
  {
    id: 'b3',
    name: 'Bug Squasher',
    description: 'Awarded for fixing a critical bug.',
    howToGet: 'Resolve a bug marked as "critical" in the project tracker.',
    imageUrl: 'https://placehold.co/150x150/e74c3c/ffffff?text=Bug',
    achieved: false,
  },
  {
    id: 'b4',
    name: 'API Wizard',
    description: 'Awarded for successfully integrating a third-party API.',
    howToGet: 'Demonstrate a functional API integration in your project.',
    imageUrl: 'https://placehold.co/150x150/f39c12/ffffff?text=API',
    achieved: true,
  },
  {
    id: 'b5',
    name: 'Sleepless Coder',
    description: 'Awarded for making a commit between 2 AM and 5 AM.',
    howToGet: 'The commit timestamp speaks for itself!',
    imageUrl: 'https://placehold.co/150x150/9b59b6/ffffff?text=Night',
    achieved: false,
  },
  {
    id: 'b6',
    name: 'Best Design',
    description: 'Awarded for the project with the best user interface.',
    howToGet: 'Win the "Best Design" category prize.',
    imageUrl: 'https://placehold.co/150x150/1abc9c/ffffff?text=Design',
    achieved: false,
  },
];
