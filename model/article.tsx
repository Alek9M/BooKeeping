import {Model} from '@nozbe/watermelondb';
import ArticleInModel from '../data/articleInModel';
import ArticleModel from '../data/articleModel';
import ArticleOutModel from '../data/articleOutModel';
import {database} from '../data/database';
import PurchaseModel from '../data/purchaseModel';
import SaleModel from '../data/saleModel';
import {BillableModelable} from './billableModelable';
import BudgetTag from './budgetTag';
import IContact, {Contact} from './contact';
import Modelable, {IModelable} from './modelable';
import Project from './project';
import Purchase from './purchase';
import Sale from './sale';

export interface IArticle extends IModelable {
  title: string;
  incoming: IArticleIn[];
  outcoming: IArticleOut[];
}

export default class Article extends Modelable implements IArticle {
  static collection = database.collections.get(ArticleModel.table);
  title: string;
  incoming: ArticleIn[] = [];
  outcoming: ArticleOut[] = [];
  private inStorage: ArticleIn[] = [];
  private outStorage: ArticleOut[] = [];
  _model?: ArticleModel;

  get sumOut(): number {
    return this.outcoming.reduce((acc, cur) => acc + cur.sum, 0);
  }

  get priceOut(): number {
    return this.outcoming[0].priceOut;
  }

  get quantityOut(): number {
    return this.outcoming.reduce((acc, cur) => acc + cur.quantity, 0);
  }

  get sumIn(): number {
    return this.incoming.reduce((acc, cur) => acc + cur.sum, 0);
  }

  get copy(): Article {
    // var clone = super.copy as Article
    var clone = Object.create(this) as Article;
    clone.incoming = this.incoming.map((inc) => inc.copy as ArticleIn);
    clone.outcoming = [];
    for (const oOut of this.outcoming) {
      var oOutQuantity = oOut.quantity;
      var oldestIn = this.oldestNonEmptyIn;
      while (oOutQuantity > 0 && oldestIn) {
        if (oOutQuantity <= oldestIn.left) {
          const out = new ArticleOut(this, {articleOut: oOut.copy}, oldestIn);
          clone.outcoming.push(out);
          oldestIn.outcomes.push(out);
          oOutQuantity = 0;
        } else {
          oOutQuantity -= oldestIn.left;
          const out = new ArticleOut(this, {articleOut: oOut.copy}, oldestIn);
          out.quantity = oldestIn.left;
          clone.outcoming.push(out);
          oldestIn.outcomes.push(out);
        }
        oldestIn = this.oldestNonEmptyIn;
      }
    }
    return clone;
  }

  get oldestNonEmptyIn(): ArticleIn {
    return this.inStorage
      .filter((inc) => inc.left > 0)
      .sort((a, b) =>
        a.createdAt && b.createdAt
          ? a.createdAt!.valueOf() - b.createdAt!.valueOf()
          : 0,
      )[0];
  }

  constructor(props: {article?: IArticle; model?: ArticleModel}) {
    super(props);
    this.title = props.article?.title ?? props.model?.title ?? '';
  }

  priceOutFor(contact: IContact): number {
    return this.outcoming
      .map((out) => out.priceFor(contact))
      .reduce((acc, next) => acc + next, 0);
  }

  quantityOutFor(contact: IContact): number {
    return this.outcoming
      .map((out) => out.quantityFor(contact))
      .reduce((acc, next) => acc + next, 0);
  }

  sumOutFor(contact: IContact): number {
    return this.priceOutFor(contact) * this.quantityOutFor(contact);
  }

  isSoldTo(contact: IContact) {
    return this.outcoming.some(
      (out) =>
        out.everyone ||
        out.contacts.some((client) => contact.recordID == client.recordID),
    );
  }

  removeOutContact(contact: IContact) {
    this.outcoming.forEach((out) => out.removeContact(contact));
  }

  addOutContact(contact: IContact, selected: boolean = false) {
    this.outcoming.forEach((out) => out.addContact(contact, selected));
  }

  async save() {
    if (this._model) {
      await this._update();
    } else {
      await this._save();
    }

    if (this.incoming.some((inc) => !!inc.purchase)) {
      this.incoming.forEach((inc) => (inc.article = this));
      for (const inc of this.incoming) {
        await inc.save();
      }
    }

    if (this.outcoming.some((out) => !!out.sale)) {
      this.outcoming.forEach((out) => (out.article = this));

      for (const out of this.outcoming) {
        await out.save();
      }
    }
  }

  async load() {
    if (this._model) {
      const inc = await this._model.ins.fetch();
      // const out = await
      for (const articleIn of inc) {
        const newIn = new ArticleIn(this, {model: articleIn});
        await newIn.load();
        this.incoming.push(newIn);
      }

      this.incoming = this.incoming.sort(
        (a, b) => a._model!.createdAt - b._model!.createdAt,
      );
      // inc.forEach((articleIn: ArticleInModel) => {
      // });

      // return this;
    }
  }

  async loadStorage() {
    if (!this._model) return;
    this.inStorage = (await this._model.ins.fetch()).map(
      (inc) => new ArticleIn(this, {model: inc}),
    );
    for (const inc of this.inStorage) {
      await inc.load();
    }
    this.outStorage = (await this._model.outs.fetch()).map(
      (out) => new ArticleOut(this, {model: out}),
    );
  }

  setPurchase(purchase: Purchase) {
    this.incoming.forEach((inc) => (inc.purchase = purchase));
  }

  setSale(sale: Sale) {
    this.outcoming.forEach((out) => (out.sale = sale));
  }

  async _save() {
    this._model = await database.action(async () => {
      return await Article.collection.create((entry: ArticleModel) => {
        super.fillWatermelon(entry);
        entry.title = this.title;
      });
    });
  }

  async _update() {
    await database.action(async () => {
      return this._model?.update((entry: ArticleModel) => {
        super.fillWatermelon(entry);
        entry.title = this.title;
      });
    });
  }

  static observe() {
    return this.collection.query();
  }
}

export interface IArticleIn extends IModelable {
  article: IArticle;
  createdAt?: Date;
  quantity: number;
  priceIn: number;
  suggestedPriceOut?: number;
  outcomes: IArticleOut[];
}

export class ArticleIn extends Modelable implements IArticleIn {
  static collection = database.collections.get(ArticleInModel.table);
  article: Article;
  createdAt?: Date;
  quantity: number;
  priceIn: number;
  suggestedPriceOut?: number;
  outcomes: ArticleOut[] = [];
  purchase?: Purchase;
  get sum(): number {
    return this.priceIn * this.quantity;
  }

  get profit(): number | undefined {
    if (this.suggestedPriceOut) {
      return this.suggestedPriceOut - this.priceIn;
    } else {
      return undefined;
    }
  }

  get left(): number {
    return !this.purchase?.done
      ? 0
      : this.quantity -
          this.outcomes.reduce(
            // (acc, next) => (acc += next.sale?.done ? next.quantity : 0),
            (acc, next) => (acc += next.quantity),
            0,
          );
  }

  get copy(): ArticleIn {
    var clone = super.copy as ArticleIn;
    clone.outcomes = [];
    return clone;
  }

  constructor(
    article: Article,
    props: {articleIn?: IArticleIn; model?: ArticleInModel},
  ) {
    super(props);
    this.article = article;
    this.quantity = props.articleIn?.quantity ?? props.model?.quantity ?? 0;
    this.priceIn = props.articleIn?.priceIn ?? props.model?.priceIn ?? 0;
    this.suggestedPriceOut =
      props.articleIn?.suggestedPriceOut ?? props.model?.suggestedPriceOut;
  }

  async save() {
    if (this._model) {
      await this._update();
    } else {
      await this._save();
    }
  }

  async load() {
    if (!this._model) return;
    const purchaseModel = (await (this
      ._model as ArticleInModel).purchases.fetch()) as PurchaseModel;
    const projectModel = await purchaseModel.project.fetch();
    const tagModel = await purchaseModel.budgetTag.fetch();
    const project = new Project({model: projectModel});
    this.purchase = new Purchase(
      project,
      {model: purchaseModel},
      new BudgetTag({model: tagModel}, project),
    );

    const spending = (await this._model.atricleOuts.fetch()) as ArticleOutModel[];
    for (const spent of spending) {
      const out = new ArticleOut(this.article, {model: spent}, this);
      await out.load();
      this.outcomes.push(out);
    }
  }

  async _update() {
    await database.action(async () => {
      await this._model?.update((entry: ArticleInModel) => {
        entry.quantity = this.quantity;
        entry.priceIn = this.priceIn;
        entry.suggestedPriceOut = this.suggestedPriceOut;
        entry.article.set(this.article.model);
        entry.purchases.set(this.purchase?.model);
      });
    });
  }

  async _save() {
    this._model = await database.action(async () => {
      await ArticleIn.collection.create((entry: ArticleInModel) => {
        entry.quantity = this.quantity;
        entry.priceIn = this.priceIn;
        entry.suggestedPriceOut = this.suggestedPriceOut;
        entry.article.set(this.article.model);
        entry.purchases.set(this.purchase?.model);
      });
    });
  }

  async delete() {
    const model = this.model;
    if (model == undefined) return;
    await database.action(async () => {
      await this.model?.destroyPermanently();
    });
    // TODO: delete the whole article if empty
  }
}

export interface IArticleOut extends IModelable {
  createdAt?: Date;
  quantity: number;
  priceOut: number;
  discount: number;
  source?: IArticleIn;
  contacts: IContact[];
  // type: OutType;
}

export enum OutType {
  Everyone,
  EveryoneSplit,
  Selected,
  SelectedSplit,
}

export class Bill {
  contacts: IContact[];
  everyone = true;
  split = true;

  sum(price: number): number {
    if (!this.split) {
      return price * this.contacts.length;
    } else {
      return price;
    }
  }

  constructor(contacts: IContact[]) {
    this.contacts = contacts;
  }

  addContact(contact: IContact) {
    this.contacts.push(contact);
  }

  removeContact(contact: IContact) {
    this.contacts = this.contacts.filter(
      (con) => con.recordID != contact.recordID,
    );
  }

  updateContacts(allContacts: IContact[]) {
    let contacts: IContact[] = [];
    this.contacts.forEach((contact) => {
      if (
        allContacts.some((aContact) => aContact.recordID == contact.recordID)
      ) {
        contacts.push(contact);
      }
    });
    this.contacts = contacts;
  }

  each(out: ArticleOut): number {
    if (this.everyone) {
      return this.split ? out.finalPrice / out.contacts.length : out.finalPrice;
    } else {
      return this.split
        ? out.finalPrice / this.contacts.length
        : out.finalPrice;
    }
  }

  toMap(
    allContacts: IContact[],
    out: ArticleOut,
  ): {contact: IContact; sum: number}[] {
    if (this.everyone) {
      return allContacts.map((contact) => {
        return {
          contact: contact,
          sum: this.split ? out.sum / allContacts.length : out.sum,
        };
      });
    } else {
      return this.contacts.map((contact) => {
        return {
          contact: contact,
          sum: this.split ? out.sum / allContacts.length : out.sum,
        };
      });
    }
  }
}

export class ArticleOut extends BillableModelable implements IArticleOut {
  static collection = database.collections.get(ArticleOutModel.table);
  article: Article;
  createdAt?: Date;
  source?: ArticleIn;
  sale?: Sale;

  get copy(): ArticleOut {
    var clone = super.copy as ArticleOut;
    clone.source = undefined;
    return clone;
  }

  constructor(
    article: Article,
    props: {articleOut?: IArticleOut; model?: ArticleOutModel},
    source?: ArticleIn,
  ) {
    super(props);
    this.article = article;
    this.source = source;
    this.quantity = props.articleOut?.quantity ?? props.model?.quantity ?? 0;
    this.priceOut =
      props.articleOut?.priceOut ??
      props.model?.priceOut ??
      source?.suggestedPriceOut ??
      0;
    this.discount = props.articleOut?.discount ?? props.model?.discount ?? 0;
    this.contacts =
      props.articleOut?.contacts ??
      Contact.separate(props.model?.contact) ??
      [];
  }

  async load() {
    if (!this._model) return;
    const saleModel = (await (this
      ._model as ArticleOutModel).sale.fetch()) as SaleModel;
    const projectModel = await saleModel.project.fetch();
    const tagModel = await saleModel.budgetTag.fetch();
    const project = new Project({model: projectModel});
    this.sale = new Sale(
      project,
      {model: saleModel},
      new BudgetTag({model: tagModel}, project),
    );
  }

  async save() {
    if (this.model) {
      await this._update();
    } else {
      await this._save();
    }
  }

  async _update() {
    await database.action(async () => {
      if (!this._model) return;
      await this._model.update((entry: ArticleOutModel) => {
        entry = super.fillWatermelon(entry);
        entry.article.set(this.article.model);
        entry.source.set(this.source?.model);
        entry.sale.set(this.sale?.model);
      });
    });
  }

  async _save() {
    this._model = await database.action(async () => {
      await ArticleOut.collection.create((entry: ArticleOutModel) => {
        entry = super.fillWatermelon(entry);
        entry.article.set(this.article.model);
        entry.source.set(this.source?.model);
        entry.sale.set(this.sale?.model);
      });
    });
  }

  async delete() {
    const model = this.model;
    if (model == undefined) return;
    await database.action(async () => {
      await this.model?.destroyPermanently();
    });
    // TODO: delete the whole article if empty
  }
}
