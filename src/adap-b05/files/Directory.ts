import { Node } from "./Node";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { Exception } from "../common/Exception";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn);
    }

    /**
     * Override to search recursively through child nodes
     */
    public findNodes(bn: string): Set<Node> {
        // Precondition check
        IllegalArgumentException.assert(
            bn !== null && bn !== undefined,
            "basename cannot be null or undefined"
        );

        try {
            const result = new Set<Node>();
            
            // Check class invariant for this directory
            const currentBaseName = this.getBaseName();
            InvalidStateException.assert(
                currentBaseName !== null && currentBaseName !== undefined,
                "directory has invalid null or undefined basename"
            );
            
            InvalidStateException.assert(
                currentBaseName !== "",
                "directory has invalid empty basename"
            );
            
            // Check if this directory matches
            if (currentBaseName === bn) {
                result.add(this);
            }
            
            // Search through all children recursively
            for (const child of this.childNodes) {
                try {
                    const childResults = child.findNodes(bn);
                    for (const node of childResults) {
                        result.add(node);
                    }
                } catch (ex) {
                    // If a child has invalid state, escalate it
                    throw new ServiceFailureException(
                        "encountered invalid node during search",
                        ex as Exception
                    );
                }
            }
            
            return result;
            
        } catch (ex) {
            // Escalate any failures as service failure
            throw new ServiceFailureException("failed to search directory", ex as Exception);
        }
    }

}