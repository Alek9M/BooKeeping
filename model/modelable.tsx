import {Model} from '@nozbe/watermelondb';
import EntryModel from '../data/entryModel';
import Identifiable, {IIdentifiable} from './identifiable';

export interface IModelable extends IIdentifiable {
  model?: Model;
}

export default abstract class Modelable
  extends Identifiable
  implements IModelable {
  _model?: Model;
  get model() {
    return this._model;
  }

  get copy(): Modelable {
    var clone = Object.create(this);
    clone.generateUUID();
    clone._model = undefined;
    return clone;
  }

  constructor(props: {modelable?: IModelable; model?: Model}) {
    super({identifiable: props.modelable, uuid: props.model?.uuid});
    this._model = props?.modelable?.model ?? props.model;
  }

  abstract save(): Promise<void>;
  abstract delete(): void;
}
