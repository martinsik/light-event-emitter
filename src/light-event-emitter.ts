import { NextObserver, PartialObserver } from 'rxjs/src/internal/types';
import { Subscribable } from 'rxjs/internal/types';
import { LightSubscription } from './light-subscription';

export class LightEventEmitter<T> implements NextObserver<T>, Subscribable<T> {

  private observers: NextObserver<T>[] = [];

  constructor(private isAsync: boolean = false) {
  }

  next(value: T): void {
    const { observers } = this;

    for (const observer of observers) {
      observer.next(value);
    }
  }

  subscribe(observerOrNext?: PartialObserver<T> | ((value: T) => void),
            error?: (error: any) => void,
            complete?: () => void): LightSubscription {

    let normalizedObserver: NextObserver<T>;

    if (typeof observerOrNext === 'object') {
      normalizedObserver = observerOrNext as NextObserver<T>;
    } else {
      normalizedObserver = {
        next: observerOrNext,
      };
    }

    this.observers.push(normalizedObserver);
    const index = this.observers.length - 1;

    return new LightSubscription(() => {
      this.observers.splice(index, 1);
    });
  }

  error(err: any): void {
    throw new Error(`LightEventEmitter doesn't support "error" notifications. Use EventEmitter instead.`);
  }

  complete(): void {
    throw new Error(`LightEventEmitter doesn't support "complete" notifications. Use EventEmitter instead.`);
  }

}
