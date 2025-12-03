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

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
    }

    public asDataString(): string {
        return this.name;
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
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

    public setComponent(i: number, c: string) {
        this.assertIsValidIndex(i);
        this.assertIsNotNullOrUndefined(c, "component");

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

        MethodFailedException.assert(
            this.getComponent(i) === c,
            "failed to set component"
        );

        this.assertClassInvariants();
    }

    public insert(i: number, c: string) {
        this.assertIsValidInsertIndex(i);
        this.assertIsNotNullOrUndefined(c, "component");

        const oldLength = this.getNoComponents();

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

        if (i === this.noComponents) {
            if (newName.length > 0) {
                newName += this.delimiter;
            }
            newName += this.escapeComponent(c);
        }

        this.name = newName;
        this.noComponents++;

        MethodFailedException.assert(
            this.getNoComponents() === oldLength + 1,
            "insert did not increase length"
        );

        this.assertClassInvariants();
    }

    public append(c: string) {
        this.assertIsNotNullOrUndefined(c, "component");

        const oldLength = this.getNoComponents();

        if (this.name.length > 0) {
            this.name += this.delimiter;
        }
        this.name += this.escapeComponent(c);
        this.noComponents++;

        MethodFailedException.assert(
            this.getNoComponents() === oldLength + 1,
            "append did not increase length"
        );

        this.assertClassInvariants();
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);

        const oldLength = this.getNoComponents();

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

        MethodFailedException.assert(
            this.getNoComponents() === oldLength - 1,
            "remove did not decrease length"
        );

        this.assertClassInvariants();
    }

    public concat(other: Name): void {
        super.concat(other);
    }
}