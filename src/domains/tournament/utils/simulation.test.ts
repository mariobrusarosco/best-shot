import { describe, expect, it } from "vitest";
import type { ITournamentStandings } from "@/domains/tournament/schemas";
import type { TournamentSimulationState } from "@/domains/tournament/types";
import {
	buildSimulatedKnockoutRounds,
	createSimulationMatchOverride,
	deriveSimulatedStandings,
	isSimulationSupported,
	overlaySimulationScores,
	pruneDownstreamMatchOverrides,
} from "./simulation";

const createStandings = (): ITournamentStandings => ({
	lastUpdated: "2026-04-04T00:00:00.000Z",
	format: "multi-group",
	teams: [
		{
			name: "Group A",
			teams: [
				{
					id: "a1",
					teamExternalId: "a1",
					teamBadge: "/a1.png",
					groupName: "Group A",
					order: "1",
					shortName: "AAA",
					longName: "Team AAA",
					points: "6",
					games: "2",
					wins: "2",
					draws: "0",
					losses: "0",
					gf: "4",
					ga: "1",
					gd: "3",
					provider: "test",
				},
				{
					id: "a2",
					teamExternalId: "a2",
					teamBadge: "/a2.png",
					groupName: "Group A",
					order: "2",
					shortName: "BBB",
					longName: "Team BBB",
					points: "3",
					games: "2",
					wins: "1",
					draws: "0",
					losses: "1",
					gf: "2",
					ga: "2",
					gd: "0",
					provider: "test",
				},
				{
					id: "a3",
					teamExternalId: "a3",
					teamBadge: "/a3.png",
					groupName: "Group A",
					order: "3",
					shortName: "CCC",
					longName: "Team CCC",
					points: "1",
					games: "2",
					wins: "0",
					draws: "1",
					losses: "1",
					gf: "1",
					ga: "3",
					gd: "-2",
					provider: "test",
				},
				{
					id: "a4",
					teamExternalId: "a4",
					teamBadge: "/a4.png",
					groupName: "Group A",
					order: "4",
					shortName: "DDD",
					longName: "Team DDD",
					points: "1",
					games: "2",
					wins: "0",
					draws: "1",
					losses: "1",
					gf: "1",
					ga: "2",
					gd: "-1",
					provider: "test",
				},
			],
		},
		{
			name: "Group B",
			teams: [
				{
					id: "b1",
					teamExternalId: "b1",
					teamBadge: "/b1.png",
					groupName: "Group B",
					order: "1",
					shortName: "EEE",
					longName: "Team EEE",
					points: "4",
					games: "2",
					wins: "1",
					draws: "1",
					losses: "0",
					gf: "3",
					ga: "1",
					gd: "2",
					provider: "test",
				},
				{
					id: "b2",
					teamExternalId: "b2",
					teamBadge: "/b2.png",
					groupName: "Group B",
					order: "2",
					shortName: "FFF",
					longName: "Team FFF",
					points: "4",
					games: "2",
					wins: "1",
					draws: "1",
					losses: "0",
					gf: "2",
					ga: "1",
					gd: "1",
					provider: "test",
				},
				{
					id: "b3",
					teamExternalId: "b3",
					teamBadge: "/b3.png",
					groupName: "Group B",
					order: "3",
					shortName: "GGG",
					longName: "Team GGG",
					points: "0",
					games: "2",
					wins: "0",
					draws: "0",
					losses: "2",
					gf: "1",
					ga: "4",
					gd: "-3",
					provider: "test",
				},
				{
					id: "b4",
					teamExternalId: "b4",
					teamBadge: "/b4.png",
					groupName: "Group B",
					order: "4",
					shortName: "HHH",
					longName: "Team HHH",
					points: "0",
					games: "2",
					wins: "0",
					draws: "0",
					losses: "2",
					gf: "0",
					ga: "3",
					gd: "-3",
					provider: "test",
				},
			],
		},
	],
});

const createOverrides = (): TournamentSimulationState["matchOverrides"] => ({
	"match-a": {
		matchId: "match-a",
		round: "3",
		source: "official",
		home: { id: "a3", shortName: "CCC", name: "Team CCC", badge: "/a3.png", score: 2 },
		away: { id: "a1", shortName: "AAA", name: "Team AAA", badge: "/a1.png", score: 0 },
		updatedAt: "2026-04-04T00:00:00.000Z",
	},
	"match-b": {
		matchId: "match-b",
		round: "3",
		source: "official",
		home: { id: "b2", shortName: "FFF", name: "Team FFF", badge: "/b2.png", score: 3 },
		away: { id: "b1", shortName: "EEE", name: "Team EEE", badge: "/b1.png", score: 1 },
		updatedAt: "2026-04-04T00:00:00.000Z",
	},
	"simulate:semifinals:1": {
		matchId: "simulate:semifinals:1",
		round: "semifinals",
		source: "generated",
		home: { id: "a3", shortName: "CCC", name: "Team CCC", badge: "/a3.png", score: 1 },
		away: { id: "b2", shortName: "FFF", name: "Team FFF", badge: "/b2.png", score: 0 },
		updatedAt: "2026-04-04T00:00:00.000Z",
	},
	"simulate:semifinals:2": {
		matchId: "simulate:semifinals:2",
		round: "semifinals",
		source: "generated",
		home: { id: "a1", shortName: "AAA", name: "Team AAA", badge: "/a1.png", score: 2 },
		away: { id: "b1", shortName: "EEE", name: "Team EEE", badge: "/b1.png", score: 1 },
		updatedAt: "2026-04-04T00:00:00.000Z",
	},
});

describe("tournament simulation utilities", () => {
	it("derives standings from simulated open-match results", () => {
		const standings = deriveSimulatedStandings(createStandings(), createOverrides());
		const groupA = standings?.teams[0] as { teams: Array<{ id: string; points: string }> } | undefined;

		expect(groupA?.teams[0].id).toBe("a1");
		expect(groupA?.teams[0].points).toBe("6");
		expect(groupA?.teams[1].id).toBe("a3");
		expect(groupA?.teams[1].points).toBe("4");
	});

	it("overlays simulated scores onto open matches only", () => {
		const matches = [
			{
				id: "official-open",
				date: "2026-04-04T00:00:00.000Z",
				round: "3",
				tournamentId: "tournament-id",
				status: "open" as const,
				timebox: "",
				home: { id: "a1", score: null, shortName: "AAA", badge: "/a1.png", name: "AAA", penaltiesScore: null },
				away: { id: "a2", score: null, shortName: "BBB", badge: "/a2.png", name: "BBB", penaltiesScore: null },
			},
			{
				id: "official-ended",
				date: "2026-04-04T00:00:00.000Z",
				round: "3",
				tournamentId: "tournament-id",
				status: "ended" as const,
				timebox: "",
				home: { id: "b1", score: 1, shortName: "EEE", badge: "/b1.png", name: "EEE", penaltiesScore: null },
				away: { id: "b2", score: 0, shortName: "FFF", badge: "/b2.png", name: "FFF", penaltiesScore: null },
			},
		];

		const result = overlaySimulationScores(matches, {
			"official-open": createSimulationMatchOverride(matches[0], {
				matchId: matches[0].id,
				tournamentId: matches[0].tournamentId,
				home: { score: 2 },
				away: { score: 2 },
			}),
			"official-ended": createSimulationMatchOverride(matches[1], {
				matchId: matches[1].id,
				tournamentId: matches[1].tournamentId,
				home: { score: 3 },
				away: { score: 3 },
			}),
		});

		expect(result[0].home.score).toBe(2);
		expect(result[0].away.score).toBe(2);
		expect(result[1].home.score).toBe(1);
		expect(result[1].away.score).toBe(0);
	});

	it("generates knockout round cards from simulated qualifiers", () => {
		const standings = deriveSimulatedStandings(createStandings(), createOverrides());
		const generatedRounds = buildSimulatedKnockoutRounds({
			tournamentId: "tournament-id",
			rounds: [
				{ label: "1", slug: "1" },
				{ label: "2", slug: "2" },
				{ label: "3", slug: "3" },
				{ label: "Semifinals", slug: "semifinals" },
				{ label: "Match for 3rd Place", slug: "match-for-3rd-place" },
				{ label: "Final", slug: "final" },
			],
			standings,
			matchOverrides: createOverrides(),
		});

		expect(generatedRounds[0]?.slug).toBe("semifinals");
		expect(generatedRounds[0]?.matches).toHaveLength(2);
		expect(generatedRounds[1]?.slug).toBe("match-for-3rd-place");
		expect(generatedRounds[1]?.matches).toHaveLength(1);
		expect(generatedRounds[2]?.slug).toBe("final");
		expect(generatedRounds[2]?.matches).toHaveLength(1);
	});

	it("clears downstream knockout overrides when upstream results change", () => {
		const overrides = pruneDownstreamMatchOverrides(createOverrides(), "3", [
			{ label: "1", slug: "1" },
			{ label: "2", slug: "2" },
			{ label: "3", slug: "3" },
			{ label: "Round of 16", slug: "round-of-16" },
			{ label: "Quarterfinals", slug: "quarterfinals" },
		]);

		expect(overrides["match-a"]).toBeDefined();
		expect(overrides["match-b"]).toBeDefined();
		expect(overrides["simulate:semifinals:1"]).toBeUndefined();
	});

	it("recognizes knockout-capable tournaments for simulation support", () => {
		expect(
			isSimulationSupported({
				id: "id",
				label: "Tournament",
				logo: "https://example.com/logo.png",
				mode: "regular-season-and-knockout",
				status: "active",
				provider: "provider",
				standingsMode: "multi-group",
				season: "2026",
				currentRound: "1",
				rounds: [],
			})
		).toBe(true);

		expect(
			isSimulationSupported({
				id: "id",
				label: "Tournament",
				logo: "https://example.com/logo.png",
				mode: "regular-season-only",
				status: "active",
				provider: "provider",
				standingsMode: "unique-group",
				season: "2026",
				currentRound: "1",
				rounds: [],
			})
		).toBe(false);
	});
});
