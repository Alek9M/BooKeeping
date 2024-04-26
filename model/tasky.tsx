import {Model} from '@nozbe/watermelondb';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import BudgetTagModel from '../data/budgetTagModel';
import {EntrysModel} from '../data/database';
import {
  deleteNote,
  deletePayment,
  findNote,
  lastNote,
  saveBudgetTag,
  saveNote,
  savePayment,
  saveProject,
  updateNote,
  updateProject,
} from '../data/helpers';
import NoteModel from '../data/noteModel';
import PaymentModel from '../data/paymentModel';
import ProjectModel from '../data/projectModel';
import BudgetTag, {IBudgetTag} from './budgetTag';
import Calendar from './calendar';

import ICalendar from './calendar';
import IContact, {Contact} from './contact';
import Identifiable from './identifiable';
import Task, {ITask} from './task';

enum TaskType {
  Payment,
  Purchase,
  Sale,
}

// interface IInItem {
//   title: string;
//   inPrice?: number;
//   outPrice?: number;
//   quantity?: number;
// }

// interface IPurchase extends ITask {
//   // discriminator: TaskType.Purchase;
//   delayedDate?: ICalendar;
//   contact?: IContact;
//   tag?: IBudgetTag;
//   items: IInItem[];
// }

// interface IOutItem {
//   item: IInItem;
//   discount?: number;
// }

// interface ISale extends ITask {
//   // discriminator: TaskType.Sale;
//   notification?: ICalendar;
//   delayedDate?: ICalendar;
//   contacts: IContact[];
//   items: IOutItem[];
// }

// class InItem extends Identifiable implements IInItem {
//   title: string;
//   inPrice: number;
//   outPrice?: number = undefined;
//   quantity: number;

//   constructor(item: IInItem) {
//     super();
//     if (!InItem.isValid(item)) {
//       throw new Error('Invalid Item');
//     }
//     this.title = item.title;
//     this.inPrice = item.inPrice!;
//     this.outPrice = item.outPrice;
//     this.quantity = item.quantity!;
//   }

//   static isValid(item: IInItem): boolean {
//     return (
//       item.title.length > 0 &&
//       Boolean(item.inPrice) &&
//       item.inPrice! > 0 &&
//       Boolean(item.quantity) &&
//       item.quantity! > 0
//     );
//   }
// }

// class Purchase extends Task implements IPurchase {
//   delayedDate?: Calendar;
//   contact: IContact;
//   tag?: BudgetTag = undefined;
//   items: InItem[];

//   constructor(purchase: IPurchase) {
//     super(purchase);
//     if (!Purchase.isValid(purchase)) {
//       throw new Error('Invalid purchase');
//     }
//     this.delayedDate = purchase.delayedDate;
//     this.contact = purchase.contact!;
//     if (purchase.tag) {
//       this.tag = BudgetTag.get(purchase.tag);
//     }
//     this.items = purchase.items.map((item) => new InItem(item));
//   }

//   static isValid(purchase: IPurchase) {
//     return Boolean(purchase.contact) && purchase.items.length > 0;
//   }
// }

// class OutItem extends Identifiable implements IOutItem {
//   item: InItem;
//   discount: number;

//   constructor(item: IOutItem) {
//     super();
//     this.discount = item.discount ?? 0;
//     this.item = new InItem(item.item); // TODO: implement .get()
//   }
// }

// class Sale extends Task implements ISale {
//   notification?: ICalendar;
//   delayedDate?: ICalendar;
//   contacts: IContact[];
//   items: OutItem[];

//   constructor(sale: ISale) {
//     super(sale);
//     if (!Sale.isValid(sale)) {
//       throw new Error('Invalid sale');
//     }
//     this.notification = sale.notification;
//     this.delayedDate = sale.delayedDate;
//     this.contacts = sale.contacts;
//     this.items = sale.items.map((item) => new OutItem(item));
//   }

//   static isValid(sale: ISale) {
//     return sale.contacts.length > 0 && sale.items.length > 0;
//   }
// }
