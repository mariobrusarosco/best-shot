import type { z } from "zod";
import { GUESS_STATUSES, type IGuess } from "@/domains/guess/typing";
import type { CreateGuessInput } from "@/domains/league/typing";
import type { IMatch } from "@/domains/match/typing";
import type {
	ITournament,
	ITournamentStandings,
	TournamentStandingGroupSchema,
} from "@/domains/tournament/schemas";
import type {
	SimulatedKnockoutRound,
	SimulatedStanding,
	SimulationMatchOverride,
	TournamentSimulationState,
} from "@/domains/tournament/types";

type TournamentRound = NonNullable<ITournament["rounds"]>[number];
type GroupedStandingsEntry = z.infer<typeof TournamentStandingGroupSchema>;

type GroupStandings = {
	name: string;
	teams: SimulatedStanding[];
};

const KNOCKOUT_LABELS = [
	"round of 32",
	"round of 16",
	"quarterfinals",
	"semifinals",
	"match for 3rd place",
	"final",
] as const;

const KNOCKOUT_SLOTS_BY_LABEL: Record<string, number> = {
	"round of 32": 32,
	"round of 16": 16,
	quarterfinals: 8,
	semifinals: 4,
	final: 2,
};

const normalizeRoundValue = (value: string) => value.trim().toLowerCase().replaceAll("-", " ");

const toNumeric = (value: string | number | undefined | null) => Number(value ?? 0);

const compareStandings = (left: SimulatedStanding, right: SimulatedStanding) => {
	const leftPoints = toNumeric(left.points);
	const rightPoints = toNumeric(right.points);
	if (leftPoints !== rightPoints) return rightPoints - leftPoints;

	const leftGoalDiff = toNumeric(left.gd);
	const rightGoalDiff = toNumeric(right.gd);
	if (leftGoalDiff !== rightGoalDiff) return rightGoalDiff - leftGoalDiff;

	const leftGoalsFor = toNumeric(left.gf);
	const rightGoalsFor = toNumeric(right.gf);
	if (leftGoalsFor !== rightGoalsFor) return rightGoalsFor - leftGoalsFor;

	const leftWins = toNumeric(left.wins);
	const rightWins = toNumeric(right.wins);
	if (leftWins !== rightWins) return rightWins - leftWins;

	return (left.shortName || left.longName).localeCompare(right.shortName || right.longName);
};

const assignOrders = (teams: SimulatedStanding[]) =>
	teams.map((team, index) => ({
		...team,
		order: String(index + 1),
	}));

const createEmptySimulationState = (): TournamentSimulationState => ({
	version: 1,
	updatedAt: null,
	matchOverrides: {},
});

const cloneStanding = (team: SimulatedStanding): SimulatedStanding => ({
	...team,
	groupName: team.groupName,
	tournamentId: team.tournamentId,
	updatedAt: team.updatedAt,
	teamExternalId: team.teamExternalId,
	id: team.id,
	teamBadge: team.teamBadge,
	order: team.order,
	shortName: team.shortName,
	longName: team.longName,
	points: String(team.points),
	games: String(team.games),
	wins: String(team.wins),
	draws: String(team.draws),
	losses: String(team.losses),
	gf: String(team.gf),
	ga: String(team.ga),
	gd: String(team.gd),
	provider: team.provider,
});

const createGroupFromUniqueTable = (standings: ITournamentStandings): GroupStandings[] => [
	{
		name: "table",
		teams: (standings.teams as SimulatedStanding[]).map(cloneStanding),
	},
];

const extractGroupedStandings = (standings: ITournamentStandings): GroupStandings[] => {
	if (standings.format === "multi-group") {
		return (standings.teams as GroupedStandingsEntry[]).map((group) => ({
			name: group.name,
			teams: group.teams.map(cloneStanding),
		}));
	}

	return createGroupFromUniqueTable(standings);
};

const flattenGroupedStandings = (
	format: ITournamentStandings["format"],
	groups: GroupStandings[]
): ITournamentStandings["teams"] => {
	if (format === "multi-group") {
		return groups.map((group) => ({
			name: group.name,
			teams: group.teams,
		}));
	}

	return groups[0]?.teams ?? [];
};

const updateStandingStats = (
	standing: SimulatedStanding,
	goalsFor: number,
	goalsAgainst: number
): SimulatedStanding => {
	const wins = toNumeric(standing.wins);
	const draws = toNumeric(standing.draws);
	const losses = toNumeric(standing.losses);
	const games = toNumeric(standing.games);
	const points = toNumeric(standing.points);
	const gf = toNumeric(standing.gf);
	const ga = toNumeric(standing.ga);

	const nextStanding = {
		...standing,
		games: String(games + 1),
		gf: String(gf + goalsFor),
		ga: String(ga + goalsAgainst),
	};

	const goalDifference = toNumeric(nextStanding.gf) - toNumeric(nextStanding.ga);
	nextStanding.gd = String(goalDifference);

	if (goalsFor === goalsAgainst) {
		nextStanding.draws = String(draws + 1);
		nextStanding.points = String(points + 1);
		return nextStanding;
	}

	if (goalsFor > goalsAgainst) {
		nextStanding.wins = String(wins + 1);
		nextStanding.points = String(points + 3);
		return nextStanding;
	}

	nextStanding.losses = String(losses + 1);
	return nextStanding;
};

const buildTeamLookup = (groups: GroupStandings[]) => {
	const lookup = new Map<string, { groupName: string; index: number }>();

	for (const group of groups) {
		group.teams.forEach((team, index) => {
			lookup.set(team.id, { groupName: group.name, index });
		});
	}

	return lookup;
};

const createSimulationTeam = (team: IMatch["home"] | IMatch["away"]) => ({
	id: team.id,
	shortName: team.shortName,
	name: team.name,
	badge: team.badge,
});

export const isKnockoutRound = (value: string) => {
	const normalized = normalizeRoundValue(value);
	return KNOCKOUT_LABELS.some((label) => normalized.includes(label));
};

export const getFirstKnockoutRoundIndex = (rounds: TournamentRound[] = []) =>
	rounds.findIndex((round) => isKnockoutRound(round.label) || isKnockoutRound(round.slug));

export const getKnockoutRounds = (rounds: TournamentRound[] = []) => {
	const firstKnockoutRoundIndex = getFirstKnockoutRoundIndex(rounds);
	if (firstKnockoutRoundIndex === -1) {
		return [];
	}

	return rounds.slice(firstKnockoutRoundIndex);
};

export const isSimulationSupported = (tournament?: ITournament) =>
	Boolean(tournament && tournament.mode !== "regular-season-only");

export const createSimulationMatchOverride = (
	match: IMatch,
	input: CreateGuessInput
): SimulationMatchOverride => ({
	matchId: match.id,
	round: match.round,
	source: match.id.startsWith("simulate:") ? "generated" : "official",
	home: {
		...createSimulationTeam(match.home),
		score: input.home.score,
	},
	away: {
		...createSimulationTeam(match.away),
		score: input.away.score,
	},
	updatedAt: new Date().toISOString(),
});

export const pruneDownstreamMatchOverrides = (
	matchOverrides: TournamentSimulationState["matchOverrides"],
	changedRound: string,
	rounds: TournamentRound[] = []
) => {
	const nextOverrides = { ...matchOverrides };
	const knockoutRounds = getKnockoutRounds(rounds);
	const knockoutRoundSlugs = knockoutRounds.map((round) => round.slug);
	const changedKnockoutIndex = knockoutRoundSlugs.indexOf(changedRound);

	for (const [matchId, override] of Object.entries(nextOverrides)) {
		if (override.round === changedRound) {
			continue;
		}

		if (!isKnockoutRound(changedRound)) {
			if (isKnockoutRound(override.round)) {
				delete nextOverrides[matchId];
			}
			continue;
		}

		const overrideKnockoutIndex = knockoutRoundSlugs.indexOf(override.round);
		if (overrideKnockoutIndex > changedKnockoutIndex) {
			delete nextOverrides[matchId];
		}
	}

	return nextOverrides;
};

export const overlaySimulationScores = (
	matches: IMatch[],
	matchOverrides: TournamentSimulationState["matchOverrides"]
) =>
	matches.map((match) => {
		const override = matchOverrides[match.id];
		if (!override || match.status !== "open") {
			return match;
		}

		return {
			...match,
			home: {
				...match.home,
				score: override.home.score,
			},
			away: {
				...match.away,
				score: override.away.score,
			},
		};
	});

export const buildSimulationGuess = (
	match: IMatch,
	override?: SimulationMatchOverride,
	label = "sim"
): IGuess & { displayLabel: string } => ({
	id: `simulation:${match.id}`,
	matchId: match.id,
	home: {
		status: GUESS_STATUSES.NOT_STARTED,
		value: override?.home.score ?? match.home.score ?? null,
		points: null,
	},
	away: {
		status: GUESS_STATUSES.NOT_STARTED,
		value: override?.away.score ?? match.away.score ?? null,
		points: null,
	},
	fullMatch: {
		status: GUESS_STATUSES.NOT_STARTED,
		points: null,
		label: "",
	},
	total: null,
	status: GUESS_STATUSES.NOT_STARTED,
	hasLostTimewindowToGuess: false,
	displayLabel: label,
});

const getRoundSlots = (round: TournamentRound) =>
	KNOCKOUT_SLOTS_BY_LABEL[normalizeRoundValue(round.label)] ?? 0;

const seedQualifiedTeams = (teams: SimulatedStanding[]) =>
	teams.slice().sort((left, right) => {
		const groupPosition = toNumeric(left.order) - toNumeric(right.order);
		if (groupPosition !== 0) {
			return groupPosition;
		}

		return compareStandings(left, right);
	});

const getQualifiedTeams = (standings: ITournamentStandings, slots: number) => {
	const groups = extractGroupedStandings(standings).map((group) => ({
		...group,
		teams: assignOrders(group.teams.slice().sort(compareStandings)),
	}));

	if (groups.length === 1) {
		return groups[0].teams.slice(0, slots);
	}

	const winners = groups.map((group) => group.teams[0]).filter(Boolean);
	const runnersUp = groups.map((group) => group.teams[1]).filter(Boolean);
	const directQualifiers = [...winners, ...runnersUp];

	if (slots <= directQualifiers.length) {
		return seedQualifiedTeams(directQualifiers).slice(0, slots);
	}

	const remainingSlots = slots - directQualifiers.length;
	const thirdPlacedTeams = groups.map((group) => group.teams[2]).filter(Boolean);
	const bestThirdPlaced = thirdPlacedTeams.sort(compareStandings).slice(0, remainingSlots);

	return seedQualifiedTeams([...directQualifiers, ...bestThirdPlaced]).slice(0, slots);
};

const createKnockoutMatch = (
	tournamentId: string,
	round: TournamentRound,
	index: number,
	homeTeam: SimulatedStanding,
	awayTeam: SimulatedStanding,
	matchOverrides: TournamentSimulationState["matchOverrides"]
): IMatch => {
	const id = `simulate:${round.slug}:${index + 1}`;
	const override = matchOverrides[id];

	return {
		id,
		date: null,
		round: round.slug,
		tournamentId,
		status: "open",
		timebox: "",
		home: {
			id: homeTeam.id,
			shortName: homeTeam.shortName,
			badge: homeTeam.teamBadge,
			name: homeTeam.longName,
			score: override?.home.score ?? null,
			penaltiesScore: null,
		},
		away: {
			id: awayTeam.id,
			shortName: awayTeam.shortName,
			badge: awayTeam.teamBadge,
			name: awayTeam.longName,
			score: override?.away.score ?? null,
			penaltiesScore: null,
		},
	};
};

const createKnockoutPairings = (qualifiedTeams: SimulatedStanding[]) => {
	const pairings: Array<[SimulatedStanding, SimulatedStanding]> = [];
	const teams = qualifiedTeams.slice();

	while (teams.length >= 2) {
		const homeTeam = teams.shift();
		const awayTeam = teams.pop();

		if (homeTeam && awayTeam) {
			pairings.push([homeTeam, awayTeam]);
		}
	}

	return pairings;
};

const getMatchWinner = (match: IMatch, standingsLookup: Map<string, SimulatedStanding>) => {
	if (match.home.score === null || match.away.score === null || match.home.score === match.away.score) {
		return null;
	}

	const winnerTeamId = match.home.score > match.away.score ? match.home.id : match.away.id;
	return standingsLookup.get(winnerTeamId) ?? null;
};

const getMatchLoser = (match: IMatch, standingsLookup: Map<string, SimulatedStanding>) => {
	if (match.home.score === null || match.away.score === null || match.home.score === match.away.score) {
		return null;
	}

	const loserTeamId = match.home.score > match.away.score ? match.away.id : match.home.id;
	return standingsLookup.get(loserTeamId) ?? null;
};

export const deriveSimulatedStandings = (
	standings: ITournamentStandings | undefined,
	matchOverrides: TournamentSimulationState["matchOverrides"]
) => {
	if (!standings) {
		return undefined;
	}

	const groups = extractGroupedStandings(standings);
	const teamLookup = buildTeamLookup(groups);

	for (const override of Object.values(matchOverrides)) {
		if (isKnockoutRound(override.round)) {
			continue;
		}

		const homeLookup = teamLookup.get(override.home.id);
		const awayLookup = teamLookup.get(override.away.id);
		if (!homeLookup || !awayLookup || homeLookup.groupName !== awayLookup.groupName) {
			continue;
		}

		const group = groups.find((entry) => entry.name === homeLookup.groupName);
		if (!group) {
			continue;
		}

		group.teams[homeLookup.index] = updateStandingStats(
			group.teams[homeLookup.index],
			override.home.score,
			override.away.score
		);
		group.teams[awayLookup.index] = updateStandingStats(
			group.teams[awayLookup.index],
			override.away.score,
			override.home.score
		);
	}

	const sortedGroups = groups.map((group) => ({
		...group,
		teams: assignOrders(group.teams.slice().sort(compareStandings)),
	}));

	return {
		...standings,
		teams: flattenGroupedStandings(standings.format, sortedGroups),
	};
};

export const buildSimulatedKnockoutRounds = ({
	tournamentId,
	rounds = [],
	standings,
	matchOverrides,
}: {
	tournamentId: string;
	rounds?: TournamentRound[];
	standings?: ITournamentStandings;
	matchOverrides: TournamentSimulationState["matchOverrides"];
}): SimulatedKnockoutRound[] => {
	if (!standings) {
		return [];
	}

	const knockoutRounds = getKnockoutRounds(rounds);
	if (knockoutRounds.length === 0) {
		return [];
	}

	const firstRound = knockoutRounds[0];
	const firstRoundSlots = getRoundSlots(firstRound);
	if (!firstRoundSlots) {
		return [];
	}

	const qualifiedTeams = getQualifiedTeams(standings, firstRoundSlots);
	if (qualifiedTeams.length !== firstRoundSlots) {
		return [];
	}

	const standingsLookup = new Map(qualifiedTeams.map((team) => [team.id, team]));
	const generatedRounds = new Map<string, SimulatedKnockoutRound>();

	const firstRoundMatches = createKnockoutPairings(qualifiedTeams).map(([homeTeam, awayTeam], index) =>
		createKnockoutMatch(tournamentId, firstRound, index, homeTeam, awayTeam, matchOverrides)
	);

	generatedRounds.set(firstRound.slug, {
		slug: firstRound.slug,
		label: firstRound.label,
		matches: firstRoundMatches,
	});

	let previousCompetitiveRoundMatches = firstRoundMatches;
	let semifinalMatches: IMatch[] =
		normalizeRoundValue(firstRound.label) === "semifinals" ? firstRoundMatches : [];

	for (const round of knockoutRounds.slice(1)) {
		const normalizedLabel = normalizeRoundValue(round.label);

		if (normalizedLabel === "match for 3rd place") {
			if (semifinalMatches.length === 0) {
				continue;
			}

			const losers = semifinalMatches
				.map((match) => getMatchLoser(match, standingsLookup))
				.filter(Boolean) as SimulatedStanding[];

			if (losers.length !== 2) {
				continue;
			}

			generatedRounds.set(round.slug, {
				slug: round.slug,
				label: round.label,
				matches: [
					createKnockoutMatch(tournamentId, round, 0, losers[0], losers[1], matchOverrides),
				],
			});
			continue;
		}

		const winners = previousCompetitiveRoundMatches
			.map((match) => getMatchWinner(match, standingsLookup))
			.filter(Boolean) as SimulatedStanding[];

		const roundSlots = getRoundSlots(round);
		if (!roundSlots || winners.length !== roundSlots) {
			continue;
		}

		const matches = createKnockoutPairings(winners).map(([homeTeam, awayTeam], index) =>
			createKnockoutMatch(tournamentId, round, index, homeTeam, awayTeam, matchOverrides)
		);

		generatedRounds.set(round.slug, {
			slug: round.slug,
			label: round.label,
			matches,
		});

		previousCompetitiveRoundMatches = matches;
		if (normalizedLabel === "semifinals") {
			semifinalMatches = matches;
		}
	}

	return knockoutRounds
		.map((round) => generatedRounds.get(round.slug))
		.filter(Boolean) as SimulatedKnockoutRound[];
};

export const mergeSimulationState = (state?: TournamentSimulationState) =>
	state ?? createEmptySimulationState();
