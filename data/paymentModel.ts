import {Model} from '@nozbe/watermelondb';
import {
  field,
  readonly,
  date,
  nochange,
  relation,
  action,
} from '@nozbe/watermelondb/decorators';
import children from '@nozbe/watermelondb/decorators/children';
import BudgetTagModel from './budgetTagModel';
import {ContactModel} from './contactModel';
import EntryModel from './entryModel';
import ProjectModel from './projectModel';
import PurchaseModel from './purchaseModel';
import SaleModel from './saleModel';

export default class PaymentModel extends EntryModel {
  static table = 'payments';

  @field('type') type: number;
  // @field('contact') contact: string;
  @field('amount') amount: number;

  @relation('projects', 'project_id') project: ProjectModel;
  @relation('sales', 'sale_id') sale: SaleModel;
  // @relation('purchases', 'payment_id') purchase;
  @relation('budgetTags', 'budgetTag_id') budgetTag: BudgetTagModel;
  @relation('contacts', 'contact_id') contact: ContactModel;

  @children('purchases') purchase: PurchaseModel[];

  @action async delete(force: boolean = false) {
    if (!force) {
      // const sale: SaleModel | undefined = await this.sale.fetch();
      const purchase: PurchaseModel[] = await this.purchase.fetch();
      // if (sale) throw new Error('Trying to delete delayed payment for sale');
      if (purchase.length > 1)
        throw new Error('Trying to delete delayed payment for purchase');
      await this.subAction(async () => {
        await purchase[0].update(async (record: PurchaseModel) => {
          record.payment.set(undefined)
          return record
        })
      })
    }

    await super.delete();
  }

  // async _forceDelete() {
  //   const sale: SaleModel | undefined = await this.sale.fetch();
  //   const purchase: PurchaseModel[] = await this.purchase.fetch();
  //   await sale?.delete()
  //   await purchase?.[0].delete()
  // }

  static associations = {
    projects: {type: 'belongs_to', key: 'project_id'},
    sales: {type: 'belongs_to', key: 'sale_id'},
    purchases: {type: 'has_many', foreignKey: 'payment_id'},
    budgetTags: {type: 'belongs_to', key: 'budgetTag_id'},
    contacts: {type: 'belongs_to', key: 'contact_id'},
  };
}
