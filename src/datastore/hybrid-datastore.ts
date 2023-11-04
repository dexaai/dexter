import type { Model } from '../model/index.js';
import { AbstractDatastore } from './datastore.js';
import type { Datastore } from './types.js';

export abstract class AbstractHybridDatastore<
  DocMeta extends Datastore.BaseMeta,
  Filter extends Datastore.BaseFilter<DocMeta>
> extends AbstractDatastore<DocMeta, Filter> {
  protected spladeModel: Model.SparseVector.Model;

  constructor(args: Datastore.OptsHybrid<DocMeta, Filter>) {
    const { spladeModel, ...rest } = args;
    super(rest);
    this.spladeModel = args.spladeModel;
  }
}
