import { IHistory } from '../interfaces';
import { Storage } from './storage';

export class HistoryStorage {
  private static HISTORY_KEY = 'history';

  static async getAll() {
    return (await Storage.get<IHistory[]>(this.HISTORY_KEY)) || [];
  }

  static async add(history: IHistory) {
    const histories = await this.getAll();

    return Storage.set(this.HISTORY_KEY, [history, ...histories]);
  }

  static async remove(index: number) {
    const histories = await this.getAll();

    return Storage.set(this.HISTORY_KEY, histories.filter((_, i) => i !== index));
  }

  static clear() {
    return Storage.set(this.HISTORY_KEY, []);
  }
}