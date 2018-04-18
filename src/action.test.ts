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

        it("catches an error", () => {
            // Arrange
            const error = new Error();
            const wrapped = action((): void => {
                throw error;
            });

            // Act
            wrapped();

            // Assert
            expect(caughtErrors).toEqual([error]);
        });
    });

    describe(`action("name", fn() {})`, () => {
        it("returns a value", () => {
            // Arrange
            const expected = {};
            const wrapped = action("name", () => expected);

            // Act
            const actual = wrapped();

            // Assert
            expect(expected).toEqual(actual);
        });

        it("catches an error", () => {
            // Arrange
            const error = new Error();
            const wrapped = action((): void => {
                throw error;
            });

            // Act
            wrapped();

            // Assert
            expect(caughtErrors).toEqual([error]);
        });
    });

    describe(`@action`, () => {
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

        it("catches an error", () => {
            // Arrange
            const error = new Error();
            class Source {
                @action
                public act() {
                    throw error;
                }
            }

            // Act
            new Source().act();

            // Assert
            expect(caughtErrors).toEqual([error]);
        });

        it("allows setting observable errors on the target", () => {
            // Arrange
            const error = new Error();
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
            const error = new Error();
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
