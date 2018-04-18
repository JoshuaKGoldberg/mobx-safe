import { observable, IObservableArray } from "mobx";

import { configuration } from "./configuration"

export const caughtErrors: IObservableArray<Error> = observable([]);

export function wrapMethodSafely(method: Function): Function {
    return function () {
        try {
            return method.call(this, arguments);
        } catch (error) {
            caughtErrors.push(error);

            for (const onCaughtError of configuration.onCaughtErrorHandlers) {
                onCaughtError(error);
            }
        }
    };
};
