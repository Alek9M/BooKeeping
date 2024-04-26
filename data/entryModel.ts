import {Collection, Model, Q} from '@nozbe/watermelondb';
import {
  field,
  nochange,
  action,
  text,
  relation,
} from '@nozbe/watermelondb/decorators';
import Calendar from '../model/calendar';
import {database} from './database';

export enum EntryTable {
  Notes = 'notes',
  Payments = 'payments',
  Purchases = 'purchases',
}

export default class EntryModel extends Model {
  @text('title') title: string;
  @field('date') date: string;
  @field('day') day: number;
  @field('month') month: number;
  @field('year') year: number;
  @field('is_done') isDone: boolean;
  @field('done_at') done_at?: string;
  @nochange @field('uuid') uuid: string;
  @field('previous') previous: string | undefined;
  @field('next') next: string | undefined;

  static entryTables: string[] = [
    EntryTable.Notes,
    EntryTable.Payments,
    EntryTable.Purchases,
  ];

  entryCollections: Collection<Model>[] = EntryModel.entryTables.map((table) =>
    database.collections.get(table),
  );

  async _checkAllCollections(Qs: Q.Clause[]): Promise<Model[]> {
    const models = await Promise.all(
      this.entryCollections.map(
        async (collection) => await collection.query(...Qs).fetch(),
      ),
    );
    return models.reduce((current, next) => current.concat(next), []);
  }

  async findByUuid(uuid?: string): Promise<EntryModel | undefined> {
    if (uuid == undefined) {
      return undefined;
    }

    const found = await this._checkAllCollections([Q.where('uuid', uuid)]);

    switch (found.length) {
      case 1:
        return found[0] as EntryModel;
      case 0:
        return undefined;
      default:
        throw new Error(`More than 1 entry was found with uuid ${uuid}`);
    }
  }

  async lastUndoneOn(date: string): Promise<EntryModel | undefined> {
    const noNextOn = await this._checkAllCollections([
      Q.where('date', date),
      Q.where('is_done', false),
      Q.where('next', null),
    ]);

    switch (noNextOn.length) {
      case 1:
        return noNextOn[0] as EntryModel;
      case 0:
        return undefined;
      default:
        throw new Error(
          `More than one undone entry without next pointer on ${date}`,
        );
    }
  }

  @action async linkSurrounding() {
    const previous = await this.findByUuid(this.previous);
    const next = await this.findByUuid(this.next);
    if (previous) {
      await this.subAction(() =>
        previous.setPointers(previous.previous, next?.uuid),
      );
    }
    if (next) {
      await this.subAction(() => next.setPointers(previous?.uuid, next.next));
    }
  }

  @action async setDone(done: boolean) {
    let done_at: string | undefined = undefined;
    if (done) {
      done_at = new Calendar().dateString;
      await this.subAction(() => this.linkSurrounding());
    } else {
      var previous = await this.lastUndoneOn(this.date);
      if (previous) {
        await this.subAction(() =>
          previous!.setPointers(previous!.previous, this.uuid),
        );
      }
    }

    await this.update((record) => {
      record.isDone = done;
      record.done_at = done_at;
      if (done) {
        record.previous = undefined;
        record.next = undefined;
      } else {
        if (previous) {
          record.previous = previous.uuid;
        }
      }
    });
  }

  @action async delete() {
    await this.subAction(async () => await this.linkSurrounding());

    await this.destroyPermanently();
  }

  @action async setPointers(previous?: string, next?: string) {
    await this.update((record) => {
      record.previous = previous;
      record.next = next;
    });
  }
}
