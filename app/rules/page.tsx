import { getManagers } from "@/lib/data";
import PageTransition from "A/components/PageTransition";
import RulesClient from "@/components/RulesClient";

export default function RulesPage() {
  const managers = getManagers();
  const managerCount = managers.length;
  const entryFee = 30;
  const pot = managerCount * entryFee;

  return (
    <PageTransition>
      <RulesClient managerCount={managerCount} pot={pot} entryFee={entryFee} />
    </PageTransition>
  )5ßI–