import { action as nativeAction, IActionFactory, } from "mobx";

import { wrapMethodSafely } from "./errors";

export const action: IActionFactory = function action(arg1, arg2?, arg3?, arg4?) {
    // action(fn() {})
    if (arguments.length === 1 && typeof arg1 === "function") {
        return nativeAction(arg1.name || "<unnamed action>", wrapMethodSafely(arg1));
    }

    // action("name", fn() {})
    if (arguments.length === 2 && typeof arg2 === "function") {
        return nativeAction(arg1, wrapMethodSafely(arg2));
    }

    // @action("name") fn() {}
    if (arguments.length === 1 && typeof arg1 === "string") {
        return safeNamedActionDecorator(arg1);
    }

    // @action fn() {}
    if (arg4 === true) {
        // apply to instance immediately
        arg1[arg2] = /* createAction */ action(arg1.name || arg2, wrapMethodSafely(arg3.value));
    } else {
        return safeNamedActionDecorator(arg2).apply(null, arguments)
    }
} as any;

/**
 * @see mobx/src/api/actiondecorator.ts::namedActionDecorator
 */
function safeNamedActionDecorator(name: string) {
    return function(target, prop, descriptor) {
        // @action method() { }
        // TypeScript-style only
        if (descriptor) {
            return {
                value: action(name, descriptor.value),
                enumerable: false,
                configurable: false,
                writable: true // for typescript, this must be writable, otherwise it cannot inherit :/ (see inheritable actions test)
            };
        }

        // bound instance methods
        return safeActionFieldDecorator(name).apply(this, arguments);
    };
}

/**
 * @see mobx/src/api/actiondecorator.ts::actionFieldDecorator
 */
function safeActionFieldDecorator(name: string) {
    // Simple property that writes on first invocation to the current instance
    return function (target, prop, descriptor) {
        Object.defineProperty(target, prop, {
            configurable: true,
            enumerable: false,
            get() {
                return undefined;
            },
            set(value) {
                addHiddenFinalProp(this, prop, action(name, value))
            }
        });
    };
};

/**
 * @see mobx/src/utils/utils.ts::addHiddenFinalProp
 */
function addHiddenFinalProp(object: any, propName: string, value: any) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value,
    });
};
