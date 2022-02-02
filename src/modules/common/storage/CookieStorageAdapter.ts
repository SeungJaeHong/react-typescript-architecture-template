import { SerializableType } from '../types';
import { serializeJson, deserializeJson } from '../utils';
import { SimpleStorage, CookieStorage } from './storage.type';

export class CookieStorageAdapter<T extends SerializableType>
  implements SimpleStorage<T>
{
  constructor(
    private cookie: CookieStorage,
    readonly key: string,
    public expiredTime = 0
  ) {}

  get(): T | null {
    return deserializeJson(this.cookie.get(this.key)) as T | null;
  }

  set(value: T): void {
    this.cookie.set(this.key, serializeJson(value), this.expiredTime);
  }

  remove(): void {
    this.cookie.remove(this.key);
  }
}
