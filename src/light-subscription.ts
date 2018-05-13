import { Unsubscribable } from 'rxjs';

export class LightSubscription implements Unsubscribable {

  constructor(
    private callback: () => void
  ) { }

  unsubscribe(): void {
    this.callback();
  }

}
