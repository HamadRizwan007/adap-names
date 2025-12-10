import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected readonly components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        
        this.assertIsNotNullOrUndefined(source, "source");
        
        // Make immutable copy
        this.components = [...source];
        
        this.assertClassInvariants();
    }

    public clone(): Name {
        // Return new instance with copied components
        return new StringArrayName([...this.components], this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    // Immutable setComponent - returns new Name
    public setComponent(i: number, c: string): Name {
        // Preconditions
        this.assertIsValidIndex(i);
        this.assertIsNotNullOrUndefined(c, "component");

        // Create new array with changed component
        const newComponents = [...this.components];
        newComponents[i] = c;

        // Return new Name instance
        return new StringArrayName(newComponents, this.delimiter);
    }

    // Immutable insert - returns new Name
    public insert(i: number, c: string): Name {
        // Preconditions
        this.assertIsValidInsertIndex(i);
        this.assertIsNotNullOrUndefined(c, "component");

        // Create new array with inserted component
        const newComponents = [...this.components];
        newComponents.splice(i, 0, c);

        // Return new Name instance
        return new StringArrayName(newComponents, this.delimiter);
    }

    // Immutable append - returns new Name
    public append(c: string): Name {
        // Precondition
        this.assertIsNotNullOrUndefined(c, "component");

        // Create new array with appended component
        const newComponents = [...this.components, c];

        // Return new Name instance
        return new StringArrayName(newComponents, this.delimiter);
    }

    // Immutable remove - returns new Name
    public remove(i: number): Name {
        // Precondition
        this.assertIsValidIndex(i);

        // Create new array without the component
        const newComponents = [...this.components];
        newComponents.splice(i, 1);

        // Return new Name instance
        return new StringArrayName(newComponents, this.delimiter);
    }

    public concat(other: Name): Name {
        return super.concat(other);
    }
}