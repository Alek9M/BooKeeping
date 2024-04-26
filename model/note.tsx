import {Model, Q} from '@nozbe/watermelondb';
import {ContactModel} from '../data/contactModel';
import {database} from '../data/database';
// import NoteListItemModel from '../data/noteListItemModel';
import NoteModel from '../data/noteModel';
import {ICalendar} from './calendar';
import IContact, {Contact} from './contact';
import Entry, {EntryModels, IEntry} from './entry';
import NoteListItem from './noteListItem';
import Payment from './payment';
import Project from './project';

export interface INote extends IEntry {
  note: string;
  date?: ICalendar;
  project?: Project;
  contact?: IContact;
}

export default class Note extends Entry implements INote {
  static collection = database.collections.get(NoteModel.table);
  static rusName = 'Заметка';
  note: string;
  project?: Project = undefined;
  _model?: NoteModel;
  contact?: IContact;
  items: NoteListItem[] = [];

  constructor(props: {note?: INote; model?: NoteModel}, project?: Project) {
    super({entry: props.note, model: props.model});
    this.note = props.note?.note ?? props.model?.note ?? '';
    this.project = project;
    this.contact = props.note?.contact;
  }

  get text(): string {
    return `${super.text}${this.note}`;
  }

  addItem() {
    if (this.items.some((item) => item.item.length == 0)) return;
    let item = new NoteListItem({}, this);
    this.items.push(item);
  }

  cleanItems() {
    this.items = this.items.filter((item) => item.item.length > 0);
  }

  async load() {
    if (!this._model) return;
    const project = await this._model.project.fetch();
    if (project) this.project = Project.demodel(project);
    await this.loadContact();
    let its = await (this._model as NoteModel).noteListItems.fetch();
    this.items = [];
    for (const it of its) {
      this.items.push(new NoteListItem({model: it}, this));
    }
  }

  async loadContact() {
    if (!this.contact && this._model) {
      const contactModel = await this._model.contact.fetch();
      if (contactModel) {
        this.contact = new Contact(contactModel.recordID);
      }
    }
    if (this.contact && this.contact instanceof Contact)
      await this.contact.load();
  }

  async getContactModel(): Promise<ContactModel | undefined> {
    let contactModel: ContactModel | undefined;

    if (this.contact) {
      const contactsTable = database.collections.get('contacts');
      contactModel = (
        await contactsTable
          .query(Q.where('record_id', this.contact?.recordID))
          .fetch()
      )[0] as ContactModel;
      if (!contactModel) {
        contactModel = await database.action(async () => {
          return await contactsTable.create((contact: ContactModel) => {
            contact.familyName = this.contact!.familyName;
            contact.givenName = this.contact!.givenName;
            contact.recordID = this.contact!.recordID;
          });
        });
      }
    } else {
      return undefined;
      throw new Error('there is no contact in task');
    }

    return contactModel!;
  }

  async save() {
    if (!this.isValid()) return;
    if (this._model) await this._update();
    else await this._save();
    await this._saveItems();
  }

  async _save() {
    let previous: EntryModels | undefined = await Entry.lastOn(
      this.date.dateString,
    );
    if (previous)
      await Entry.updateEntryLink(previous, previous.previous, this.uuid);

    const contactModel = await this.getContactModel();

    this._model = await database.action(async () => {
      return await Note.collection.create((entry: NoteModel) => {
        entry = super.fillWatermelon(entry) as NoteModel;
        entry.note = this.note;
        entry.contact.set(contactModel);
        entry.project.set(this.project?.model);
        if (previous) {
          entry.previous = previous.uuid;
        }
      });
    });
  }

  async _saveItems() {
    for (const item of this.items) {
      item.note = this;
      await item.save();
    }
  }

  async _update() {
    const contactModel = await this.getContactModel();
    await database.action(async () => {
      await this.model?.update((entry: NoteModel) => {
        entry = super.fillWatermelon(entry);
        entry.contact.set(contactModel);
        entry.note = this.note;
        entry.project.set(this.project?.model);
      });
    });
  }
}
