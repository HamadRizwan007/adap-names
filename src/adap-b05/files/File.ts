import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { InvalidStateException } from "../common/InvalidStateException";
import { Exception } from "../common/Exception";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {
        let result: Int8Array = new Int8Array(noBytes);
        
        let tries: number = 0;
        const MAX_RETRIES = 3;
        
        for (let i: number = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
                tries = 0; // Reset tries on success
                
            } catch(ex) {
                tries++;
                
                if (ex instanceof MethodFailedException) {
                    // Try to handle the error
                    if (tries < MAX_RETRIES) {
                        // Resume: try reading again
                        i--; // Retry same byte
                    } else {
                        // Escalate: too many failures
                        throw new ServiceFailureException(
                            "failed to read file after " + MAX_RETRIES + " attempts",
                            ex
                        );
                    }
                } else {
                    // Unknown error, escalate immediately
                    throw new ServiceFailureException("unexpected error while reading file", ex as Exception);
                }
            }
        }

        return result;
    }

    protected readNextByte(): number {
        // Check precondition - file should be open
        if (this.state !== FileState.OPEN) {
            throw new InvalidStateException("cannot read from closed file");
        }
        
        return 0;
    }

    public close(): void {
        this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}