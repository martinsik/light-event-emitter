import { describe, it } from 'mocha';
import { LightEventEmitter } from '../src';

const emitter = new LightEventEmitter();

describe('User', () => {
  it('should save without error', done => {
    done();


  });
});

// emitter.subscribe({
//   next: (value: any) => {
//     expect(value).toEqual(99);
//     async.done();
//   }
// });
// emitter.emit(99);