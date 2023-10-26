import type { Model } from '@dexaai/model';
import { AbstractDatastore } from './datastore.js';
import type { Dstore } from './types.js';

export abstract class AbstractHybridDatastore<DocMeta extends Dstore.BaseMeta>
  extends AbstractDatastore<DocMeta>
  implements Dstore.IDatastore<DocMeta>
{
  protected spladeModel: Model.SparseVector.IModel;

  constructor(args: Dstore.OptsHybrid<DocMeta>) {
    const { spladeModel, ...rest } = args;
    super(rest);
    this.spladeModel = args.spladeModel;
  }
}
