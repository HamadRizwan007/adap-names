import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        
        // Precondition: source cannot be null or undefined
        this.assertIsNotNullOrUndefined(source, "source");
        
        this.name = source;
        this.noComponents = this.parseComponents(source);
        
        // Class invariant check
        this.assertClassInvariants();
    }

    private parseComponents(source: string): number {
        if (source === "") {
            return 0;
        }
        
        let count = 1;
        let i = 0;
        while (i < source.length) {
            if (source[i] === ESCAPE_CHARACTER && i + 1 < source.length) {
                i += 2; // Skip escaped character
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
        // Precondition: index must be valid
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

        // Last component
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

    public setComponent(i: number, c: string): void {
        // Preconditions
        this.assertIsValidIndex(i);
        this.assertIsNotNullOrUndefined(c, "component");

        // Rebuild the name with new component
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

        this.name = newName;

        // Postcondition: component should be set
        if (this.getComponent(i) !== c) {
            throw new MethodFailedException("failed to set component");
        }

        // Class invariant
        this.assertClassInvariants();
    }

    public insert(i: number, c: string): void {
        // Preconditions
        this.assertIsValidInsertIndex(i);
        this.assertIsNotNullOrUndefined(c, "component");

        const oldLength = this.getNoComponents();

        // Rebuild the name with inserted component
        let newName = "";
        let inserted = false;
        for (let j = 0; j < this.noComponents; j++) {
            if (j === i && !inserted) {
                if (j > 0 || i > 0) {
                    newName += this.delimiter;
                }
                newName += this.escapeComponent(c);
                newName += this.delimiter;
                inserted = true;
            } else {
                if (j > 0 || (j === 0 && i === 0)) {
                    if (newName.length > 0) {
                        newName += this.delimiter;
                    }
                }
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

        this.name = newName;
        this.noComponents++;

        // Postcondition: length should increase by 1
        if (this.getNoComponents() !== oldLength + 1) {
            throw new MethodFailedException("insert did not increase length by 1");
        }

        // Class invariant
        this.assertClassInvariants();
    }

    public append(c: string): void {
        // Precondition
        this.assertIsNotNullOrUndefined(c, "component");

        const oldLength = this.getNoComponents();

        if (this.name.length > 0) {
            this.name += this.delimiter;
        }
        this.name += this.escapeComponent(c);
        this.noComponents++;

        // Postcondition: length should increase by 1
        if (this.getNoComponents() !== oldLength + 1) {
            throw new MethodFailedException("append did not increase length by 1");
        }

        // Class invariant
        this.assertClassInvariants();
    }

    public remove(i: number): void {
        // Precondition
        this.assertIsValidIndex(i);

        const oldLength = this.getNoComponents();

        // Rebuild the name without the component
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

        this.name = newName;
        this.noComponents--;

        // Postcondition: length should decrease by 1
        if (this.getNoComponents() !== oldLength - 1) {
            throw new MethodFailedException("remove did not decrease length by 1");
        }

        // Class invariant
        this.assertClassInvariants();
    }
}