import {Model, Q} from '@nozbe/watermelondb';
import {ContactModel} from '../data/contactModel';
import {database} from '../data/database';
//
import BudgetTag from './budgetTag';
import IContact, {Contact} from './contact';
import {IPayment} from './payment';
import Project from './project';
import {IPurchase} from './purchase';
import Task, {ITask} from './task';

export default abstract class ContactableTask extends Task {
  contact?: IContact;

  constructor(
    project: Project,
    props: {task?: IPayment | IPurchase; model?: Model},
    tag?: BudgetTag,
  ) {
    super(project, {task: props.task, model: props.model}, tag);
    this.contact = props.task?.contact;
  }

  async load() {
    if (!this.contact && this._model) {
      const contactModel = await this._model.contact.fetch();
      if (contactModel) {
        this.contact = new Contact(contactModel.recordID);
      }
    }
    if (this.contact && this.contact instanceof Contact)
      await this.contact.load();
  }

  isValid() {
    return super.isValid(); //&& !!this.contact;
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

  async delete(): Promise<void> {
    await super.delete();
  }
}
