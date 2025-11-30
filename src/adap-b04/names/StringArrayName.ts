import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        
        // Precondition: source cannot be null or undefined
        this.assertIsNotNullOrUndefined(source, "source");
        
        // Copy components
        this.components = [...source];
        
        // Class invariant check
        this.assertClassInvariants();
    }

    public clone(): Name {
        return new StringArrayName(this.components, this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        // Precondition: index must be valid
        this.assertIsValidIndex(i);
        
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        // Preconditions
        this.assertIsValidIndex(i);
        this.assertIsNotNullOrUndefined(c, "component");

        const oldComponent = this.components[i];
        this.components[i] = c;

        // Postcondition: component should be set
        if (this.components[i] !== c) {
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

        this.components.splice(i, 0, c);

        // Postcondition: length should increase by 1
        if (this.getNoComponents() !== oldLength + 1) {
            throw new MethodFailedException("insert did not increase length by 1");
        }

        // Postcondition: component at index should be c
        if (this.components[i] !== c) {
            throw new MethodFailedException("component not inserted correctly");
        }

        // Class invariant
        this.assertClassInvariants();
    }

    public append(c: string): void {
        // Precondition
        this.assertIsNotNullOrUndefined(c, "component");

        const oldLength = this.getNoComponents();
        this.components.push(c);

        // Postcondition: length should increase by 1
        if (this.getNoComponents() !== oldLength + 1) {
            throw new MethodFailedException("append did not increase length by 1");
        }

        // Postcondition: last component should be c
        if (this.components[this.components.length - 1] !== c) {
            throw new MethodFailedException("component not appended correctly");
        }

        // Class invariant
        this.assertClassInvariants();
    }

    public remove(i: number): void {
        // Precondition
        this.assertIsValidIndex(i);

        const oldLength = this.getNoComponents();
        this.components.splice(i, 1);

        // Postcondition: length should decrease by 1
        if (this.getNoComponents() !== oldLength - 1) {
            throw new MethodFailedException("remove did not decrease length by 1");
        }

        // Class invariant
        this.assertClassInvariants();
    }
}