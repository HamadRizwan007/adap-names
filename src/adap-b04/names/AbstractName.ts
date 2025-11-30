import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // Precondition: delimiter must not be null or undefined
        if (delimiter === null || delimiter === undefined) {
            throw new IllegalArgumentException("delimiter cannot be null or undefined");
        }
        // Precondition: delimiter must be exactly one character
        if (delimiter.length !== 1) {
            throw new IllegalArgumentException("delimiter must be a single character");
        }
        this.delimiter = delimiter;
    }

    public clone(): Name {
        throw new Error("needs implementation in subclass");
    }

    public asString(delimiter: string = this.delimiter): string {
        // Precondition: delimiter must not be null or undefined
        this.assertIsNotNullOrUndefined(delimiter, "delimiter");
        
        // Precondition: delimiter must be single character
        if (delimiter.length !== 1) {
            throw new IllegalArgumentException("delimiter must be a single character");
        }

        let result = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (i > 0) {
                result += delimiter;
            }
            result += this.getComponent(i);
        }
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        let result = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (i > 0) {
                result += this.delimiter;
            }
            // Escape special characters
            let component = this.getComponent(i);
            result += this.escapeComponent(component);
        }
        return result;
    }

    protected escapeComponent(component: string): string {
        let escaped = "";
        for (let char of component) {
            if (char === this.delimiter || char === ESCAPE_CHARACTER) {
                escaped += ESCAPE_CHARACTER;
            }
            escaped += char;
        }
        return escaped;
    }

    public isEqual(other: Name): boolean {
        // Precondition: other must not be null or undefined
        this.assertIsNotNullOrUndefined(other, "other");

        // Check if same number of components
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }

        // Check if same delimiter
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }

        // Check each component
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }

        return true;
    }

    public getHashCode(): number {
        let hashCode = 0;
        const str = this.asDataString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + char;
            hashCode = hashCode & hashCode; // Convert to 32-bit integer
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        // Precondition: other must not be null or undefined
        this.assertIsNotNullOrUndefined(other, "other");

        // Add all components from other to this
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    // Assertion methods for Design by Contract
    protected assertIsNotNullOrUndefined(value: any, name: string): void {
        if (value === null || value === undefined) {
            throw new IllegalArgumentException(name + " cannot be null or undefined");
        }
    }

    protected assertIsValidIndex(index: number): void {
        if (index < 0 || index >= this.getNoComponents()) {
            throw new IllegalArgumentException("index out of bounds: " + index);
        }
    }

    protected assertIsValidInsertIndex(index: number): void {
        if (index < 0 || index > this.getNoComponents()) {
            throw new IllegalArgumentException("insert index out of bounds: " + index);
        }
    }

    protected assertClassInvariants(): void {
        // Class invariant: number of components cannot be negative
        if (this.getNoComponents() < 0) {
            throw new InvalidStateException("number of components cannot be negative");
        }

        // Class invariant: delimiter must be set
        if (this.delimiter === null || this.delimiter === undefined) {
            throw new InvalidStateException("delimiter must be set");
        }

        // Class invariant: delimiter must be single character
        if (this.delimiter.length !== 1) {
            throw new InvalidStateException("delimiter must be a single character");
        }
    }
}