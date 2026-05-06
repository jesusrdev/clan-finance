export interface ProfilePhase2AcceptanceInput {
  displayNamePersistence: boolean;
  monthlyMetricsShown: boolean;
  progressVisible: boolean;
  docsAligned: boolean;
}

export function passesProfilePhase2AcceptanceGate(input: ProfilePhase2AcceptanceInput): boolean {
  return (
    input.displayNamePersistence &&
    input.monthlyMetricsShown &&
    input.progressVisible &&
    input.docsAligned
  );
}
