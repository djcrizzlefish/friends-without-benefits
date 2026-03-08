export interface Team {
  name: string;
  code: string;
  group: string;
}

export interface Manager {
  id: string;
  name: string;
  photo: string;
  teams: string[];
}

export interface Match {
  id: number;
  date: string;
  stage: string;
  team1: string;
  team2: string;
  goals1: number;
  goals2: number;
  outcome: "team1" | "team2" | "draw";
  advancement1: string;
  advancement2: string;
}

export interface TeamStats {
  name: string;
  code: string;
  group: string;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  matchPoints: number;
  advancementPoints: number;
  totalPoints: number;
  status: "active" | "eliminated" | "champion";
  furthestStage: string;
  matches: MatchResult[];
}

export interface MatchResult {
  matchId: number;
  date: string;
  stage: string;
  opponent: string;
  opponentCode: string;
  goalsFor: number;
  goalsAgainst: number;
  result: "W" | "D" | "L";
  pointsEarned: number;
}

export interface ManagerStanding {
  id: string;
  name: string;
  photo: string;
  teamStats: TeamStats[];
  totalPoints: number;
  matchPoints: number;
  advancementPoints: number;
  totalWins: number;
  rank: number;
}
