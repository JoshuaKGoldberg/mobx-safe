import { observable } from "mobx";

import { action } from "./action";
import { caughtErrors } from "./errors";

describe("action", () => {
    beforeEach((): void => {
        caughtErrors.clear();
    });

    describe("action(fn() {})", () => {
        it("returns a value", () => {
            // Arrange
            const expected = {};
            const wrapped = action(() => expected);

            // Act
            const actual = wrapped();

            // Assert
            expect(expected).toEqual(actual);
        });

        it("catches an error when one is thrown by the action", () => {
            // Arrange
            const error = new Error("test")
            const wrapped = action((): void => {
                throw error;
            });

            // Act
            try {
                wrapped();
            } catch { }

            // Assert
            expect(caughtErrors).toEqual([error]);
        });

        it("rethrows an error when one is thrown by the action", () => {
            // Arrange
            const error = new Error("test");
            const wrapped = action((): void => {
                throw error;
            });

            // Assert
            expect(action).toThrowError(error.message);
        });

        it("catches an error when one is thrown by the action", () => {
            // Arrange
            const error = new Error("test")
            const wrapped = action("name", (): void => {
                throw error;
            });

            // Act
            try {
                wrapped();
            } catch { }

            // Assert
            expect(caughtErrors).toEqual([error]);
        });

        it("rethrows an error when one is thrown by the action", () => {
            // Arrange
            const error = new Error("test");
            const wrapped = action("name", (): void => {
                throw error;
            });

            // Assert
            expect(wrapped).toThrow(error.message);
        });
    });

    describe.only(`@action`, () => {
        it("returns a value", () => {
            // Arrange
            const expected = {};
            class Source {
                @action
                public act() {
                    return expected;
                }
            }

            // Act
            const actual = new Source().act();

            // Assert
            expect(expected).toEqual(actual);
        });

        it("catches an error when one is thrown by the action", () => {
            // Arrange
            const error = new Error("test")
            class Source {
                @action
                public act() {
                    throw error;
                }
            }

            // Act
            try {
                new Source().act();
            } catch { }

            // Assert
            expect(caughtErrors).toEqual([error]);
        });

        it("rethrows an error when one is thrown by the action", () => {
            // Arrange
            const error = new Error("test")
            class Source {
                @action
                public act() {
                    throw error;
                }
            }

            // Act
            const act = () => new Source().act();

            // Assert
            expect(act).toThrowError(error.message);
        });

        it("allows setting observable errors on the target", () => {
            // Arrange
            const error = new Error("test")
            class Source {
                @observable
                public error: Error | undefined;

                @action
                public receiveError(error: Error) {
                    this.error = error;
                }
            }

            const source = new Source();

            // Act
            source.receiveError(error);

            // Assert
            expect(source.error).toBe(error);
        });
    });

    describe(`@action("name")`, () => {
        it("returns a value", () => {
            // Arrange
            const expected = {};
            class Source {
                @action("name")
                public act() {
                    return expected;
                }
            }

            // Act
            const actual = new Source().act();

            // Assert
            expect(expected).toEqual(actual);
        });

        it("catches an error", () => {
            // Arrange
            const error = new Error("test")
            class Source {
                @action("name")
                public act() {
                    throw error;
                }
            }

            // Act
            new Source().act();

            // Assert
            expect(caughtErrors).toEqual([error]);
        });
    });
});
