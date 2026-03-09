import { getManagers, getMatches, getTeams, formatDate } from "@/lib/data";
import { computeLeaderboard, getTournamentStats } from "@/lib/scoring";
import Leaderboard from "@/components/Leaderboard";
import PageTransition from "@/components/PageTransition";
import HeroSection from "@/components/HeroSection";
import StatCounters from "@/components/StatCounters";

export default function HomePage() {
  const managers = getManagers();
  const matches = getMatches();
  const teams = getTeams();
  const standings = computeLeaderboard(managers, matches, teams);
  const stats = getTournamentStats(managers, matches);

  // Find the most recent match date for "Last Updated"
  const lastMatchDate =
    matches.length > 0
      ? matches.reduce((latest, m) =>
          m.date > latest ? m.date : latest, matches[0].date)
      : null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <HeroSection />

        {/* Leaderboard */}
        <div className="relative">
          <div className="ambient-orb left-1/2 top-1/3 -translate-x-1/2 hidden sm:block" />
          <Leaderboard standings={standings} teams={teams} />
        </div>

        {/* Tournament Stats */}
        <StatCounters
          totalManagers={stats.totalManagers}
          teamsDrafted={stats.teamsDrafted}
          matchesPlayed={stats.matchesPlayed}
          totalGoals={stats.totalGoals}
        />

        {/* Last Updated */}
        {lastMatchDate && (
          <p className="text-center text-xs text-gray-600 mt-2 mb-4">
            Results through {formatDate(lastMatchDate)}
          </p>
        )}
      </div>
    </PageTransition>
  );
}
