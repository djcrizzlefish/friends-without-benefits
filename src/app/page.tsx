import { getManagers, getMatches, getTeams } from "@/lib/data";
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
      </div>
    </PageTransition>
  );
}
