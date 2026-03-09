import { getManagers, getMatches } from "@/lib/data";
import PageTransition from "@/components/PageTransition";
import MatchesClient from "@/components/MatchesClient";

export default function MatchesPage() {
  const matches = getMatches();
  const managers = getManagers();
  return (
    <PageTransition>
      <MatchesClient matches={matches} managers={managers} />
    </PageTransition>
  );
}
