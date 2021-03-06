import { ActorRef } from './ActorRef';
import { ActorSystem } from './ActorSystem';

export interface Subscription {
  unsubscribe(): void;
}

// export interface Observer<T> {
//   // Sends the next value in the sequence
//   next?: (value: T) => void;

//   // Sends the sequence error
//   error?: (errorValue: any) => void;

//   // Sends the completion notification
//   complete: any; // TODO: what do you want, RxJS???
// }

/** OBSERVER INTERFACES - from RxJS */
export interface NextObserver<T> {
  closed?: boolean;
  next: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
}
export interface ErrorObserver<T> {
  closed?: boolean;
  next?: (value: T) => void;
  error: (err: any) => void;
  complete?: () => void;
}
export interface CompletionObserver<T> {
  closed?: boolean;
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete: () => void;
}

export type Observer<T> =
  | NextObserver<T>
  | ErrorObserver<T>
  | CompletionObserver<T>;

export interface Subscribable<T> {
  subscribe(observer: Observer<T>): Subscription;
  subscribe(
    next: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription;
}

export interface SubscribableByObserver<T> {
  subscribe(observer: Observer<T>): Subscription;
}

export type Logger = any;

export interface ActorContext<T> {
  self: ActorRef<T>;
  system: ActorSystem<any>;
  log: Logger;
  children: Set<ActorRef<any>>;
  watch: (actorRef: ActorRef<any>) => void;
  send: <U>(actorRef: ActorRef<U>, message: U) => void;
  subscribeTo: (topic: 'watchers', subscriber: ActorRef<any>) => void;

  // spawnAnonymous<U>(behavior: Behavior<U>): ActorRef<U>;
  spawn<U>(behavior: Behavior<U>, name: string): ActorRef<U>;
  spawnFrom<U extends T>(
    getEntity: () => Promise<U> | Subscribable<U>,
    name: string
  ): ActorRef<any, U | undefined>;
  stop<U>(child: ActorRef<U>): void;
}

export enum ActorSignalType {
  Start,
  PostStop,
  Watch,
  Terminated,
  Subscribe,
  Emit,
}

export type ActorSignal =
  | { type: ActorSignalType.Start }
  | { type: ActorSignalType.PostStop }
  | { type: ActorSignalType.Watch; ref: ActorRef<any> }
  | { type: ActorSignalType.Terminated; ref: ActorRef<any> }
  | { type: ActorSignalType.Subscribe; ref: ActorRef<any> }
  | { type: ActorSignalType.Emit; value: any };

export enum BehaviorTag {
  Setup,
  Default,
  Stopped,
}

export interface TaggedState<TState> {
  state: TState;
  $$tag: BehaviorTag;
  effects: any[];
}

export type Behavior<T, TState = any> = [
  (
    state: TaggedState<TState>,
    message: T | ActorSignal,
    ctx: ActorContext<T>
  ) => TaggedState<TState>,
  TaggedState<TState>
];

export type BehaviorReducer<TState, TEvent> = (
  state: TState,
  event: TEvent | ActorSignal,
  actorCtx: ActorContext<TEvent>
) => TState | TaggedState<TState>;
