import managersData from "@/data/managers.json";
import matchesData from "@/data/matches.json";
import teamsData from "@/data/teams.json";
import { Manager, Match, Team } from "./types";

export function getManagers(): Manager[] {
  return managersData as Manager[];
}

export function getMatches(): Match[] {
  return matchesData as Match[];
}

export function getTeams(): Team[] {
  return teamsData as Team[];
}

export function getTeamByName(name: string): Team | undefined {
  return (teamsData as Team[]).find((t) => t.name === name);
}

export function getTeamCode(teamName: string): string {
  const team = (teamsData as Team[]).find((t) => t.name === teamName);
  return team?.code || "";
}

export function getFlagUrl(code: string, width: number = 80): string {
  if (!code) return "";
  return `https://flagcdn.com/w${width}/${code}.png`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
