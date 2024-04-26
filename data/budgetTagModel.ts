import {Collection, Model, Q} from '@nozbe/watermelondb';
import {
  field,
  readonly,
  date,
  nochange,
  relation,
  action,
  text,
  children,
  lazy,
} from '@nozbe/watermelondb/decorators';
import { pipe } from 'rxjs';
import {database, EntrysModel} from './database';
import {findEntry} from './helpers';

export default class BudgetTagModel extends Model {
  static table = 'budgetTags';

  @text('title') title: string;
  @field('month') month: number;
  @field('year') year: number;
  @field('amount') amount: number;
  @field('type') type: number;
  @nochange @field('uuid') uuid: string;

  @relation('projects', 'project_id') project;

  @children('payments') payments;
  @children('purchases') purchases;
  @children('sales') sales;

  @lazy spentPayments = this.payments.extend(
      this.periodQuery,
      Q.where('is_done', true),
    )//.observe().reduce((sum, cur) => sum += cur.amount, 0)
  @lazy spentPurchases = this.purchases.extend(
      this.periodQuery,
      Q.where('is_done', true),
      Q.where('payment_id', null),
    )//.observe().reduce((sum, cur) => sum += cur.amount, 0)
  @lazy spentSales = this.sales.extend(
      this.periodQuery,
      Q.where('is_done', true),
      Q.on('payments', 'sale_id', Q.notEq(Q.column('id'))),
  )//.observe().reduce((sum, cur) => sum += cur.amount, 0)
    

  private get periodQuery(): Q.And {
    return Q.and(Q.where('year', this.year), Q.where('month', this.month));
  }

  static associations = {
    projects: {type: 'belongs_to', key: 'project_id'},
    payments: {type: 'has_many', foreignKey: 'budgetTag_id'},
    purchases: {type: 'has_many', foreignKey: 'budgetTag_id'},
    sales: {type: 'has_many', foreignKey: 'budgetTag_id'},
  };

  async load() {
    if (this.project.uuid == undefined) {
      await this.project.fetch();
    }
  }

  @action async delete() {
    for (const model of [this.payments, this.purchases, this.sales]) {
      const collection = await model.fetch();
      for (const item of collection) {
        await item.update((record) => record.budgetTag.set(undefined));
      }
    }

    await this.destroyPermanently();
  }
}
