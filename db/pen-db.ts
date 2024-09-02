import PenDetails, {SyncStatus} from '../models/PenDetails';
import SQLite from 'react-native-sqlite-storage';

const databaseName = 'pen.db';

class PenDetailsService {
  private db: SQLite.SQLiteDatabase | null = null;

  constructor() {
    this.initDatabase();
  }
  private initDatabase() {
    SQLite.enablePromise(true);
    SQLite.openDatabase({
      name: databaseName,
      location: 'default',
    })
      .then(db => {
        this.db = db;
        this.createTables();
      })
      .catch(error => {
        console.error('Error opening database:', error);
      });
  }

  private createTables(): void {
    if (!this.db) return;
    this.db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS pen_details (
                    penId INTEGER PRIMARY KEY AUTOINCREMENT,
                    headCount INTEGER,
                    date TEXT,
                    bunkScore INTEGER,
                    syncStatus TEXT DEFAULT 'not-synced' NOT NULL
                );`,
        [],
        () => {
          console.log('Table created successfully');
        },
        error => console.log('Error creating table:', error),
      );
    });
  }

  public fetchAllPenDetails(): Promise<PenDetails[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }
      this.db?.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM pen_details;`,
          [],
          (tx, result) => {
            const penDetails: PenDetails[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              const row = result.rows.item(i);
              const penDetail: PenDetails = {
                penId: row.penId,
                headCount: row.headCount,
                date: new Date(row.date),
                bunkScore: row.bunkScore,
                syncStatus: row.syncStatus as SyncStatus,
              };
              penDetails.push(penDetail);
            }
            resolve(penDetails);
            console.log('Pen details fetched successfully');
          },
          error => {
            reject(error);
            console.log('Error fetching pen details:', error);
          },
        );
      });
    });
  }

  public addPenDetails(penDetails: PenDetails): void {
    new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }
      this.db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO pen_details (headCount, date, bunkScore, syncStatus)
                VALUES (?, ?, ?, ?);`,
          [
            penDetails.headCount,
            penDetails.date.toISOString(),
            penDetails.bunkScore,
            penDetails.syncStatus,
          ],
          () => {
            resolve(tx);
            console.log('Pen details added successfully');
          },
          error => {
            reject(error);
            console.log('Error adding pen details:', error);
          },
        );
      });
    });
  }

  public updateSyncStatus(): void {
    new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }
      this.db.transaction(tx => {
        tx.executeSql(
          `UPDATE pen_details SET syncStatus = ? WHERE syncStatus = ?;`,
          [SyncStatus.Synced, SyncStatus.NotSynced],
          () => {
            resolve(tx);
            console.log('Sync status updated successfully');
          },
          error => {
            reject(error);
            console.log('Error updating sync status:', error);
          },
        );
      });
    });
  }

  public deletePenDetails(penId: number): void {
    new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }
      this.db.transaction(tx => {
        tx.executeSql(
          `DELETE FROM pen_details WHERE penId = ?;`,
          [penId],
          () => {
            resolve(tx);
            console.log('Pen details deleted successfully');
          },
          error => {
            reject(error);
            console.log('Error deleting pen details:', error);
          },
        );
      });
    });
  }

  public updatePenDetails(penDetails: PenDetails): void {
    new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }
      this.db.transaction(tx => {
        tx.executeSql(
          `UPDATE pen_details SET headCount = ?, date = ?, bunkScore = ?, syncStatus = ?
                WHERE penId = ?;`,
          [
            penDetails.headCount,
            penDetails.date.toISOString(),
            penDetails.bunkScore,
            penDetails.penId,
            penDetails.syncStatus,
          ],
          () => {
            resolve(tx);
            console.log('Pen details updated successfully');
          },
          error => {
            reject(error);
            console.log('Error updating pen details:', error);
          },
        );
      });
    });
  }
}

export const pedDB = new PenDetailsService();
