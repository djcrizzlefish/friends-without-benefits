import { getMatches } from "A/lib/data";
import PageTransition from "A/components/PageTransition";
import MatchesClient from "A/components/MatchesClient";

export default function MatchesPage() {
  const matches = getMatches();
  return (
    <PageTransition>
      <MatchesClient matches={matches} />
    </PageTransition>
  )5ßI–