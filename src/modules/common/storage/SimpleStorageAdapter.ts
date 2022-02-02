import { SerializableType } from '../types';
import { serializeJson, deserializeJson } from '../utils';
import { SimpleStorage } from './storage.type';

export class SimpleStorageAdapter<T extends SerializableType>
  implements SimpleStorage<T>
{
  constructor(readonly key: string, private storage: Storage) {}

  get(): T {
    return deserializeJson(this.storage.getItem(this.key)) as T;
  }

  set(value: T): void {
    this.storage.setItem(this.key, serializeJson(value));
  }

  remove(): void {
    this.storage.removeItem(this.key);
  }
}
