import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";

    protected doUnmask(c: string): string {
        return c.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter);
    }
    
    protected doMask(c: string): string {
        return c.replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
    }

    protected doGetComponents(): string[] {
        if (this.name === "") return [];
        return this.name.split(this.delimiter);
    }
    
    protected doSetComponents(components: string[]): void {
        this.name = components.join(this.delimiter);
    }

    constructor(source: string = "", delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        
        const unmaskedComponents = source.split(this.delimiter);
        const maskedComponents = unmaskedComponents.map(c => this.doMask(c));
        this.name = maskedComponents.join(this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        const unmaskedComponents = this.doGetComponents().map(c => this.doUnmask(c));
        return unmaskedComponents.join(delimiter);
    }

    public asDataString(): string {
        return this.name;
    }
    
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.name === "";
    }

    public getNoComponents(): number {
        return this.doGetComponents().length;
    }

    public getComponent(i: number): string {
        return this.doGetComponents()[i];
    }

    public setComponent(i: number, c: string): void {
        const components = this.doGetComponents();
        components[i] = this.doMask(c);
        this.doSetComponents(components);
    }

    public insert(i: number, c: string): void {
        const components = this.doGetComponents();
        components.splice(i, 0, this.doMask(c));
        this.doSetComponents(components);
    }

    public append(c: string): void {
        const components = this.doGetComponents();
        components.push(this.doMask(c));
        this.doSetComponents(components);
    }

    public remove(i: number): void {
        const components = this.doGetComponents();
        components.splice(i, 1);
        this.doSetComponents(components);
    }

    public concat(other: Name): void {
        const thisComponents = this.doGetComponents();
        for (let i = 0; i < other.getNoComponents(); i++) {
            thisComponents.push(other.getComponent(i));
        }
        this.doSetComponents(thisComponents);
    }
}