export enum SyncStatus {
  Synced = 'synced',
  NotSynced = 'not-synced',
}

interface PenDetails {
  penId?: number;
  headCount: number;
  date: Date;
  bunkScore: number;
  syncStatus: SyncStatus;
}
export default PenDetails;
