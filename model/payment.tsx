import {Q} from '@nozbe/watermelondb';
import BudgetTagModel from '../data/budgetTagModel';
import {ContactModel} from '../data/contactModel';
import {database} from '../data/database';
import PaymentModel from '../data/paymentModel';
import PurchaseModel from '../data/purchaseModel';
import BudgetTag, {IBudgetTag} from './budgetTag';
import Calendar from './calendar';
import IContact, {Contact} from './contact';
import ContactableTask from './contactableTask';
import Entry, {EntryModels} from './entry';
import Project from './project';
import Purchase from './purchase';
import Sale from './sale';
import Task, {ITask} from './task';

export enum PaymentType {
  Income,
  Outcome,
}
export interface IPayment extends ITask {
  type: PaymentType;
  contact?: IContact;
}

export default class Payment extends ContactableTask implements IPayment {
  static collection = database.collections.get(PaymentModel.table);
  static rusName = 'Оплата';
  type: PaymentType;
  _model?: PaymentModel;
  sale?: Sale;
  purchase?: Purchase;

  constructor(
    project: Project,
    props: {payment?: IPayment; model?: PaymentModel},
    tag?: BudgetTag,
  ) {
    super(project, {task: props.payment, model: props.model}, tag);
    this.type = props.payment?.type ?? props.model?.type ?? PaymentType.Income;
  }

  get text(): string {
    return `${super.text}${this.totalAmount}\n${
      this.contact ? Contact.displayedName(this.contact) : ''
    }\n${
      this.sale
        ? `Оплата за продажу ${this.sale.title} от ${this.sale.date.dateString}`
        : this.purchase
        ? `Оплата за покупку ${this.purchase.title} от ${this.purchase.date.dateString}`
        : ''
    }`;
  }

  async load() {
    await super.load();
    if (!this._model) return;

    const tagModel = await this._model.budgetTag.fetch();
    if (tagModel) this.tag = new BudgetTag({model: tagModel}, this.project);

    const purchaseModel = (await this._model.purchase.fetch()) as PurchaseModel[];
    if (purchaseModel.length == 1)
      this.purchase = new Purchase(
        this.project,
        {model: purchaseModel[0]},
        this.tag,
      );
    try {
      const saleModel = await this._model.sale.fetch();
      if (saleModel)
        this.sale = new Sale(this.project, {model: saleModel}, this.tag);
    } catch (error) {}
  }

  // static isValid(payment: IPayment): boolean {
  //   return (
  //     !!!payment.contact && !!!payment.totalAmount && payment.totalAmount! > 0
  //   );
  // }

  isValid(): boolean {
    return super.isValid() && this.totalAmount > 0;
  }

  // async setPurchase(purchase: Purchase) {
  //   if (!this._model || !purchase._model) return;
  //   await database.action(async () => {
  //     await this._model?.update((entry: PaymentModel) => {
  //       entry.purchase.set(purchase._model);
  //     });
  //   });
  // }

  async save() {
    if (!this.isValid()) return;
    if (this._model) await this._update();
    else await this._save();
  }

  async _save() {
    let previous: EntryModels | undefined = await Entry.lastOn(
      this.date.dateString,
    );
    if (previous) {
      await Entry.updateEntryLink(previous, previous.previous, this.uuid);
    }

    const contactModel = await this.getContactModel();

    this._model = await database.action(async () => {
      return await Payment.collection.create((entry: PaymentModel) => {
        entry = super.fillWatermelon(entry) as PaymentModel;
        entry.type = this.type;
        entry.contact.set(contactModel);
        if (previous) {
          entry.previous = previous.uuid;
        }
        if (this.sale?.model) {
          entry.sale.set(this.sale.model);
        }
      });
    });
  }

  async _update() {
    const contactModel = await this.getContactModel();

    await database.action(async () => {
      await this.model?.update((entry: PaymentModel) => {
        entry = super.fillWatermelon(entry) as PaymentModel;
        entry.type = this.type;
        entry.contact.set(contactModel);
        // entry.previous = this.previous;
      });
    });
  }

  async delete(force: boolean = false): Promise<void> {
    await this.load();
    if (this.purchase != undefined && !force) {
      this.purchase.undelay();
      await this.purchase.save();
    }
    if (this.sale != undefined) return;
    await super.delete();
  }
}
