import { getManagers, getMatches, getTeams } from "@/lib/data";
import { computeLeaderboard, getTournamentStats } from "@/lib/scoring";
import Leaderboard from "@/components/Leaderboard";
import PageTransition from "@/components/PageTransition";
import HeroBackground from "@/components/HeroBackground";

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
        <header className="relative pt-12 pb-10 sm:pt-20 sm:pb-14 text-center overflow-hidden">
          <HeroBackground />
          <div className="relative z-10">
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight gradient-gold leading-none">
              FRIENDS WITHOUT
              <br />
              BENEFITS
            </h1>
            <p className="mt-4 text-gray-400 text-base sm:text-lg font-medium tracking-wide uppercase">
              World Cup 2026 Fantasy Draft
            </p>
            <div className="mt-3 mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
          </div>
        </header>

        {/* Leaderboard */}
        <Leaderboard standings={standings} teams={teams} />

        {/* Tournament Stats */}
        <section className="mt-12 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Managers", value: stats.totalManagers },
              { label: "Teams Drafted", value: stats.teamsDrafted },
              { label: "Matches Played", value: stats.matchesPlayed },
              { label: "Total Goals", value: stats.totalGoals },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card rounded-xl p-4 sm:p-5 text-center"
              >
                <p className="font-display text-3xl sm:text-4xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
