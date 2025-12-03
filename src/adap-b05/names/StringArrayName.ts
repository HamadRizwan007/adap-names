import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        
        this.assertIsNotNullOrUndefined(source, "source");
        
        this.components = [...source];
        
        this.assertClassInvariants();
    }

    public clone(): Name {
        return new StringArrayName(this.components, this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
    }

    public asDataString(): string {
        return super.asDataString();
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return super.isEmpty();
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertIsValidIndex(i);
        this.assertIsNotNullOrUndefined(c, "component");

        this.components[i] = c;

        MethodFailedException.assert(this.components[i] === c, "failed to set component");

        this.assertClassInvariants();
    }

    public insert(i: number, c: string) {
        this.assertIsValidInsertIndex(i);
        this.assertIsNotNullOrUndefined(c, "component");

        const oldLength = this.getNoComponents();

        this.components.splice(i, 0, c);

        MethodFailedException.assert(
            this.getNoComponents() === oldLength + 1,
            "insert did not increase length by 1"
        );

        MethodFailedException.assert(
            this.components[i] === c,
            "component not inserted correctly"
        );

        this.assertClassInvariants();
    }

    public append(c: string) {
        this.assertIsNotNullOrUndefined(c, "component");

        const oldLength = this.getNoComponents();
        this.components.push(c);

        MethodFailedException.assert(
            this.getNoComponents() === oldLength + 1,
            "append did not increase length by 1"
        );

        this.assertClassInvariants();
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);

        const oldLength = this.getNoComponents();
        this.components.splice(i, 1);

        MethodFailedException.assert(
            this.getNoComponents() === oldLength - 1,
            "remove did not decrease length by 1"
        );

        this.assertClassInvariants();
    }

    public concat(other: Name): void {
        super.concat(other);
    }
}