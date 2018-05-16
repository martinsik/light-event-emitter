[![Build Status](https://travis-ci.org/martinsik/light-event-emitter.svg?branch=master)](https://travis-ci.org/martinsik/light-event-emitter)


# LightEventEmitter

`LightEventEmitter` is a simplified version Angular's default `EventEmitter` class that is used for all `Output()` bindings. It removes some of `EventEmitter`'s functionality that isn't necessary in 99.9% of use-cases in exchange for performance. 

`LightEventEmitter` is a drop-in replacement for `EventEmitter`.

## Instalation

    npm i light-event-emitter
    
## Usage

Just use it instead of `EventEmitter`.

    import { LightEventEmitter } from 'light-event-emitter';
    
    @Component({
      selector: 'my-component',
      template: `...`,
    })
    export class MyComponent {
    
      @Output() out = new LightEventEmitter();
      
      ...
      
    }

## How it works

Purpose of this project is also to test performance impact of creating components with 1, 5 and 10 output bindings (`@Output`) using the default `EventEmitter` class and `LightEventEmitter`.

From the results bellow it's obvious that the number of subscriptions a component has **does have performance impact**.

Angular's `EventEmitter` class inherits from RxJS's `Subject` which means it does a lot of overhead work that is almost never necessary. In particular RxJS Subjects support `error` and `complete` notifications that are never useful when sending events via `@Output`. This means that Subjects have to maintain and check their internal state on every **new subscription** and even more importantly on **every `next()` emission**. However, in typical use-cases with `@Output` this is never necessary and thus we could be using `@Output` with some other object than `EventEmitter` without all this unnecessary functionality that could perform much better.

`LightEventEmitter` is stripped of its internal state which makes subscriptions faster and emitting values even faster. For this reason it doesn't support `error` and `complete` notifications.

## Performance

See live benchmark (takes about a minute to finish): https://stackblitz.com/edit/light-event-emitter-test?file=src%2Fapp%2Fapp.component.ts

The following image shows a typical result ran on dual core MacBook Pro (mid 2012).

![typical results](https://raw.githubusercontent.com/martinsik/light-event-emitter/master/doc/results-0.png)

![results in a bar chart](https://raw.githubusercontent.com/martinsik/light-event-emitter/master/doc/bar-chart.png)

Tests with a large number of components are measured as time Angular spent creating, adding them to the page and creating bindings.

The last test with emissions just emits very large number of `next()` items to its parent. 

The performance improvement grows with the number of bindings:

![performance improvement with LightEventEmitter](https://raw.githubusercontent.com/martinsik/light-event-emitter/master/doc/line-chart.png)

## Licence

MIT