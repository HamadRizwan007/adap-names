import { Equality } from "../common/Equality";
import { Cloneable } from "../common/Cloneable";
import { Printable } from "../common/Printable";

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 * 
 * Name is a value type (immutable).
 * All mutation operations return new Name instances.
 */
export interface Name extends Cloneable, Printable, Equality {

    /**
     * Returns true, if number of components == 0; else false
     */
    isEmpty(): boolean;

    /** 
     * Returns number of components in Name instance
     */
    getNoComponents(): number;

    /**
     * Returns component at position i
     */
    getComponent(i: number): string;

    /**
     * Returns new Name with component at position i set to c
     * Original Name remains unchanged (immutable)
     */
    setComponent(i: number, c: string): Name;

    /**
     * Returns new Name with component c inserted at position i
     * Original Name remains unchanged (immutable)
     */
    insert(i: number, c: string): Name;

    /**
     * Returns new Name with component c appended at end
     * Original Name remains unchanged (immutable)
     */
    append(c: string): Name;

    /**
     * Returns new Name with component at position i removed
     * Original Name remains unchanged (immutable)
     */
    remove(i: number): Name;
    
    /**
     * Returns new Name that is concatenation of this and other
     * Original Name remains unchanged (immutable)
     */
    concat(other: Name): Name;
    
}