import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.doSetBaseName(bn);
        this.parentNode = pn;
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        // Precondition: basename cannot be null or undefined
        IllegalArgumentException.assert(
            bn !== null && bn !== undefined,
            "basename cannot be null or undefined"
        );

        try {
            const result = new Set<Node>();
            
            // Check class invariant: basename should not be empty
            // This will catch the BuggyFile issue
            const currentBaseName = this.getBaseName();
            InvalidStateException.assert(
                currentBaseName !== null && currentBaseName !== undefined,
                "node has invalid null or undefined basename"
            );
            
            InvalidStateException.assert(
                currentBaseName !== "",
                "node has invalid empty basename"
            );
            
            // Check if current node matches
            if (currentBaseName === bn) {
                result.add(this);
            }
            
            return result;
            
        } catch (ex) {
            // If something goes wrong, escalate as service failure
            throw new ServiceFailureException("failed to find nodes", ex as Exception);
        }
    }

}