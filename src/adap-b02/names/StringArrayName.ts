import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    /** @methodtype helper-method */
    protected doUnmask(c: string): string {
        return c.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter);
    }
    
    protected doMask(c: string): string {
        return c.replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
    }

    constructor(source: string[] = [], delimiter?: string) {
        this.components = [...source];
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        const unmaskedComponents = this.components.map(c => this.doUnmask(c));
        return unmaskedComponents.join(delimiter);
    }

    public asDataString(): string {
        return this.components.join(this.delimiter);
    }
    
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.components[i] = this.doMask(c);
    }

    public insert(i: number, c: string): void {
        this.components.splice(i, 0, this.doMask(c));
    }

    public append(c: string): void {
        this.components.push(this.doMask(c));
    }

    public remove(i: number): void {
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }
    
}