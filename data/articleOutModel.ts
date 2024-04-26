import {Model} from '@nozbe/watermelondb';
import {
  field,
  readonly,
  date,
  nochange,
  relation,
  lazy,
} from '@nozbe/watermelondb/decorators';
import action from '@nozbe/watermelondb/decorators/action';
import ArticleModel from './articleModel';
import PurchaseModel from './purchaseModel';

export default class ArticleOutModel extends Model {
  static table = 'articleOuts';

  @field('quantity') quantity: number;
  @field('priceOut') priceOut: number;
  @field('discount') discount: number;
  @field('contact') contact: string;
  @field('everyone') everyone: boolean;
  @field('split') split: boolean;
  @nochange @field('uuid') uuid: string;
  @readonly @date('created_at') createdAt;

  @relation('articleIns', 'articleIn_id') source;
  @relation('articles', 'article_id') article;
  @relation('sales', 'sale_id') sale;

  @action async delete() {
    await this.destroyPermanently();
  }

  static associations = {
    articleIns: {type: 'belongs_to', key: 'articleIn_id'},
    sales: {type: 'belongs_to', key: 'sale_id'},
    articles: {type: 'belongs_to', key: 'article_id'},
  };
}
