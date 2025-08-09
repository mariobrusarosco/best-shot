/**
 * Mock Data Factories
 * 
 * Provides consistent mock data for testing components.
 * These factories create realistic test data that matches our domain models.
 */

import { faker } from '@faker-js/faker';

// ===== BASE TYPES =====

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'participant' | 'moderator';
  avatar?: string;
  createdAt: Date;
}

export interface MockTournament {
  id: string;
  name: string;
  description?: string;
  sport: 'football' | 'basketball' | 'tennis' | 'soccer';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  participantCount: number;
  maxParticipants: number;
  startDate: Date;
  endDate?: Date;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface MockLeague {
  id: string;
  name: string;
  description?: string;
  tournamentId: string;
  participants: string[];
  settings: {
    allowLateJoining: boolean;
    autoAdvance: boolean;
    pointsSystem: 'standard' | 'custom';
  };
  createdAt: Date;
}

export interface MockMatch {
  id: string;
  tournamentId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  scheduledDate: Date;
  actualDate?: Date;
  venue?: string;
}

export interface MockGuess {
  id: string;
  matchId: string;
  userId: string;
  homeScore: number;
  awayScore: number;
  points?: number;
  submittedAt: Date;
}

// ===== FACTORY FUNCTIONS =====

/**
 * Creates a mock user with realistic data
 */
export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'participant',
    avatar: faker.image.avatar(),
    createdAt: faker.date.past(),
    ...overrides,
  };
}

/**
 * Creates a mock tournament with realistic data
 */
export function createMockTournament(overrides: Partial<MockTournament> = {}): MockTournament {
  const startDate = faker.date.future();
  const participantCount = faker.number.int({ min: 2, max: 50 });
  
  return {
    id: faker.string.uuid(),
    name: `${faker.location.city()} ${faker.word.sample()} Championship`,
    description: faker.lorem.sentence(),
    sport: faker.helpers.arrayElement(['football', 'basketball', 'tennis', 'soccer']),
    status: faker.helpers.arrayElement(['draft', 'active', 'completed']),
    participantCount,
    maxParticipants: participantCount + faker.number.int({ min: 0, max: 20 }),
    startDate,
    endDate: faker.date.future({ refDate: startDate }),
    isPublic: faker.datatype.boolean(),
    createdBy: faker.string.uuid(),
    createdAt: faker.date.past(),
    ...overrides,
  };
}

/**
 * Creates a mock league with realistic data
 */
export function createMockLeague(overrides: Partial<MockLeague> = {}): MockLeague {
  return {
    id: faker.string.uuid(),
    name: `${faker.company.name()} League`,
    description: faker.lorem.sentence(),
    tournamentId: faker.string.uuid(),
    participants: Array.from({ length: faker.number.int({ min: 4, max: 16 }) }, () => 
      faker.string.uuid()
    ),
    settings: {
      allowLateJoining: faker.datatype.boolean(),
      autoAdvance: faker.datatype.boolean(),
      pointsSystem: faker.helpers.arrayElement(['standard', 'custom']),
    },
    createdAt: faker.date.past(),
    ...overrides,
  };
}

/**
 * Creates a mock match with realistic data
 */
export function createMockMatch(overrides: Partial<MockMatch> = {}): MockMatch {
  const teams = [
    'Arsenal', 'Chelsea', 'Liverpool', 'Manchester United', 'Manchester City',
    'Tottenham', 'Newcastle', 'Brighton', 'Aston Villa', 'West Ham'
  ];
  
  const scheduledDate = faker.date.future();
  const status = faker.helpers.arrayElement(['upcoming', 'live', 'completed', 'cancelled']);
  
  return {
    id: faker.string.uuid(),
    tournamentId: faker.string.uuid(),
    homeTeam: faker.helpers.arrayElement(teams),
    awayTeam: faker.helpers.arrayElement(teams.filter(team => team !== overrides.homeTeam)),
    homeScore: status === 'completed' ? faker.number.int({ min: 0, max: 5 }) : undefined,
    awayScore: status === 'completed' ? faker.number.int({ min: 0, max: 5 }) : undefined,
    status,
    scheduledDate,
    actualDate: status !== 'upcoming' ? scheduledDate : undefined,
    venue: faker.location.city() + ' Stadium',
    ...overrides,
  };
}

/**
 * Creates a mock guess with realistic data
 */
export function createMockGuess(overrides: Partial<MockGuess> = {}): MockGuess {
  const homeScore = faker.number.int({ min: 0, max: 5 });
  const awayScore = faker.number.int({ min: 0, max: 5 });
  
  return {
    id: faker.string.uuid(),
    matchId: faker.string.uuid(),
    userId: faker.string.uuid(),
    homeScore,
    awayScore,
    points: faker.number.int({ min: 0, max: 10 }),
    submittedAt: faker.date.past(),
    ...overrides,
  };
}

// ===== BATCH FACTORY FUNCTIONS =====

/**
 * Creates multiple mock users
 */
export function createMockUsers(count: number, overrides: Partial<MockUser> = {}): MockUser[] {
  return Array.from({ length: count }, () => createMockUser(overrides));
}

/**
 * Creates multiple mock tournaments
 */
export function createMockTournaments(count: number, overrides: Partial<MockTournament> = {}): MockTournament[] {
  return Array.from({ length: count }, () => createMockTournament(overrides));
}

/**
 * Creates multiple mock matches
 */
export function createMockMatches(count: number, overrides: Partial<MockMatch> = {}): MockMatch[] {
  return Array.from({ length: count }, () => createMockMatch(overrides));
}

/**
 * Creates multiple mock guesses
 */
export function createMockGuesses(count: number, overrides: Partial<MockGuess> = {}): MockGuess[] {
  return Array.from({ length: count }, () => createMockGuess(overrides));
}

// ===== THEME TESTING HELPERS =====

/**
 * Common theme overrides for testing different scenarios
 */
export const themeVariants = {
  darkMode: {
    palette: {
      mode: 'dark' as const,
    },
  },
  
  mobile: {
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  },
  
  highContrast: {
    palette: {
      primary: {
        main: '#000000',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#ffffff',
        contrastText: '#000000',
      },
    },
  },
} as const;

// ===== FORM DATA FACTORIES =====

/**
 * Creates mock form data for tournament creation
 */
export function createMockTournamentFormData() {
  return {
    name: faker.company.name() + ' Tournament',
    description: faker.lorem.sentence(),
    sport: faker.helpers.arrayElement(['football', 'basketball', 'tennis', 'soccer']),
    maxParticipants: faker.number.int({ min: 8, max: 64 }),
    isPublic: faker.datatype.boolean(),
    startDate: faker.date.future().toISOString().split('T')[0], // Format for date input
    allowLateJoining: faker.datatype.boolean(),
  };
}

/**
 * Creates mock form data for league creation
 */
export function createMockLeagueFormData() {
  return {
    name: faker.company.name() + ' League',
    description: faker.lorem.sentence(),
    participants: Array.from({ length: faker.number.int({ min: 4, max: 12 }) }, () => 
      faker.internet.email()
    ),
    allowLateJoining: faker.datatype.boolean(),
    autoAdvance: faker.datatype.boolean(),
    pointsSystem: faker.helpers.arrayElement(['standard', 'custom']),
  };
}

/**
 * Creates mock error responses for testing error states
 */
export function createMockError(message = 'Something went wrong') {
  return {
    error: true,
    message,
    code: faker.number.int({ min: 400, max: 500 }),
    timestamp: new Date().toISOString(),
  };
}