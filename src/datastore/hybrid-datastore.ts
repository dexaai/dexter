import type { Model } from '../model/index.js';
import { AbstractDatastore } from './datastore.js';
import type { Dstore } from './types.js';

export abstract class AbstractHybridDatastore<
    DocMeta extends Dstore.BaseMeta,
    Filter extends Dstore.BaseFilter<DocMeta>
  >
  extends AbstractDatastore<DocMeta, Filter>
  implements Dstore.IDatastore<DocMeta, Filter>
{
  protected spladeModel: Model.SparseVector.IModel;

  constructor(args: Dstore.OptsHybrid<DocMeta, Filter>) {
    const { spladeModel, ...rest } = args;
    super(rest);
    this.spladeModel = args.spladeModel;
  }
}
