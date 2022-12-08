export class Storage {
  static async get<T>(key: string): Promise<T> {
    return (await chrome.storage.local.get(key))[key];
  }

  static async set(key: string, value: any) {
    return chrome.storage.local.set({[key]: value});
  }
}