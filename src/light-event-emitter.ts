import { NextObserver, PartialObserver } from 'rxjs/src/internal/types';
import { OperatorFunction, Subscribable } from 'rxjs/internal/types';
import { LightSubscription } from './light-subscription';
import { pipeFromArray } from 'rxjs/internal/util/pipe';
import { Observable } from 'rxjs/internal/Observable';
import { Operator } from 'rxjs/internal/Operator';
import { Subscription } from 'rxjs/internal/Subscription';

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

  pipe<R>(...operations: OperatorFunction<T, R>[]): Observable<R> {
    if (operations.length === 0) {
      return this as any;
    }

    return pipeFromArray(operations)(this as any);
  }

  lift<R>(operator: Operator<T, R>): Observable<R> {
    const observable = new Observable<R>();
    observable.source = this as any;
    observable.operator = operator;
    return observable;
  }

  error(err: any): void {
    throw new Error(`LightEventEmitter doesn't support "error" notifications. Use EventEmitter instead.`);
  }

  complete(): void {
    throw new Error(`LightEventEmitter doesn't support "complete" notifications. Use EventEmitter instead.`);
  }

}
