import { AbstractDatastore } from './datastore.js';
import { type Datastore } from './types.js';

export abstract class AbstractHybridDatastore<
  DocMeta extends Datastore.BaseMeta,
  Filter extends Datastore.BaseFilter<DocMeta>,
> extends AbstractDatastore<DocMeta, Filter> {
  protected spladeModel: any;

  constructor(args: Datastore.OptsHybrid<DocMeta, Filter>) {
    const { spladeModel: _, ...rest } = args;
    super(rest);
    this.spladeModel = args.spladeModel;
  }
}
