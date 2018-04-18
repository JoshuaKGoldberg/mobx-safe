import { configuration, configure } from "./configuration";
import { action } from "./action";

describe("configuration", () => {
    beforeEach(() => {
        configuration.onCaughtErrorHandlers = [];
    });

    describe("onCaughtError", () => {
        it("adds a handler called on error", () => {
            // Arrange
            const error = new Error();
            const wrapped = action((): void => {
                throw error;
            });

            const onCaughtError = jasmine.createSpy();
            configure({ onCaughtError });

            // Act
            wrapped();

            // Assert
            expect(onCaughtError).toHaveBeenLastCalledWith(error);
        });

        it("adds a subsequent handler when one already exists", () => {
            // Arrange
            const error = new Error();
            const wrapped = action((): void => {
                throw error;
            });

            const onCaughtErrors = [
                jasmine.createSpy(),
                jasmine.createSpy(),
            ];

            for (const onCaughtError of onCaughtErrors) {
                configure({ onCaughtError });
            }

            // Act
            wrapped();

            // Assert
            for (const onCaughtError of onCaughtErrors) {
                configure({ onCaughtError });
            }
        });

        it("rethrows errors in the original call stack", () => {
            // Arrange
            const error = new Error("test");
            const wrapped = action((): void => {
                throw error;
            });

            const onCaughtError = (error: Error): void => {
                throw error;
            };
            configure({ onCaughtError });

            // Assert
            expect(wrapped).toThrow(error.message);
        });
    });
});
