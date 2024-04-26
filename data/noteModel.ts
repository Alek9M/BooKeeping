import {Collection, Model, Q} from '@nozbe/watermelondb';
import {children, field, nochange, relation, text} from '@nozbe/watermelondb/decorators';
import { ContactModel } from './contactModel';
import EntryModel from './entryModel';

export default class NoteModel extends EntryModel {
  static table = 'notes';

  @text('note') note: string;
  @relation('contacts', 'contact_id') contact: ContactModel;
  @relation('projects', 'project_id') project;

  @children('noteListItems') noteListItems;

  static associations = {
    projects: {type: 'belongs_to', key: 'project_id'},
    contacts: { type: 'belongs_to', key: 'contact_id' },
    noteListItems: { type: 'has_many', foreignKey: 'item_id'}
  };
}
