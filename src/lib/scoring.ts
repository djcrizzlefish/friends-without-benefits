import { Manager, Match, Team, TeamStats, ManagerStanding, MatchResult } from "./types";

// Point values
const POINTS = {
  WIN: 2,
  DRAW: 1,
  GOALS_BONUS_THRESHOLD: 3,
  GOALS_BONUS: 1,
  ADVANCEMENT: {
    "Round of 32": 5,
    "Round of 16": 7,
    Quarterfinals: 10,
    Semifinals: 15,
    Final: 20,
    Champion: 25,
  } as Record<string, number>,
};

// Stage hierarchy for determining "furthest stage"
const STAGE_ORDER = [
  "Group Stage",
  "Round of 32",
  "Round of 16",
  "Quarterfinals",
  "Semifinals",
  "Final",
  "Champion",
];

function getStageRank(stage: string): number {
  const idx = STAGE_ORDER.indexOf(stage);
  return idx === -1 ? 0 : idx;
}

/**
 * Compute all team stats from raw match data.
 */
function computeTeamStats(
  teams: Team[],
  matches: Match[]
): Map<string, TeamStats> {
  const teamMap = new Map<string, Team>();
  teams.forEach((t) => teamMap.set(t.name, t));

  const statsMap = new Map<string, TeamStats>();

  // Initialize all teams
  teams.forEach((t) => {
    statsMap.set(t.name, {
      name: t.name,
      code: t.code,
      group: t.group,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsScored: 0,
      goalsConceded: 0,
      matchPoints: 0,
      advancementPoints: 0,
      totalPoints: 0,
      status: "active",
      eliminated: t.eliminated || false,
      furthestStage: "Group Stage",
      matches: [],
    });
  });

  // Process each match
  for (const match of matches) {
    const stats1 = statsMap.get(match.team1);
    const stats2 = statsMap.get(match.team2);
    if (!stats1 || !stats2) continue;

    const team2Info = teamMap.get(match.team2);
    const team1Info = teamMap.get(match.team1);

    // Calculate points for team1 in this match
    let points1 = 0;
    let points2 = 0;
    let result1: "W" | "D" | "L";
    let result2: "W" | "D" | "L";

    if (match.outcome === "team1") {
      points1 += POINTS.WIN;
      result1 = "W";
      result2 = "L";
      stats1.wins++;
      stats2.losses++;
    } else if (match.outcome === "team2") {
      points2 += POINTS.WIN;
      result1 = "L";
      result2 = "W";
      stats2.wins++;
      stats1.losses++;
    } else {
      // Draw
      points1 += POINTS.DRAW;
      points2 += POINTS.DRAW;
      result1 = "D";
      result2 = "D";
      stats1.draws++;
      stats2.draws++;
    }

    // 3+ goals bonus
    if (match.goals1 >= POINTS.GOALS_BONUS_THRESHOLD) {
      points1 += POINTS.GOALS_BONUS;
    }
    if (match.goals2 >= POINTS.GOALS_BONUS_THRESHOLD) {
      points2 += POINTS.GOALS_BONUS;
    }

    // Goals
    stats1.goalsScored += match.goals1;
    stats1.goalsConceded += match.goals2;
    stats2.goalsScored += match.goals2;
    stats2.goalsConceded += match.goals1;

    // Match points
    stats1.matchPoints += points1;
    stats2.matchPoints += points2;

    // Advancement bonuses
    if (match.advancement1 && POINTS.ADVANCEMENT[match.advancement1]) {
      const advPts = POINTS.ADVANCEMENT[match.advancement1];
      stats1.advancementPoints += advPts;
      if (getStageRank(match.advancement1) > getStageRank(stats1.furthestStage)) {
        stats1.furthestStage = match.advancement1;
      }
      if (match.advancement1 === "Champion") {
        stats1.status = "champion";
      }
    }
    if (match.advancement2 && POINTS.ADVANCEMENT[match.advancement2]) {
      const advPts = POINTS.ADVANCEMENT[match.advancement2];
      stats2.advancementPoints += advPts;
      if (getStageRank(match.advancement2) > getStageRank(stats2.furthestStage)) {
        stats2.furthestStage = match.advancement2;
      }
      if (match.advancement2 === "Champion") {
        stats2.status = "champion";
      }
    }

    // Check elimination: if a knockout match and team lost and didn't advance
    const isKnockout = match.stage !== "Group Stage";
    if (isKnockout) {
      if (match.outcome === "team1" && !match.advancement2) {
        stats2.status = stats2.status === "champion" ? "champion" : "eliminated";
      }
      if (match.outcome === "team2" && !match.advancement1) {
        stats1.status = stats1.status === "champion" ? "champion" : "eliminated";
      }
    }

    // Record match results for each team
    stats1.matches.push({
      matchId: match.id,
      date: match.date,
      stage: match.stage,
      opponent: match.team2,
      opponentCode: team2Info?.code || "",
      goalsFor: match.goals1,
      goalsAgainst: match.goals2,
      result: result1,
      pointsEarned: points1 + (match.advancement1 ? POINTS.ADVANCEMENT[match.advancement1] || 0 : 0),
    });
    stats2.matches.push({
      matchId: match.id,
      date: match.date,
      stage: match.stage,
      opponent: match.team1,
      opponentCode: team1Info?.code || "",
      goalsFor: match.goals2,
      goalsAgainst: match.goals1,
      result: result2,
      pointsEarned: points2 + (match.advancement2 ? POINTS.ADVANCEMENT[match.advancement2] || 0 : 0),
    });
  }

  // Compute totals
  statsMap.forEach((stats) => {
    stats.totalPoints = stats.matchPoints + stats.advancementPoints;
    // Sort matches most recent first
    stats.matches.sort((a, b) => b.date.localeCompare(a.date) || b.matchId - a.matchId);
  });

  return statsMap;
}

/**
 * Get the most recent matchday date from matches data.
 */
function getMostRecentMatchday(matches: Match[]): string | null {
  if (matches.length === 0) return null;
  const dates = [...new Set(matches.map((m) => m.date))].sort();
  return dates[dates.length - 1];
}

/**
 * Main scoring engine: computes full leaderboard from raw data.
 */
export function computeLeaderboard(
  managers: Manager[],
  matches: Match[],
  teams: Team[]
): ManagerStanding[] {
  const teamStats = computeTeamStats(teams, matches);
  const eliminatedTeams = new Set(
    teams.filter((t) => t.eliminated).map((t) => t.name)
  );

  // Compute point changes: calculate points without the most recent matchday
  const mostRecentDate = getMostRecentMatchday(matches);
  const matchesWithoutLatest = mostRecentDate
    ? matches.filter((m) => m.date !== mostRecentDate)
    : matches;
  const previousTeamStats = computeTeamStats(teams, matchesWithoutLatest);

  const standings: ManagerStanding[] = managers.map((manager) => {
    const managerTeamStats = manager.teams
      .map((teamName) => teamStats.get(teamName))
      .filter(Boolean) as TeamStats[];

    // Mark teams as eliminated based on teams.json eliminated field
    managerTeamStats.forEach((ts) => {
      if (eliminatedTeams.has(ts.name)) {
        ts.eliminated = true;
      }
    });

    const totalPoints = managerTeamStats.reduce((sum, t) => sum + t.totalPoints, 0);
    const matchPoints = managerTeamStats.reduce((sum, t) => sum + t.matchPoints, 0);
    const advancementPoints = managerTeamStats.reduce((sum, t) => sum + t.advancementPoints, 0);
    const totalWins = managerTeamStats.reduce((sum, t) => sum + t.wins, 0);

    // Calculate previous total points
    const previousTotal = manager.teams.reduce((sum, teamName) => {
      const prev = previousTeamStats.get(teamName);
      return sum + (prev ? prev.totalPoints : 0);
    }, 0);

    const teamsAlive = managerTeamStats.filter((ts) => !ts.eliminated).length;

    return {
      id: manager.id,
      name: manager.name,
      photo: manager.photo,
      teamStats: managerTeamStats,
      totalPoints,
      matchPoints,
      advancementPoints,
      totalWins,
      rank: 0,
      pointChange: totalPoints - previousTotal,
      teamsAlive,
      teamsTotal: managerTeamStats.length,
    };
  });

  // Sort by total points, then advancement points (tiebreaker 1), then total wins (tiebreaker 2)
  standings.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.advancementPoints !== a.advancementPoints) return b.advancementPoints - a.advancementPoints;
    return b.totalWins - a.totalWins;
  });

  // Assign ranks (handling ties)
  standings.forEach((s, i) => {
    if (
      i > 0 &&
      s.totalPoints === standings[i - 1].totalPoints &&
      s.advancementPoints === standings[i - 1].advancementPoints &&
      s.totalWins === standings[i - 1].totalWins
    ) {
      s.rank = standings[i - 1].rank;
    } else {
      s.rank = i + 1;
    }
  });

  return standings;
}

/**
 * Get summary stats for the tournament.
 */
export function getTournamentStats(
  managers: Manager[],
  matches: Match[]
) {
  const totalGoals = matches.reduce((sum, m) => sum + m.goals1 + m.goals2, 0);
  const totalTeamsDrafted = new Set(managers.flatMap((m) => m.teams)).size;

  return {
    totalManagers: managers.length,
    teamsDrafted: totalTeamsDrafted,
    matchesPlayed: matches.length,
    totalGoals,
  };
}

/**
 * Get team stats for a specific manager.
 */
export function getManagerTeamStats(
  managerId: string,
  managers: Manager[],
  matches: Match[],
  teams: Team[]
): ManagerStanding | null {
  const manager = managers.find((m) => m.id === managerId);
  if (!manager) return null;

  const leaderboard = computeLeaderboard(managers, matches, teams);
  return leaderboard.find((s) => s.id === managerId) || null;
}

/**
 * Build a map of team name -> manager info for head-to-head lookups.
 */
export function buildTeamOwnerMap(
  managers: Manager[]
): Map<string, { id: string; name: string }> {
  const map = new Map<string, { id: string; name: string }>();
  for (const m of managers) {
    for (const team of m.teams) {
      map.set(team, { id: m.id, name: m.name });
    }
  }
  return map;
}
