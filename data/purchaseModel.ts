import {Model} from '@nozbe/watermelondb';
import {
  field,
  readonly,
  date,
  nochange,
  relation,
  children,
} from '@nozbe/watermelondb/decorators';
import action from '@nozbe/watermelondb/decorators/action';
import ArticleInModel from './articleInModel';
import ArticleModel from './articleModel';
import ArticleOutModel from './articleOutModel';
import EntryModel from './entryModel';

type NotSoldOut = {inc: ArticleInModel; left: number};

export default class PurchaseModel extends EntryModel {
  static table = 'purchases';

  // @field('delayedDate') delayedDate: string;
  // @field('contact') contact: string;
  @field('amount') amount: number;

  @relation('projects', 'project_id') project;
  @relation('payments', 'payment_id') payment;
  @relation('budgetTags', 'budgetTag_id') budgetTag;
  @relation('contacts', 'contact_id') contact;

  @children('articleIns') articles;

  async _checkIfSold(repurpose?: boolean) {
    const ins = (await this.articles.fetch()) as ArticleInModel[];
    let toRepurpose: {
      to: NotSoldOut[];
      outs: ArticleOutModel[];
    }[] = [];
    for (const articleIn of ins) {
      const outs = (await articleIn.atricleOuts.fetch()) as ArticleOutModel[];
      const totalOut = outs.reduce((acc, next) => (acc += next.quantity), 0);
      if (totalOut <= 0) continue;
      const left = await this._getNotSoldOut(articleIn);
      const leftTotal = left.reduce((acc, next) => (acc += next.left), 0);
      if (leftTotal < totalOut)
        throw new Error("This batch has already been sold and can't be moved");
      toRepurpose.push({to: left, outs: outs});
    }
    if (repurpose) await this.subAction(async () => await this._repurpose(toRepurpose)); 
  }

  async _getNotSoldOut(inc: ArticleInModel): Promise<NotSoldOut[]> {
    const article = (await inc.article.fetch()) as ArticleModel;
    const otherIns = (await article.ins.fetch()) as ArticleInModel[];
    let otherInsLeft: NotSoldOut[] = [];
    for (const otherIn of otherIns) {
      const left = await otherIn.left();
      if (left <= 0) continue;
      otherInsLeft.push({inc: otherIn, left: left});
    }
    return otherInsLeft;
  }

  @action async _repurpose(
    toRepurpose: {
      to: NotSoldOut[];
      outs: ArticleOutModel[];
    }[],
  ) {
    for (const repurposee of toRepurpose) {
      for (const out of repurposee.outs) {
        let left = out.quantity;
        for (const to of repurposee.to) {
          if (left <= 0) break;
          let toMove = left > to.left ? to.left : left;
          left -= toMove;
          await this.collections
            .get('articleOuts')
            .create((record: ArticleOutModel) => {
              record.quantity = toMove;
              record.priceOut = out.priceOut;
              record.discount = out.discount;
              record.contact = out.contact;
              record.everyone = out.everyone;
              record.split = out.split;
              record.uuid = out.uuid;

              record.source.id = to.inc.id;
              record.article.id = out.article.id;
              record.sale.id = out.sale.id;
            });
        }
        await out.destroyPermanently();
      }
    }
  }

  @action async delete() {
    const ins: ArticleInModel[] = await this.articles.fetch();

    await this._checkIfSold(true);

    for (const articleIn of ins) {
      await this.subAction(async () => await articleIn.delete());
      
    }
    const payment = await this.payment.fetch();
    await this.subAction(async () => await payment?.delete(true));
    
    await super.delete();
  }

  static associations = {
    projects: {type: 'belongs_to', key: 'project_id'},
    budgetTags: {type: 'belongs_to', key: 'budgetTag_id'},
    contacts: {type: 'belongs_to', key: 'contact_id'},
    payments: {type: 'belongs_to', key: 'payment_id'},
    articleIns: {type: 'has_many', foreignKey: 'purchase_id'},
  };
}
