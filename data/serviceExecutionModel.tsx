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
} from '@nozbe/watermelondb/decorators';

export default class ServiceExecutionModel extends Model {
  static table = 'serviceExecutions';

  @field('quantity') quantity: number;
  @field('discount') discount: number;
  @field('contact') contact: string;
  @field('everyone') everyone: boolean;
  @field('split') split: boolean;
  @readonly @date('created_at') createdAt: Date;
  @nochange @field('uuid') uuid: string;

  @relation('servicePrices', 'servicePrice_id') price;
  @relation('sales', 'sale_id') sale;

  @action async delete() {
    this.destroyPermanently();
  }

  static associations = {
    servicePrices: {type: 'belongs_to', key: 'servicePrice_id'},
    sales: {type: 'belongs_to', key: 'sale_id'},
  };
}
