import {Collection, Database, Model, Q} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import Calendar from '../model/calendar';
import Entry from '../model/entry';
import Note from '../model/note';
import Payment from '../model/payment';
import ArticleInModel from './articleInModel';
import ArticleModel from './articleModel';
import ArticleOutModel from './articleOutModel';
import BudgetTagModel from './budgetTagModel';
import {ContactCardModel} from './contactCardModel';
import {ContactModel, ContactSalesModel} from './contactModel';
import NoteListItemModel from './noteListItemModel';

import NoteModel from './noteModel';
import PaymentModel from './paymentModel';
import ProjectModel from './projectModel';
import PurchaseModel from './purchaseModel';
import SaleModel from './saleModel';
import schema from './schema';
import ServiceExecutionModel from './serviceExecutionModel';
import ServiceModel from './serviceModel';
import ServicePriceModel from './servicePriceModel';

const adapter = new SQLiteAdapter({
  schema,
});

export const database = new Database({
  adapter,
  modelClasses: [
    NoteModel,
    NoteListItemModel,
    PaymentModel,
    PurchaseModel,
    SaleModel,
    ProjectModel,
    BudgetTagModel,
    ServiceModel,
    ServicePriceModel,
    ServiceExecutionModel,
    ArticleModel,
    ArticleInModel,
    ArticleOutModel,
    ContactModel,
    ContactSalesModel,
    ContactCardModel,
  ],
  actionsEnabled: true,
});

export abstract class EntrysModel {
  abstract title: string;
  abstract date: string;
  abstract day: number;
  abstract month: number;
  abstract year: number;
  abstract isDone: boolean;
  abstract uuid: string;
  abstract previous?: string;
  abstract next?: string;

  abstract setPointers(previous?: string, next?: string): Promise<void>;
  abstract delete(): Promise<void>;

  static notes = database.collections.get('notes');
  static payments = database.collections.get('payments');

  static entryTables: string[] = ['notes', 'payments'];
  static entryCollections: Collection<Model>[] = EntrysModel.entryTables.map(
    (table) => database.collections.get(table),
  );

  // static async save(entry: Entry) {
  //   switch (entry.constructor) {
  //     case Note:
  //       await this.saveTo('notes', entry);
  //       break;
  //     case Payment:
  //       await this.saveTo('payments', entry);

  //     default:
  //       break;
  //   }
  // }

  static async updatePointers(entries: Entry[]) {
    if (entries.every((entry) => Boolean(entry.model))) {
      await database.action(async () => {
        entries.forEach(
          async (entry) =>
            await entry.model!.update((record: EntrysModel) => {
              record.previous = entry.previous;
              record.next = entry.next;
            }),
        );
        // await database.batch(
        //   ...entries.map((entry) =>
        //     entry.model!.prepareUpdate((record) => {
        //       record.previous = entry.previous;
        //       record.next = entry.next;
        //     }),
        //   ),
        // );
      });
    }
  }

  // private static async saveTo(table: string, entry: Entry) {
  //   const previous: EntryModel | undefined = await this.lastOn(
  //     entry.date.dateString,
  //   );
  //   const collection = database.collections.get(table);
  //   await database.action(async () => {
  //     await collection.create((model: EntryModel) => {
  //       model.title = entry.title;
  //       model.date = entry.date.dateString;
  //       model.day = entry.date.day;
  //       model.month = entry.date.month;
  //       model.year = entry.date.year;
  //       model.isDone = entry.done;
  //       model.uuid = entry.uuid;

  //       model.project.set(entry.project?.model);
  //       if (previous) {
  //         model.previous = previous.uuid;
  //       }

  //       if (entry instanceof Note) {
  //         model.note = entry.note;
  //       } else if (entry instanceof Payment) {
  //         model.type = entry.type;
  //         model.contact = entry.contact!.recordID;
  //         model.amount = entry.totalAmount;
  //         if (entry.tag?.model) {
  //           model.budgetTag.set(entry.tag?.model);
  //         }
  //       }
  //     });
  //     await previous?.update((record) => (record.next = entry.uuid));
  //   });
  // }
}
