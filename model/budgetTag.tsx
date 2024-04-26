import BudgetTagModel from '../data/budgetTagModel';
import {database} from '../data/database';
import ProjectModel from '../data/projectModel';
import Calendar, {ICalendar} from './calendar';
import {IIdentifiable} from './identifiable';
import Modelable from './modelable';
import {PaymentType} from './payment';
import Project from './project';

export interface IBudgetTag extends IIdentifiable {
  title: string;
  amount?: number;
  type: PaymentType;
  year: number;
  month: number;
}

export default class BudgetTag extends Modelable implements IBudgetTag {
  static collection = database.collections.get(BudgetTagModel.table);
  async delete() {
    if (!this._model) return;
    await this._model.delete();
    // throw new Error('Method not implemented.');
  }
  title: string;
  amount: number;
  type: PaymentType;
  year: number;
  month: number;
  project?: Project;
  _model?: BudgetTagModel;

  constructor(
    props: {budget?: IBudgetTag; model?: BudgetTagModel},
    project?: Project,
  ) {
    super({modelable: props.budget, model: props.model});
    // if (!BudgetTag.isValid(budget)) {
    //   throw new Error('Invalid budget');
    // }
    this.title = props.budget?.title ?? props.model?.title ?? '';
    this.amount = props.budget?.amount ?? props.model?.amount ?? 0;
    this.type = props.budget?.type ?? props.model?.type ?? 0;
    this.year = props.budget?.year ?? props.model?.year ?? new Calendar().year;
    this.month =
      props.budget?.month ?? props.model?.month ?? new Calendar().month;
    this._model = props.model;
    this.project = project;
  }

  static demodel(model: BudgetTagModel): BudgetTag {
    const iBud: IBudgetTag = {
      title: model.title,
      amount: model.amount,
      type: model.type,
      year: model.year,
      month: model.month,
      uuid: model.uuid,
    };
    return new BudgetTag({budget: iBud, model: model});
  }

  get day(): ICalendar {
    return Calendar.of(this.year, this.month, 1);
  }

  async save() {
    if (this._model) {
      await this._update();
    } else {
      await this._save();
      // saveBudgetTag(this);
    }
  }

  async _save() {
    this._model = await database.action(async () => {
      return await BudgetTag.collection.create((record: BudgetTagModel) => {
        record.title = this.title;
        record.month = this.month;
        record.year = this.year;
        record.type = this.type;
        record.amount = this.amount;
        record.uuid = this.uuid;
        record.project.set(this.project?.model);
      });
    });
    if (this._model) {
      const fake = this._model;
    }
  }

  async _update() {
    await database.action(async () => {
      return await this._model?.update((record: BudgetTagModel) => {
        record.title = this.title;
        record.month = this.month;
        record.year = this.year;
        record.type = this.type;
        record.amount = this.amount;
        // record.uuid = this.uuid;
        record.project.set(this.project?.model);
      });
    });
  }

  async load() {
    this.project;
  }

  static isValid(budget: IBudgetTag): boolean {
    return budget.title.length > 0 && (budget.amount ?? 0) >= 0;
  }

  static get(budget: IBudgetTag): BudgetTag {
    // TODO: check if exists
    return new BudgetTag({budget: budget}); //, budget);
  }
}
