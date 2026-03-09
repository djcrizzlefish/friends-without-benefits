import { notFound } from "next/navigation";
import { getManagers, getMatches, getTeams } from "@/lib/data";
import { computeLeaderboard } from "@/lib/scoring";
import PageTransition from "@/components/PageTransition";
import ManagerDetailClient from "@/components/ManagerDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const managers = getManagers();
  return managers.map((m) => ({ id: m.id }));
}

export default async function ManagerPage({ params }: PageProps) {
  const { id } = await params;
  const managers = getManagers();
  const matches = getMatches();
  const teams = getTeams();
  const standings = computeLeaderboard(managers, matches, teams);
  const standing = standings.find((s) => s.id === id);

  if (!standing) {
    notFound();
  }

  return (
    <PageTransition>
      <ManagerDetailClient standing={standing} />
    </PageTransition>
  );
}
