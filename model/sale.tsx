import 'react-native-get-random-values';
import {Model, Q} from '@nozbe/watermelondb';
//
import Calendar from './calendar';
import BudgetTag from './budgetTag';
import Task, {ITask} from './task';
import Article, {
  ArticleIn,
  ArticleOut,
  IArticleIn,
  IArticleOut,
  OutType,
} from './article';
import Project from './project';
import IContact, {Contact} from './contact';
import {database} from '../data/database';
import Entry, {EntryModels} from './entry';
import ArticleInModel from '../data/articleInModel';
import SaleModel from '../data/saleModel';
import {ContactModel, ContactSalesModel} from '../data/contactModel';
import Payment, {PaymentType} from './payment';
// import {Service} from './service';
import ArticleOutModel from '../data/articleOutModel';
import ArticleModel from '../data/articleModel';
import ServiceExecutionModel from '../data/serviceExecutionModel';
import ServicePriceModel from '../data/servicePriceModel';
import ServiceModel from '../data/serviceModel';
import {ServiceExecution} from './serviceExecution';
import {Service} from './service';

export interface ISale extends ITask {
  delayedDate?: Calendar;
  contacts: IContact[];
  items: IArticleOut[];
}

export default class Sale extends Task {
  static collection = database.collections.get(SaleModel.table);
  static rusName = 'Продажа';
  _delayedDate?: Calendar;
  payments?: Payment[];
  contacts: IContact[] = [];
  articles: Article[] = [];
  services: any[] = []; //Service[] = [];
  _model?: SaleModel;

  servicesToDelete: ServiceExecution[] = [];
  articlesToDelete: ArticleOut[] = [];
  contactsToDelete: IContact[] = [];

  get delayedDate(): Calendar | undefined {
    return this._delayedDate;
  }

  set delayedDate(day: Calendar | undefined) {
    this._delayedDate = day;
    if (!day) this.payments = undefined;
    this.payments?.forEach((payment) => (payment.date = day!));
  }

  get sum(): number {
    return (
      this.articles.reduce((acc, cur) => acc + cur.sumOut, 0) +
      this.services.reduce((acc, cur) => acc + cur.sumOut, 0)
    );
  }

  get copy(): Sale {
    var clone = super.copy as Sale;
    clone.articles = this.articles.map((article) => article.copy as Article);
    clone.articles.forEach((art) => art.setSale(clone));
    clone.payments = this.payments?.map((payment) => payment.copy as Payment);
    clone.services = this.services.map((service) => service.copy);
    clone.services.forEach((ser) => ser.setSale(clone));
    return clone;
  }

  get text(): string {
    return `${super.text}${this.totalAmount}\n\n${this.contacts
      .map((contact) => this.textFor(contact))
      .join('\n')}`;
  }

  private textFor(contact: IContact): string | undefined {
    if (!this.contacts.includes(contact)) return undefined;
    const articles = this.articles.filter((art) => art.isSoldTo(contact));
    const articlesInfo = articles.map(
      (art) =>
        `${art.title} ${art.priceOut} * ${art.quantityOutFor(
          contact,
        )} ${art.priceOutFor(contact)}`,
    );
    return articlesInfo.join('\n');
  }

  constructor(
    project: Project,
    props: {sale?: ISale; model?: SaleModel},
    tag?: BudgetTag,
  ) {
    super(project, props, tag);
    this.contacts = props.sale?.contacts ?? [];
    this._delayedDate = props.sale?.delayedDate;
  }

  isDelayed(): boolean {
    return Boolean(this.delayedDate || this.payments);
  }

  updateDelayedPayments() {
    if (!this.delayedDate) return;
    if (this.payments?.some((payment) => payment._model))
      this._updateDelayedPayments();
    else this._generateDelayedPayments();

    if (!this._model) return;
    this.payments?.forEach((payment) => (payment.sale = this));
  }

  _updatedDelayedPayment(payment: Payment): Payment {
    if (!this.delayedDate || !payment.contact)
      throw new Error(
        'Trying to update delayed payment with no delayed date or contact present',
      );
    payment.project = this.project;
    payment.type = PaymentType.Income;
    payment.date = this.delayedDate;
    payment.title = `${Contact.displayedName(payment.contact)} payment for ${
      this.title
    }`;
    payment.totalAmount = this.sumOutFor(payment.contact);
    payment.tag = this.tag;
    return payment;
  }

  async _deletePayments(paymentsToDelete: Payment[]) {
    for (const payment of paymentsToDelete) {
      if (!payment._model) continue;
      await payment._model.delete();
    }
  }

  _updateDelayedPayments() {
    if (!this.delayedDate || !this.payments) return;
    let savedToUpdate: Payment[] = [];
    let savedToDelete: Payment[] = [];
    let createdToDelete: Payment[] = [];
    let createdToUpdate: Payment[] = [];

    this.payments.forEach((payment) => {
      const isToDelete = this.contacts.some(
        (contact) => payment.contact?.recordID == contact.recordID,
      );
      const isSaved = !!!payment._model;
      if (isSaved) {
        if (isToDelete) savedToDelete.push(payment);
        else savedToUpdate.push(payment);
      } else {
        if (isToDelete) createdToDelete.push(payment);
        else createdToUpdate.push(payment);
      }
    });

    this._deletePayments(savedToDelete);

    const toUpdate = [...savedToUpdate, ...createdToUpdate];

    this.payments = toUpdate.map((payment) =>
      this._updatedDelayedPayment(payment),
    );
  }

  _generateDelayedPayments() {
    if (!this.delayedDate) return;
    this.payments = this.contacts.map(
      (contact) =>
        new Payment(
          this.project,
          {
            payment: {
              type: PaymentType.Income,
              date: this.delayedDate,
              title: `${Contact.displayedName(contact)} payment for ${
                this.title
              }`,
              done: false,
              project: this.project,
              contact: contact,
              totalAmount: this.sumOutFor(contact),
            },
          },
          this.tag,
        ),
    );
  }

  delay() {
    this._delayedDate = new Calendar();
    this.updateDelayedPayments();
  }

  undelay() {
    this.delayedDate = undefined;
  }

  sumOutFor(contact: IContact): number {
    return (
      this.articles.reduce((acc, next) => acc + next.priceOutFor(contact), 0) +
      this.services.reduce((acc, next) => acc + next.priceOutFor(contact), 0)
    );
  }
  addContact(contact: IContact, selected: boolean = false) {
    this.contacts.push(contact);
    this.articles.forEach((article) =>
      article.addOutContact(contact, selected),
    );
    this.updateDelayedPayments();
  }

  removeContact(contact: IContact) {
    this.contacts = this.contacts.filter(
      (existing) => existing.recordID != contact.recordID,
    );
    this.contactsToDelete.push(contact);
    this.articles.forEach((article) => article.removeOutContact(contact));

    this.articles = this.articles.filter(
      (article) => article.outcoming.length > 0,
    );

    this.updateDelayedPayments();
  }

  async _loadContacts() {
    if (!this._model) return;

    try {
      const contactModels = await this._model.contacts.fetch(); // as ContactModel[];

      for (const contactModel of contactModels) {
        const contact = new Contact(contactModel.recordID);
        await contact.load();
        this.contacts.push(contact);
      }
    } catch (error) {
      if (error) this._totalAmount = 666;
    }
  }

  async _loadServices() {
    if (!this._model) return;
    const serviceExes = (await this._model.services.fetch()) as ServiceExecutionModel[];

    for (const serviceExe of serviceExes) {
      this.services.push(await ServiceExecution.getLoadedService(serviceExe));
    }
  }

  async _loadArticles() {
    if (!this._model) return;

    const articleOutModels = (await this._model.articles.fetch()) as ArticleOutModel[];

    for (const articleOutModel of articleOutModels) {
      const articleModel = (await articleOutModel.article.fetch()) as ArticleModel;
      const article =
        this.articles.find((art) => art.uuid == articleModel.uuid) ??
        new Article({model: articleModel});

      const sourceModel = (await articleOutModel.source.fetch()) as ArticleInModel;
      const source = new ArticleIn(article, {model: sourceModel});

      const articleOut = new ArticleOut(
        article,
        {model: articleOutModel},
        source,
      );
      const i = this.articles.findIndex((art) => art.uuid == articleModel.uuid);
      if (i >= 0) {
        this.articles[i].outcoming.push(articleOut);
      } else {
        article.outcoming.push(articleOut);
        this.articles.push(article);
      }
    }
  }

  isValid() {
    return (
      super.isValid() &&
      this.contacts.length > 0 &&
      (this.articles.length > 0 || this.services.length > 0)
    );
  }

  async load() {
    if (!this._model) return;
    await super.load();
    await this._loadContacts();
    await this._loadArticles();
    await this._loadServices();
    await this._loadPayments();
  }

  async _loadPayments() {
    const paymentModels = await this._model?.payments.fetch();
    if (paymentModels.length > 0 && this.payments != []) {
      this.payments = [];
    }
    for (const paymentModel of paymentModels) {
      const payment = new Payment(this.project, {model: paymentModel});
      await payment.load();
      this.payments.push(payment);
    }
  }

  async loadStorage() {
    for (const article of this.articles) {
      await article.loadStorage();
    }
  }

  async save() {
    if (!this.isValid()) return;
    if (this.totalAmount == 0) this.totalAmount = this.sum;
    if (this._model) await this._update();
    else await this._save();
  }

  fillWatermelon(entry: SaleModel): SaleModel {
    entry = super.fillWatermelon(entry) as SaleModel;
    entry.delayedDate = this._delayedDate?.dateString;
    return entry;
  }

  async updateLinks() {
    let previous: EntryModels | undefined = await Entry.lastOn(
      this.date.dateString,
    );
    if (previous) {
      await Entry.updateEntryLink(previous, previous.previous, this.uuid);
    }
  }

  async saveDelayedPayments() {
    this.updateDelayedPayments();
    for (const payment of this.payments ?? []) {
      await payment.save();
    }
  }

  async saveContacts() {
    if (!this._model) return;
    for (const contact of this.contacts) {
      const contactModel = await Contact.getModelByRecordID(contact.recordID);
      const exists = await database.collections
        .get('contact_sale')
        .query(
          Q.where('sale_id', this._model.id),
          Q.where('contact_id', contactModel.id),
        )
        .fetch();
      const copy = exists as Model[];
      if (copy.length > 0) continue;
      const model = await database.action(async () => {
        return await database.collections
          .get('contact_sale')
          .create((entry: ContactSalesModel) => {
            entry.saleId = this._model?.id;
            entry.contactId = contactModel.id;
          });
      });
    }

    for (const contact of this.contactsToDelete) {
      const contactModel = await Contact.getModelByRecordID(contact.recordID);
      const exists = await database.collections
        .get('contact_sale')
        .query(
          Q.where('sale_id', this._model.id),
          Q.where('contact_id', contactModel.id),
        )
        .fetch();
      const copy = exists as Model[];
      if (copy.length != 1) continue;
      await database.action(async () => {
        await copy[0].destroyPermanently();
      });
    }
  }

  async saveArticles() {
    this.articles.forEach((article) => article.setSale(this));

    for (const article of this.articles) {
      await article.save();
    }

    for (const article of this.articlesToDelete) {
      await article.delete();
    }
  }

  async saveServices() {
    this.services.forEach((service) => service.setSale(this));

    for (const service of this.services) {
      await service.save();
    }
    for (const service of this.servicesToDelete) {
      await service.delete();
    }
  }

  async _update() {
    this._model = await database.action(async () => {
      return await this._model?.update((entry: SaleModel) => {
        entry = this.fillWatermelon(entry);
      });
    });

    await this.saveDelayedPayments();

    await this.saveContacts();

    await this.saveArticles();
    await this.saveServices();
  }

  async _save() {
    await this.updateLinks();

    this._model = await database.action(async () => {
      return await Sale.collection.create((entry: SaleModel) => {
        entry = this.fillWatermelon(entry);
      });
    });

    await this.saveDelayedPayments();

    await this.saveContacts();

    await this.saveArticles();
    await this.saveServices();
  }

  // WARNING: potentioally cycled Service
  remove(item: Article | Service) {
    if (item instanceof Article) {
      this.articlesToDelete.push(...item.outcoming);
      this.articles = this.articles.filter(
        (article) => article.uuid != item.uuid,
      );
    } else if (item instanceof Service) {
      this.servicesToDelete.push(...item.outcoming);
      this.services = this.services.filter(
        (service) => service.uuid != item.uuid,
      );
    }
  }

  async delete(): Promise<void> {
    await this.load();
    for (const article of this.articles) {
      this.remove(article);
    }
    for (const service of this.services) {
      this.remove(service);
    }
    await this.saveArticles();
    await this.saveServices();
    if (this.payments)
      for (const payment of this.payments) {
        await payment.delete(true);
      }

    await super.delete();
  }
}
