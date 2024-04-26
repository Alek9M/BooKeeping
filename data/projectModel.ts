import {Model} from '@nozbe/watermelondb';
import {
  field,
  readonly,
  date,
  nochange,
  children,
  action,
} from '@nozbe/watermelondb/decorators';

export default class ProjectModel extends Model {
  static table = 'projects';

  @field('name') name: string;
  @field('type') type: number;
  @field('color') color: string;
  @field('terminated') terminated: boolean;
  @nochange @field('uuid') uuid: string;

  @children('notes') notes;
  @children('payments') payments;
  @children('purchases') purchases;
  @children('sales') sales;
  @children('budgetTags') budgetTags;
  @children('services') services;

  static associations = {
    notes: {type: 'has_many', foreignKey: 'project_id'},
    payments: {type: 'has_many', foreignKey: 'project_id'},
    purchases: {type: 'has_many', foreignKey: 'project_id'},
    sales: {type: 'has_many', foreignKey: 'project_id'},
    budgetTags: {type: 'has_many', foreignKey: 'project_id'},
    services: {type: 'has_many', foreignKey: 'project_id'},
  };

  @action async setColor(color: string) {
    await this.update((record) => {
      record.color = color;
    });
  }

  @action async setName(name: string) {
    await this.update((record) => {
      record.name = name;
    });
  }

  @action async terminate() {
    await this.update((record) => {
      record.terminated = !this.terminated;
    });
  }

  @action async delete() {
    // for (const model of [
    //   this.notes,
    //   this.payments,
    //   this.purchases,
    //   this.sales,
    // ]) {
    //   const collection = await model.fetch();
    //   for (const item of collection) {
    //     await this.subAction(async () => await item.delete?.());
    //   }
    // }
    // for (const model of [
    //   this.budgetTags,
    //   this.services
    // ]) {
    //   const collection = await model.fetch();
    //   for (const item of collection) {
    //     await this.subAction(async () => await item.delete?.());
    //   }
    // }
    // TODO: destroy everything else too
    await this.destroyPermanently();
  }
}
