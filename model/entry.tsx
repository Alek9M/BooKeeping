import {Collection, Model, Q} from '@nozbe/watermelondb';
import BudgetTagModel from '../data/budgetTagModel';
import {database} from '../data/database';
import EntryModel from '../data/entryModel';
import NoteModel from '../data/noteModel';
import PaymentModel from '../data/paymentModel';
import ProjectModel from '../data/projectModel';
import PurchaseModel from '../data/purchaseModel';
import Calendar, {ICalendar} from './calendar';
import Modelable, {IModelable} from './modelable';

export interface IEntry extends IModelable {
  title: string;
  date?: ICalendar;
  done: boolean;
  previous?: string;
  next?: string;
}

export type EntryModels = NoteModel | PaymentModel | PurchaseModel;

export enum EntryTable {
  Notes = 'notes',
  Payments = 'payments',
  Purchases = 'purchases',
  Sales = 'sales',
}

export default abstract class Entry extends Modelable implements IEntry {
  static entryTables: string[] = [
    EntryTable.Notes,
    EntryTable.Payments,
    EntryTable.Purchases,
    EntryTable.Sales,
  ];
  static entryCollections: Collection<Model>[] = Entry.entryTables.map(
    (table) => database.collections.get(table),
  );

  static rusName: string;

  title: string;
  date: Calendar;
  done: boolean;
  // doneDate?: Calendar // TODO: implement
  _model?: EntryModels;
  _previous?: string;
  sum: boolean;
  totalAmount: number;
  get previous() {
    return this._previous;
  }
  _next?: string;
  get next() {
    return this._next;
  }

  get copy(): Entry {
    var clone = super.copy as Entry;
    clone.done = false;
    return clone;
  }

  get text(): string {
    return `${this.title}\n${this.date.dateString}\n`;
  }

  constructor(props: {entry?: IEntry; model?: EntryModel}) {
    super({modelable: props.entry, model: props.model});
    this.title = props.entry?.title ?? props.model?.title ?? '';
    this.date = props.model
      ? Calendar.derive(props.model?.date)
      : new Calendar(props.entry?.date);
    this.done = props.entry?.done ?? props.model?.isDone ?? false;
    this._previous = props.entry?.previous ?? props.model?.previous;
    this._next = props.entry?.next ?? props.model?.next;
  }

  static filterByProjectDescription(
    projects: ProjectModel[],
  ): Q.WhereDescription {
    return Q.where(
      'project_id',
      Q.oneOf(projects.map((project) => project.id)),
    );
  }

  isValid(): boolean {
    return this.title.length > 0;
  }

  async load() {}

  fillWatermelon(entry: EntryModel): EntryModel {
    entry = super.fillWatermelon(entry);
    entry.title = this.title;
    entry.date = this.date.dateString;
    entry.day = this.date.day;
    entry.month = this.date.month;
    entry.year = this.date.year;
    entry.isDone = this.done;

    entry.previous = this.previous;
    entry.next = this.next;
    return entry;
  }

  static async checkAllCollections(Qs: Q.Clause[]): Promise<Model[]> {
    const models = await Promise.all(
      this.entryCollections.map(
        async (collection) => await collection.query(...Qs).fetch(),
      ),
    );
    return models.reduce((current, next) => current.concat(next), []);
  }

  static async find(uuid?: string): Promise<EntryModels | undefined> {
    if (uuid == undefined) {
      return undefined;
    }

    const found = await this.checkAllCollections([Q.where('uuid', uuid)]);

    switch (found.length) {
      case 1:
        return found[0];
      case 0:
        return undefined;
      default:
        throw new Error(`More than 1 entry was found with uuid ${uuid}`);
    }
  }

  static async lastOn(date: string): Promise<EntryModels | undefined> {
    const noNextOn = await this.checkAllCollections([
      Q.where('date', date),
      Q.where('next', null),
      Q.where('is_done', false),
    ]);

    switch (noNextOn.length) {
      case 1:
        return noNextOn[0];
      case 0:
        return undefined;
      default:
        throw new Error(`More than one note without next pointer on ${date}`);
    }
  }

  static async futureUndone() {
    const today = new Calendar();
    return await this.checkAllCollections(this._futureUndoneQuery());
  }

  static _futureUndoneQuery(): Q.Clause[] {
    const today = new Calendar();
    return [
      Q.where('is_done', false),
      Q.or(
        Q.where('year', Q.gt(today.year)),
        Q.and(Q.where('year', today.year), Q.where('month', Q.gt(today.month))),
        Q.and(
          Q.where('year', today.year),
          Q.where('month', today.month),
          Q.where('day', Q.gt(today.day)),
        ),
      ),
    ];
  }

  static futureUndoneFor(table: EntryTable) {
    return database.collections.get(table).query(...Entry._futureUndoneQuery());
  }

  static _upToTodayUndoneQuery(): Q.Clause[] {
    const today = new Calendar();
    return [
      Q.where('is_done', false),
      Q.or(
        Q.where('date', today.dateString),
        Q.where('year', Q.lt(today.year)),
        Q.and(Q.where('year', today.year), Q.where('month', Q.lt(today.month))),
        Q.and(
          Q.where('year', today.year),
          Q.where('month', today.month),
          Q.where('day', Q.lt(today.day)),
        ),
      ),
    ];
  }

  static upToTodayUndoneFor(table: EntryTable) {
    return database.collections
      .get(table)
      .query(...this._upToTodayUndoneQuery());
  }

  static async upToTodayUndone() {
    const today = new Calendar();
    return await this.checkAllCollections(this._upToTodayUndoneQuery());
  }

  static async done() {
    return await this.checkAllCollections([Q.where('is_done', true)]);
  }
  static doneFor(table: EntryTable) {
    return database.collections.get(table).query(Q.where('is_done', true));
  }

  async delete() {
    if (this._model) {
      if (this.previous) {
        let previous: EntryModels | undefined = await Entry.find(
          this._model.previous,
        );
        if (previous) {
          await Entry.updateEntryLink(previous, previous.previous, this.next);
        }
      }
      if (this.next) {
        let next: EntryModels | undefined = await Entry.find(this._model.next);
        if (next) {
          await Entry.updateEntryLink(next, this.previous, next.next);
        }
      }
      await database.action(async () => {
        // if (this.model?.delete) {
        //   await this.model.delete();
        // } else {
        await this._model?.destroyPermanently();
        // }
      });
    }
  }

  async setDone(state: boolean) {
    this.done = state;
    if (this.done) {
      if (this.previous) {
        const previous = await Entry.find(this.previous);
        if (previous) {
          await Entry.updateEntryLink(previous, previous.previous, this.next);
        }
      }
      if (this.next) {
        const next = await Entry.find(this.next);
        if (next) {
          await Entry.updateEntryLink(next, this.previous, next.next);
        }
      }
      this._previous = undefined;
      this._next = undefined;
    } else {
      const previous = await Entry.lastOn(this.date.dateString);
      if (previous) {
        await Entry.updateEntryLink(previous, previous.previous, this.uuid);
        this._previous = previous.uuid;
      }
    }

    await this.save();
  }

  async updateLinks() {
    await database.action(async () => {
      await this._model?.update((record: EntryModels) => {
        record.previous = this.previous;
        record.next = this.next;
      });
    });
  }

  static async updateEntryLink(
    entry: EntryModels,
    previous?: string,
    next?: string,
  ) {
    await database.action(async () => {
      await entry.update((record: EntryModels) => {
        if (previous) {
          record.previous = previous;
        }
        if (next) {
          record.next = next;
        }
      });
    });
  }

  //   static demodel(model: Model, project: ProjectModel, tag: BudgetTagModel) {
  //     switch (model.constructor) {
  //       case NoteModel:
  //         return new Note({model: model as NoteModel});
  //       case PaymentModel:
  //         return new Payment(new Project({model: project}), {
  //           model: model as PaymentModel,
  //         });

  //       default:
  //         break;
  //     }
  //   }
}
