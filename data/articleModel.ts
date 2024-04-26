import {Model, Q} from '@nozbe/watermelondb';
import {
  field,
  readonly,
  date,
  nochange,
  relation,
  children,
  text,
  lazy,
  action,
} from '@nozbe/watermelondb/decorators';
import ArticleInModel from './articleInModel';

export default class ArticleModel extends Model {
  static table = 'articles';

  @text('title') title: string;
  @nochange @field('uuid') uuid: string;

  @children('articleIns') ins;
  @children('articleOuts') outs;

  @lazy insDone = this.ins.extend(
    Q.experimentalJoinTables(['purchases']),
    Q.on('purchases', 'is_done', true),
  );

  @lazy outsWOsource = this.outs.extend(Q.where('articleIn_id', null));

  @action async delete() {
    if (
      (await this.ins.fetch()).length == 0 &&
      (await this.outs.fetch()).length == 0
    ) {
      await this.destroyPermanently();
    }
  }

  static associations = {
    articleIns: {type: 'has_many', foreignKey: 'article_id'},
    articleOuts: {type: 'has_many', foreignKey: 'article_id'},
  };
}
