import {Q} from '@nozbe/watermelondb';
import BudgetTitleModel from '../data/budgetTitleModel';
import {database} from '../data/database';
import Modelable, {IModelable} from './modelable';

export interface IBudgetTitle extends IModelable {
  title: string;
}

export default class BudgetTitle extends Modelable implements IBudgetTitle {
  static collection = database.collections.get(BudgetTitleModel.table);
  title: string;
  _model?: BudgetTitleModel;

  constructor(props: {title?: IBudgetTitle; model?: BudgetTitleModel}) {
    super({modelable: props.title, model: props.model});
    this.title = props.title?.title ?? props.model?.title ?? '';
  }

  async save() {
    if (this.model) {
      await this._update();
    } else {
      await this._save();
    }
  }

  async _save() {
    const model = await database.action(async () => {
      return await BudgetTitle.collection.create((record: BudgetTitleModel) => {
        record.uuid = this.uuid;
        record.title = this.title;
      });
    });
    this._model = model;
    return model;
  }

  static async find(title: string): BudgetTitleModel {
    let titleModels = await BudgetTitle.collection
      .query(Q.where('title', title))
      .fetch();
    switch (titleModels.length) {
      case 1:
        return titleModels[0];
      case 0:
        const budgetTitle = new BudgetTitle({});
        budgetTitle.title = title;
        await budgetTitle.save();
        return budgetTitle.model!;
      default:
        throw new Error('More than one title was found');
    }
  }

  async _update() {}

  async delete() {}
}
