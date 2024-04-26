import {Model, Q} from '@nozbe/watermelondb';
import {field, text, lazy, action} from '@nozbe/watermelondb/decorators';
import children from '@nozbe/watermelondb/decorators/children';

export class ContactModel extends Model {
  static table = 'contacts';

  @text('record_id') recordID: string;
  @field('family_name') familyName: string;
  @field('given_name') givenName: string;

  @children('payments') payments;
  @children('notes') notes;
  @children('purchases') purchases;
  @children('contact_sale') contact_sales;
  @children('contact_cards') cards;
  @lazy sales = this.collections
    .get('sales')
    .query(Q.on('contact_sale', 'contact_id', this.id));

  static associations = {
    contact_associations: {type: 'has_many', foreignKey: 'contact_id'},
    payments: {type: 'has_many', foreignKey: 'contact_id'},
    purchases: {type: 'has_many', foreignKey: 'contact_id'},
    contacts: {type: 'has_many', foreignKey: 'contact_id'},
    contact_sale: {type: 'has_many', foreignKey: 'contact_id'},
    contact_cards: {type: 'has_many', foreignKey: 'contact_id'},
    // articlesOut: {type: 'has_many', foreignKey: 'contact_id'},
  };
}

export class ContactSalesModel extends Model {
  static table = 'contact_sale';

  @field('contact_id') contactId;
  @field('sale_id') saleId;

  @action async delete() {
    await this.destroyPermanently();
  }

  static associations = {
    contacts: {type: 'belongs_to', key: 'contact_id'},
    sales: {type: 'belongs_to', key: 'sale_id'},
  };
}
