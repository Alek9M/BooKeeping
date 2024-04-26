import {Model, Q} from '@nozbe/watermelondb';
import {
  field,
  readonly,
  date,
  nochange,
  relation,
  children,
  lazy,
  action,
} from '@nozbe/watermelondb/decorators';
import Identifiable from '../model/identifiable';
import ArticleInModel from './articleInModel';
import ArticleOutModel from './articleOutModel';
import {ContactSalesModel} from './contactModel';
import {database} from './database';
import EntryModel from './entryModel';
import PaymentModel from './paymentModel';

export default class SaleModel extends EntryModel {
  static table = 'sales';

  // @field('delayedDate') delayedDate: string;
  // @field('contact') contact: string;
  @lazy contacts = database.collections
    .get('contacts')
    .query(
      Q.experimentalJoinTables(['contact_sale']),
      Q.on('contact_sale', 'sale_id', this.id),
    );
  @field('amount') amount: number;

  @relation('projects', 'project_id') project;
  // @relation('payments', 'payment_id') payment;
  @relation('budgetTags', 'budgetTag_id') budgetTag;

  @children('articleOuts') articles;
  @children('serviceExecutions') services;
  @children('payments') payments;

  @action async delete() {
    const contactLinks: ContactSalesModel[] = await this.collections
      .get('contact_sale')
      .query(Q.where('sale_id', this.id))
      .fetch();
    const payments: PaymentModel[] = await this.payments.fetch();
    const outs: ArticleOutModel[] = await this.articles.fetch();

    for (const link of contactLinks) {
      await this.subAction(async () => await link.delete());
      
    }
    for (const payment of payments) {
      await this.subAction(async () => await payment.delete(true));
      
    }

    for (const out of outs) {
      await this.subAction(async () => await out.delete());
      
    }

    await super.delete();
  }

  // @action async setDone(done: boolean) {
  //   const outs = (await this.articles.fetch()) as ArticleOutModel[];
  //   if (done) {
  //     for (const out of outs) {
  //       const source = (await out.source.fetch()) as ArticleInModel;
  //       const left = await source.leftATM();
  //       if (left >= out.quantity) continue;
  //       const article = await out.article.fetch();
  //       const inss = ((await article.ins.fetch()) as ArticleInModel[]).sort(
  //         (a, b) => b.createdAt.valueOf() - a.createdAt.valueOf(),
  //       );
  //       var outQ = out.quantity;
  //       for (const ins of inss) {
  //         if (outQ <= 0) break;
  //         const leftLookUp = await ins.leftATM();
  //         if (leftLookUp <= 0) continue;

  //         await this.subAction(async () => {
  //           await this.collections
  //             .get('articleOuts')
  //             .create((record: ArticleOutModel) => {
  //               record.quantity = leftLookUp >= outQ ? outQ : leftLookUp;
  //               record.priceOut = out.priceOut;
  //               record.discount = out.discount;
  //               record.contact = out.contact;
  //               record.everyone = out.everyone;
  //               record.split = out.split;
  //               record.uuid = Identifiable.randomUUID;
  //               record.source.id = ins.id;
  //               record.article.id = out.article.id;
  //               record.sale.id = out.sale.id;
  //             });
  //         });
  //         outQ -= leftLookUp;
  //       }
  //       await this.subAction(async () => await out.delete());
  //     }
  //   }

  //   await this.subAction(async () => await super.setDone(done));
  // }

  static associations = {
    projects: {type: 'belongs_to', key: 'project_id'},
    budgetTags: {type: 'belongs_to', key: 'budgetTag_id'},
    payments: {type: 'has_many', foreignKey: 'sale_id'},
    articleOuts: {type: 'has_many', foreignKey: 'sale_id'},
    contact_sale: {type: 'has_many', foreignKey: 'sale_id'},
    serviceExecutions: {type: 'has_many', foreignKey: 'sale_id'},
  };
}
