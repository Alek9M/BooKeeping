import {Model, Q} from '@nozbe/watermelondb';
import {
  field,
  readonly,
  date,
  nochange,
  relation,
  children,
  action,
} from '@nozbe/watermelondb/decorators';
import ArticleModel from './articleModel';
import ArticleOutModel from './articleOutModel';
import {database} from './database';
import PurchaseModel from './purchaseModel';

export default class ArticleInModel extends Model {
  static table = 'articleIns';

  @field('quantity') quantity: number;
  @field('priceIn') priceIn: number;
  @field('suggestedPriceOut') suggestedPriceOut?: number;
  @nochange @field('uuid') uuid: string;
  @readonly @date('created_at') createdAt: Date;

  @relation('articles', 'article_id') article;
  @relation('purchases', 'purchase_id') purchases;
  @children('articleOuts') atricleOuts;

  get profit(): number | undefined {
    if (this.suggestedPriceOut) {
      return this.suggestedPriceOut - this.priceIn;
    } else {
      return undefined;
    }
  }

  async left(): Promise<number> {
    const outs = (await this.atricleOuts.fetch()) as ArticleOutModel[];
    const out = outs.reduce((acc, next) => (acc += next.quantity), 0);
    return this.quantity - out;
  }

  async leftATM(): Promise<number> {
    const outs = (await this.atricleOuts.fetch()) as ArticleOutModel[];
    var outsATM = [] as ArticleOutModel[];
    for (const out of outs) {
      const sale = await out.sale.fetch();
      if (!sale.isDone) continue;
      outsATM.push(out);
    }
    const out = outsATM.reduce((acc, next) => (acc += next.quantity), 0);
    return this.quantity - out;
  }

  static getDoneFor(article: ArticleModel) {
    return database.collections
      .get('articleIns')
      .query(
        Q.experimentalJoinTables(['purchases']),
        Q.and(
          Q.where('article_id', article.id),
          Q.on('purchases', 'is_done', true),
        ),
      )
      .observe();
  }

  @action async delete() {
    const outs: ArticleOutModel[] = this.atricleOuts.fetch();
    if (outs.length > 0)
      throw new Error('Trying to delete articleIn that already has been outed');
    this.subAction(async () => await this.article.delete());
    await this.destroyPermanently();
  }

  static associations = {
    articles: {type: 'belongs_to', key: 'article_id'},
    purchases: {type: 'belongs_to', key: 'purchase_id'},
    articleOuts: {type: 'has_many', foreignKey: 'articleIn_id'},
  };
}
