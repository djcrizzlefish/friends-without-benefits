import { getMatches } from "A/lib/data";
import PageTransition from "@/components/PageTransition";
import MatchesClient from "@/components/MatchesClient";

export default function MatchesPage() {
  const matches = getMatches();
  return (
    <PageTransition>
      <MatchesClient matches={matches} />
    </PageTransition>
  +}
