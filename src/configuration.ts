export type OnCaughtErrorHandler = (error: Error) => void;

export interface StoredConfiguration {
    onCaughtErrorHandlers: OnCaughtErrorHandler[];
}

export const configuration: StoredConfiguration = {
    onCaughtErrorHandlers: [],
};

export interface ConfigurationOptions {
    clearOnCaughtErrorHandlers?: boolean;
    onCaughtError?: OnCaughtErrorHandler;
}

/**
 * Configures mobx-safe.
 * 
 * @param options   Options to add to the existing configuration.
 */
export const configure = (options: ConfigurationOptions): void => {
    if (options.clearOnCaughtErrorHandlers) {
        configuration.onCaughtErrorHandlers.length = 0;
    }

    if (options.onCaughtError !== undefined) {
        configuration.onCaughtErrorHandlers.push(options.onCaughtError);
    }
};
