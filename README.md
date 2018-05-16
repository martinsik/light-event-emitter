# LightEventEmitter - Benchmark

Purpose of this project is to test performance impact of creating components with 1, 5 and 10 output bindings (`@Output`) using the default `EventEmitter` class and then my custom `LightEventEmitter`.

The `EventEmitter` class inherits from RxJS's `Subject` which means it does a lot of overhead work that is almost never necessary. In particular RxJS Subjects support `error` and `complete` notifications that are never useful when sending events via `@Output`. This means that Subjects have to maintain their internal state on every new subscription and on every emission. However, in typical use-cases for `@Output` this is never necessary and thus we could be using `@Output` with some other object than `EventEmitter` without all the unecessary functionality that could perorm much better.

The `LightEventEmitter` is supposed to be a drop-in replacement for `EventEmitter`. It's stripped of internal state variables which makes subscriptions faster and emitting values even faster. It also doesn't support `error` and `complete` notifications.

See live benchmark (takes about a minute to finish): https://stackblitz.com/edit/light-event-emitter-test?file=src%2Fapp%2Fapp.component.ts

The following image shows a typical result ran on dual core MacBook Pro (mid 2012).


