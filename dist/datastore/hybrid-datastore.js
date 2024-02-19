import { AbstractDatastore } from './datastore.js';
export class AbstractHybridDatastore extends AbstractDatastore {
    spladeModel;
    constructor(args) {
        const { spladeModel, ...rest } = args;
        super(rest);
        this.spladeModel = args.spladeModel;
    }
}
//# sourceMappingURL=hybrid-datastore.js.map