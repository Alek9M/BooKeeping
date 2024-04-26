import {Collection, Model, Q} from '@nozbe/watermelondb';
import {field, nochange, relation, text} from '@nozbe/watermelondb/decorators';
import { ContactModel } from './contactModel';
import EntryModel from './entryModel';

export default class NoteListItemModel extends Model {
  static table = 'noteListItems';

  @text('item') item: string;
    @field('is_done') isDone: boolean;
    @nochange @field('uuid') uuid: string;
    @relation('notes', 'item_id') note;

  static associations = {
    notes: {type: 'belongs_to', key: 'item_id'},
  };
}
