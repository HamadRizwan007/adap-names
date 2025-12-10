import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected readonly name: string = "";
    protected readonly noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        
        this.assertIsNotNullOrUndefined(source, "source");
        
        this.name = source;
        this.noComponents = this.calculateNoComponents(source);
        
        this.assertClassInvariants();
    }

    private calculateNoComponents(source: string): number {
        if (source === "") {
            return 0;
        }
        
        let count = 1;
        let i = 0;
        while (i < source.length) {
            if (source[i] === ESCAPE_CHARACTER && i + 1 < source.length) {
                i += 2;
            } else if (source[i] === this.delimiter) {
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
        this.assertIsValidIndex(i);
        
        let currentIndex = 0;
        let componentStart = 0;
        let j = 0;

        while (j < this.name.length) {
            if (this.name[j] === ESCAPE_CHARACTER && j + 1 < this.name.length) {
                j += 2;
            } else if (this.name[j] === this.delimiter) {
                if (currentIndex === i) {
                    return this.unescapeComponent(this.name.substring(componentStart, j));
                }
                currentIndex++;
                componentStart = j + 1;
                j++;
            } else {
                j++;
            }
        }

        if (currentIndex === i) {
            return this.unescapeComponent(this.name.substring(componentStart));
        }

        throw new IllegalArgumentException("component index not found");
    }

    private unescapeComponent(component: string): string {
        let result = "";
        let i = 0;
        while (i < component.length) {
            if (component[i] === ESCAPE_CHARACTER && i + 1 < component.length) {
                result += component[i + 1];
                i += 2;
            } else {
                result += component[i];
                i++;
            }
        }
        return result;
    }

    // Immutable setComponent - returns new Name
    public setComponent(i: number, c: string): Name {
        this.assertIsValidIndex(i);
        this.assertIsNotNullOrUndefined(c, "component");

        // Build new name string with changed component
        let newName = "";
        for (let j = 0; j < this.noComponents; j++) {
            if (j > 0) {
                newName += this.delimiter;
            }
            if (j === i) {
                newName += this.escapeComponent(c);
            } else {
                newName += this.escapeComponent(this.getComponent(j));
            }
        }

        // Return new Name instance
        return new StringName(newName, this.delimiter);
    }

    // Immutable insert - returns new Name
    public insert(i: number, c: string): Name {
        this.assertIsValidInsertIndex(i);
        this.assertIsNotNullOrUndefined(c, "component");

        // Build new name string with inserted component
        let newName = "";
        let inserted = false;
        
        for (let j = 0; j < this.noComponents; j++) {
            if (j === i && !inserted) {
                if (newName.length > 0) {
                    newName += this.delimiter;
                }
                newName += this.escapeComponent(c);
                newName += this.delimiter;
                inserted = true;
            } else if (newName.length > 0) {
                newName += this.delimiter;
            }
            newName += this.escapeComponent(this.getComponent(j));
        }

        // If inserting at end
        if (i === this.noComponents) {
            if (newName.length > 0) {
                newName += this.delimiter;
            }
            newName += this.escapeComponent(c);
        }

        // Return new Name instance
        return new StringName(newName, this.delimiter);
    }

    // Immutable append - returns new Name
    public append(c: string): Name {
        this.assertIsNotNullOrUndefined(c, "component");

        let newName = this.name;
        if (newName.length > 0) {
            newName += this.delimiter;
        }
        newName += this.escapeComponent(c);

        // Return new Name instance
        return new StringName(newName, this.delimiter);
    }

    // Immutable remove - returns new Name
    public remove(i: number): Name {
        this.assertIsValidIndex(i);

        // Build new name string without the component
        let newName = "";
        let first = true;
        for (let j = 0; j < this.noComponents; j++) {
            if (j !== i) {
                if (!first) {
                    newName += this.delimiter;
                }
                newName += this.escapeComponent(this.getComponent(j));
                first = false;
            }
        }

        // Return new Name instance
        return new StringName(newName, this.delimiter);
    }

    public concat(other: Name): Name {
        return super.concat(other);
    }
}