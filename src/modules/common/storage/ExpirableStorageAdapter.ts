import { SerializableType } from '../types';
import { SimpleStorage, ExpirableStorageModel } from './storage.type';

export class ExpirableStorageAdapter<T extends SerializableType>
  implements SimpleStorage<T>
{
  constructor(
    private storage: SimpleStorage<ExpirableStorageModel<T>>,
    public expiredTime = 0
  ) {}

  get key() {
    return this.storage.key;
  }

  get(): T | null {
    const mData = this.storage.get();

    if (!mData) {
      return null;
    }

    if (mData.expiredTime <= 0 || mData.expiredTime > Date.now()) {
      return mData.data;
    }

    this.storage.remove();

    return null;
  }

  set(value: T): void {
    this.storage.set({
      data: value,
      expiredTime:
        this.expiredTime > 0 ? Date.now() + this.expiredTime * 1000 : 0,
    });
  }

  remove(): void {
    this.storage.remove();
  }
}
