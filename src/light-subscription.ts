import { SubscriptionLike } from 'rxjs/src/internal/types';

export class LightSubscription implements SubscriptionLike {

  closed: boolean;

  constructor(
    private callback: () => void
  ) { }

  unsubscribe(): void {
    this.callback();
    this.closed = true;
  }

  add(): void {
    throw new Error(`LightSubscription doesn't allow composing tear-down functions. `
     + `Use EventEmitter instead or wrap this instance with another Subscription object.`);
  }
}
