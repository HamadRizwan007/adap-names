import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        this.noComponents = this.calculateNoComponents();
    }

    private calculateNoComponents(): number {
        if (this.name === "") {
            return 0;
        }
        
        let count = 1;
        let i = 0;
        
        while (i < this.name.length) {
            const char = this.name.charAt(i);
            
            if (char === ESCAPE_CHARACTER) {
                i += 2;
            } else if (char === this.delimiter) {
                count++;
                i++;
            } else {
                i++;
            }
        }
        
        return count;
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        
        let currentIndex = 0;
        let componentStart = 0;
        let pos = 0;
        
        while (pos < this.name.length && currentIndex <= i) {
            const char = this.name.charAt(pos);
            
            if (char === ESCAPE_CHARACTER) {
                pos += 2;
            } else if (char === this.delimiter) {
                if (currentIndex === i) {
                    return this.name.substring(componentStart, pos);
                }
                currentIndex++;
                pos++;
                componentStart = pos;
            } else {
                pos++;
            }
        }
        
        return this.name.substring(componentStart);
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        
        let components: string[] = [];
        for (let j = 0; j < this.noComponents; j++) {
            if (j === i) {
                components.push(c);
            } else {
                components.push(this.getComponent(j));
            }
        }
        
        this.name = components.join(this.delimiter);
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.noComponents) {
            throw new Error("Index out of bounds");
        }
        
        let components: string[] = [];
        for (let j = 0; j < this.noComponents; j++) {
            if (j === i) {
                components.push(c);
            }
            components.push(this.getComponent(j));
        }
        if (i === this.noComponents) {
            components.push(c);
        }
        
        this.name = components.join(this.delimiter);
        this.noComponents++;
    }

    public append(c: string): void {
        if (this.name === "") {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        
        let components: string[] = [];
        for (let j = 0; j < this.noComponents; j++) {
            if (j !== i) {
                components.push(this.getComponent(j));
            }
        }
        
        this.name = components.join(this.delimiter);
        this.noComponents--;
    }
}