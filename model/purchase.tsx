import Calendar from './calendar';

import 'react-native-get-random-values';
import BudgetTag from './budgetTag';
import Task, {ITask} from './task';
import Article, {ArticleIn, IArticleIn} from './article';
import Project from './project';
import {Model} from '@nozbe/watermelondb';
import IContact, {Contact} from './contact';
import PurchaseModel from '../data/purchaseModel';
import {database} from '../data/database';
import Entry, {EntryModels} from './entry';
import ArticleInModel from '../data/articleInModel';
import Payment, {PaymentType} from './payment';
import PaymentModel from '../data/paymentModel';
import ContactableTask from './contactableTask';

export interface IPurchase extends ITask {
  delayedDate?: Calendar;
  contact: IContact;
  items: IArticleIn[];
}

export default class Purchase extends ContactableTask {
  static collection = database.collections.get(PurchaseModel.table);
  static rusName = 'Покупка';
  // delayedDate?: Calendar;
  contact?: IContact;
  articles: Article[] = [];
  _tmpArticleIns: ArticleIn[] = [];
  payment?: Payment;
  _tmpPayment?: Payment;
  _model?: PurchaseModel;

  articlesToDelete: ArticleIn[] = [];

  get totalAmount(): number {
    return this.payment?.totalAmount ?? this._totalAmount;
  }

  set totalAmount(v: number) {
    super.totalAmount = v;
  }

  get sum(): number {
    return this.articles.map((a) => a.sumIn).reduce((acc, cur) => acc + cur, 0);
  }

  get copy(): Purchase {
    var clone = super.copy as Purchase;
    clone.articles = this.articles.map((article) => article.copy as Article);
    clone.articles.forEach((art) => art.setPurchase(clone));
    clone.payment = this.payment?.copy as Payment;
    return clone;
  }

  get text(): string {
    return `${super.text}${this.totalAmount}\n${
      this.contact ? Contact.displayedName(this.contact) : ''
    }\n${
      this.payment ? `Отложенный платёж на ${this.payment.date.dateString}` : ''
    }\nПокупки:\n${this.articles
      .map(
        (art) =>
          `${art.title} ${art.incoming[0].quantity} * ${art.incoming[0].priceIn} = ${art.incoming[0].sum}`,
      )
      .join('\n')}`;
  }

  constructor(
    project: Project,
    props: {purchase?: IPurchase; model?: PurchaseModel},
    tag?: BudgetTag,
  ) {
    super(project, props, tag);
  }

  addArticle(article: Article) {
    if (article.incoming.length != 1) {
      throw new Error(
        'Adding multiple/none incoming articles at once isn`t allowed',
      );
    }
    const i = this.articles.findIndex(
      (existing) => existing.uuid == article.uuid,
    );
    if (i >= 0) {
      const incoming = article.incoming[0];
      const j = this.articles[i].incoming.findIndex(
        (existing) => existing.uuid == incoming.uuid,
      );
      if (j >= 0) {
        this.articles[i].incoming = this.articles[i].incoming.filter(
          (inc) => inc.uuid != incoming.uuid,
        );
      }
      this.articles[i].incoming.push(incoming);
    } else {
      this.articles.push(article);
    }
  }

  removeArticle(articleIn: ArticleIn) {
    this._tmpArticleIns.push(articleIn);
    this.articles.forEach(
      (article) =>
        (article.incoming = article.incoming.filter(
          (inc) => inc.uuid != articleIn.uuid,
        )),
    );
    this.articles = this.articles.filter(
      (article) => article.incoming.length > 0,
    );
  }

  isDelayed(): boolean {
    return Boolean(this.payment);
  }

  delay() {
    if (this._tmpPayment) {
      this.payment = this._tmpPayment;
      this._tmpPayment = undefined;
    } else {
      this.payment = new Payment(
        this.project,
        {
          payment: {
            type: PaymentType.Outcome,
            title: this.title + 'Payment',
            done: false,
            project: this.project,
            contact: this.contact,
          },
        },
        this.tag,
      );
    }
    // this.totalAmount = 0;
  }

  undelay() {
    super.totalAmount = this.payment?.totalAmount ?? 0;
    this._tmpPayment = this.payment;
    this.payment = undefined;
  }

  isValid() {
    return (
      super.isValid() &&
      this.articles.length > 0 &&
      this.articles.every((article) => article.incoming.length > 0)
    );
  }

  async load() {
    if (!this._model) return;

    const tagModel = await this._model.budgetTag.fetch();
    if (tagModel) this.tag = new BudgetTag({model: tagModel}, this.project);

    const paymentModel:
      | PaymentModel
      | undefined = await this._model.payment.fetch();
    if (paymentModel)
      this.payment = new Payment(
        new Project({model: await paymentModel.project}),
        {
          model: paymentModel,
        },
      );

    const articlesIn = await this._model.articles.fetch();

    for (const articleIn of articlesIn) {
      const articleModel = await articleIn.article.fetch();
      const article = new Article({model: articleModel});
      article.incoming.push(new ArticleIn(article, {model: articleIn}));
      this.articles.push(article);
    }
    await super.load();
  }

  async save() {
    if (!this.isValid) return;
    if (this.totalAmount == 0) this.totalAmount = this.sum;
    await this._savePayment();

    if (this._model) await this._update();
    else await this._save();

    await this._saveArticles();
    // await this.payment?.setPurchase(this);
  }

  async _savePayment() {
    await this._tmpPayment?.delete(true);
    if (!this.payment) return;
    if (this.payment._model) await this.payment.load();
    this.payment.title = 'Payment for purchase ' + this.title;
    this.payment.totalAmount = this._totalAmount;
    this.payment.contact = this.contact;
    this.payment.tag = this.tag;
    await this.payment.save();
  }

  async _saveArticles() {
    this.articles.forEach((article) => article.setPurchase(this));

    for (const article of this.articles) {
      await article.save();
    }
    for (const article of this.articlesToDelete) {
      await article.delete();
    }
  }

  async _update() {
    const contactModel = await this.getContactModel();

    await database.action(async () => {
      return await this._model?.update((entry: PurchaseModel) => {
        entry = super.fillWatermelon(entry) as PurchaseModel;
        entry.contact.set(contactModel);
        entry.payment.set(this.payment?.model);
      });
    });
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
      return await Purchase.collection.create((entry: PurchaseModel) => {
        entry = super.fillWatermelon(entry) as PurchaseModel;
        entry.contact.set(contactModel);
        if (previous) {
          entry.previous = previous.uuid;
        }
        entry.payment.set(this.payment?.model);
      });
    });
  }

  remove(item: Article) {
    this.articlesToDelete.push(...item.incoming);
    this.articles = this.articles.filter(
      (article) => article.uuid != item.uuid,
    );
  }

  async delete(): Promise<void> {
    await this.load();
    for (const article of this.articles) {
      this.remove(article);
    }
    await this._saveArticles();
    this.undelay();
    await this._savePayment();
    await super.delete();
  }
}
