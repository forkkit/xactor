import * as behaviors from '../src/BehaviorImpl';
import { ActorSystem } from '../src';

describe('behaviors', () => {
  it('Behaviors.Same should result in same behavior', done => {
    const helloWorldBehavior = behaviors.fromReducer<{ whom: string }>(
      (_, message) => {
        console.log('Sup, ' + message.whom);

        return undefined;
      },
      undefined
    );

    const system = new ActorSystem(helloWorldBehavior, 'Hello');

    system.send({ whom: 'David' });

    setTimeout(() => {
      done();
    }, 1000);
  });
});