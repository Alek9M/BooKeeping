import {Model, Q} from '@nozbe/watermelondb';
import {field, text, lazy, action} from '@nozbe/watermelondb/decorators';
import children from '@nozbe/watermelondb/decorators/children';
import relation from '@nozbe/watermelondb/decorators/relation';

export class ContactCardModel extends Model {
  static table = 'contact_cards';

  @text('bank') bank: string;
  @text('name') name: string;
  @text('number') number: string;

  @relation('contacts', 'contact_id') contact;

  static associations = {
    contacts: {type: 'belongs_to', key: 'contact_id'},
  };
}
