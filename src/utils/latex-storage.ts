import { Storage } from './storage';

export class LatexStorage {
  private static LATEX_KEY = 'latex';

  static async get() {
    return (await Storage.get<string>(this.LATEX_KEY)) || '';
  }

  static async set(latex: string) {
    return Storage.set(this.LATEX_KEY, latex);
  }
}