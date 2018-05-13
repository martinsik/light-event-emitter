import { assert } from 'chai';
import { filter, finalize } from 'rxjs/operators';
import { describe, it } from 'mocha';
import { LightEventEmitter } from '../dist';

describe('LightEventEmitter', () => {
  let emitter: LightEventEmitter<any>;

  beforeEach(() => {
    emitter = new LightEventEmitter();
  });

  it('should receive 42 in its next handler', done => {
    emitter.subscribe(value => {
      assert.equal(value, 42);
      done();
    });

    emitter.next(42);
  });

  it('should be pipable in simple use-cases', done => {
    let called = 0;

    emitter
      .pipe(
        filter((value: number) => value % 2 === 0),
      )
      .subscribe(value => {
        called++;
        if (value === 4) {
          assert.equal(called, 2);
          done();
        }
      });

    emitter.next(1);
    emitter.next(2);
    emitter.next(3);
    emitter.next(4);
  });

  it('should be possible to subscribe with observer object', done => {
    emitter
      .subscribe({
        next: value => {
          assert.equal(value, 42);
          done();
        }
      });

    emitter.next(42);
  });

  it('should be possible to unsubscribe', () => {
    assert.equal((emitter as any).observers.length, 0);
    const subscription = emitter.subscribe();
    assert.equal((emitter as any).observers.length, 1);
    subscription.unsubscribe();
    assert.equal((emitter as any).observers.length, 0);
  });

  it('should should never receive emission after unsubscribing', () => {
    let called = 0;

    const subscription = emitter.subscribe(() => called++);

    emitter.next(42);
    subscription.unsubscribe();
    emitter.next(43);

    assert.equal(called, 1);
  });

  it('should properly call tear-down functions', done => {
    const subscription = emitter
      .pipe(
        finalize(done),
      )
      .subscribe();

    emitter.next(42);
    subscription.unsubscribe();
  });

  it('should properly call tear-down functions when piped with operators', done => {
    let called = 0;

    const subscription = emitter
      .pipe(
        filter((value: number) => value % 2 === 0),
        finalize(done),
      )
      .subscribe(value => {
        called++;
        if (value === 4) {
          assert.equal(called, 2);
        }
      });

    emitter.next(1);
    emitter.next(2);
    emitter.next(3);
    emitter.next(4);

    subscription.unsubscribe();
    assert.equal((emitter as any).observers.length, 0);
  });

  it('should preserve order of tear-down functions', done => {
    let called = 0;

    emitter
      .pipe(
        finalize(() => {
          assert.equal(called, 2);
          done();
        }),
        finalize(() => called++),
        finalize(() => called++),
      )
      .subscribe()
      .unsubscribe();
  });
});
