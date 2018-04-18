# mobx-safe
[![Greenkeeper badge](https://badges.greenkeeper.io/JoshuaKGoldberg/mobx-safe.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/JoshuaKGoldberg/mobx-safe.svg?branch=master)](https://travis-ci.org/JoshuaKGoldberg/mobx-safe)
[![NPM version](https://badge.fury.io/js/mobx-safe.svg)](http://badge.fury.io/js/mobx-safe)

Drop-in `action` replacement for MobX that stores errors instead of throwing.

```typescript
import { action, caughtErrors } from "mobx-safe";

class DangerZone {
    @action
    public enter() {
        throw new Error("Lana!");
    }
}

new DangerZone.enter();
console.log(caughtErrors); // [Error: Lana!]
```

## Why?

Generally, MobX recommends using native browser/Node error handling for uncaught errors.
IE and older versions of Edge don't provide stack traces in certain cross-domain situations ([link](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10868717/)/[link](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/817828/)).
In order to react to errors and guarantee call stacks you'll need to handle the errors yourself _in the original execution stack_.
Knarly!

See [this MobX issue](https://github.com/mobxjs/mobx/issues/1453).

## Usage

### `action`

Import `action` from `mobx-safe` and use as you would `mobx`'s `action`.
That's it!

> Basic method wrapping and TypeScript decorators are supported.
> Babel decorators are _not_ supported.

### `caughtErrors`

Type: `IObservableArray<Error>`

Synchronously pushed to whenever an `action` error is caught.
Observe this to react to errors having been throw.

```typescript
import { autorun } from "mobx";
import { caughtErrors } from "mobx-safe";

autorun(() => {
    console.log(`There are ${caughtErrors.length} errors.`);
});
```

### `configure.onCaughtError`

Type: `(handler: (error: Error) => void) => void`

Adds a method to be called whenever an error is pushed to `caughtErrors`.
These methods are called synchronously, so you can use this to rethrow errors after handling them.

```typescript
import { configure as configureMobXSafe } from "mobx-safe";

configureMobXSafe({
    onCaughtError(error) {
        console.log("Found an error:", error);
        throw error;
    },
});
```

## Best Practices

Either:

* Only wrap root-level actions, as inner actions that throw will be caught safely and your program will continue.
* Add an `onCaughtError` that rethrows the caught error.
