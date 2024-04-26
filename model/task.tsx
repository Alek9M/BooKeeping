import {Model} from '@nozbe/watermelondb';
import EntryModel from '../data/entryModel';
import BudgetTag, {IBudgetTag} from './budgetTag';
import Entry, {IEntry} from './entry';
import {IPayment} from './payment';
import Project, {IProject} from './project';
import {IPurchase} from './purchase';

type ITaskType = IPayment | IPurchase; // | ISale;

export interface ITask extends IEntry {
  totalAmount?: number;
  project: IProject;
  tag?: IBudgetTag;
}

export default abstract class Task extends Entry implements ITask {
  isDelayed() {
    throw new Error('Method not implemented.');
  }
  _totalAmount: number;
  purchase: undefined;
  get totalAmount(): number {
    return this._totalAmount;
  }
  set totalAmount(v: number) {
    if (v >= 0) {
      this._totalAmount = v;
    }
  }

  project: Project;
  tag?: BudgetTag = undefined;

  constructor(
    project: Project,
    props: {task?: ITask; model?: Model},
    tag?: BudgetTag,
  ) {
    super({entry: props.task, model: props.model});
    this.project = project;
    this._totalAmount = props.task?.totalAmount ?? props.model?.amount ?? 0;

    if (props.task?.tag) {
      this.tag = BudgetTag.get(props.task.tag);
    }
    if (tag) {
      this.tag = tag;
    }
  }
  async load(): Promise<void> {
    if (!this.model) return;
    this.project = new Project({model: await this._model?.project.fetch()});
    this.tag = new BudgetTag({model: await this._model?.budgetTag.fetch()});
  }

  fillWatermelon(entry: EntryModel): EntryModel {
    entry = super.fillWatermelon(entry);
    entry.amount = this.totalAmount;
    entry.project.set(this.project?._model);
    entry.budgetTag.set(this.tag?._model);
    return entry;
  }

  async delete(): Promise<void> {
    await super.delete();
  }
}
