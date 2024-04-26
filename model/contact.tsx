import {Q} from '@nozbe/watermelondb';
import Contacts from 'react-native-contacts';
import {ContactModel} from '../data/contactModel';
import {database} from '../data/database';

interface EmailAddress {
  label: string;
  email: string;
}

interface PhoneNumber {
  label: string;
  number: string;
}

interface PostalAddress {
  label: string;
  formattedAddress: string;
  street: string;
  pobox: string;
  neighborhood: string;
  city: string;
  region: string;
  state: string;
  postCode: string;
  country: string;
}

interface Birthday {
  year: number;
  month: number;
  day: number;
}

export default interface IContact {
  recordID: string;
  company: string;
  emailAddresses: EmailAddress[];
  familyName: string;
  givenName: string;
  middleName: string;
  jobTitle: string;
  phoneNumbers: PhoneNumber[];
  postalAddresses: PostalAddress[];
  birthday: Birthday;
}

export interface Nameable {
  givenName: string;
  familyName: string;
}

export class Contact implements IContact {
  static collection = database.collections.get(ContactModel.table);
  static findByRecordIdQuery(recordID: string) {
    return this.collection.query(Q.where('record_id', recordID));
  }

  static async getModelByRecordID(recordID: string): Promise<ContactModel> {
    const models = await this.findByRecordIdQuery(recordID).fetch();
    if (models.length > 1) throw new Error('Contacts db corruption');
    if (models.length == 1) return models[0] as ContactModel;
    const contact = await Contacts.getContactById(recordID);
    const model = await database.action(async () => {
      return await this.collection.create((entry: ContactModel) => {
        entry.recordID = recordID;
        entry.givenName = contact.givenName;
        entry.familyName = contact.familyName;
      });
    });
    return model as ContactModel;
  }

  static displayedName(contact: Nameable | IContact): string {
    if (!contact.givenName.length && !contact.familyName.length)
      return 'No name';
    if (!contact.givenName.length) return contact.familyName;
    if (!contact.familyName.length) return contact.givenName;

    const fullName = `${contact.givenName} ${contact.familyName}`;
    if (fullName.length) return fullName;

    if (contact?.company?.length) return contact.company;

    return 'Unknown';
  }

  recordID: string;
  company: string = '';
  emailAddresses: EmailAddress[] = [];
  familyName: string = '404';
  givenName: string = '404';
  middleName: string = '';
  jobTitle: string = '';
  phoneNumbers: PhoneNumber[] = [];
  postalAddresses: PostalAddress[] = [];
  birthday: Birthday = {year: 0, month: 0, day: 0};

  constructor(id: string, contact?: IContact) {
    this.recordID = id;
    if (contact) {
      this.refill(contact);
    } else {
      Contacts.getContactById(id).then((contact: IContact) => {
        this.refill(contact);
      });
    }
  }

  async load() {
    const iCon = await Contacts.getContactById(this.recordID);
    if (iCon) {
      this.refill(iCon);
    }
  }

  private static splitter = ' ';

  static join(contacts: IContact[]): string {
    return contacts.map((contact) => contact.recordID).join(this.splitter);
  }
  static separate(contacts?: string): IContact[] {
    return (
      contacts?.split(this.splitter).map((recordID) => new Contact(recordID)) ??
      []
    );
  }

  private refill(contact: IContact) {
    this.company = contact.company;
    this.emailAddresses = contact.emailAddresses;
    this.givenName = contact.givenName;
    this.familyName = contact.familyName;
    this.middleName = contact.middleName;
    this.jobTitle = contact.jobTitle;
    this.phoneNumbers = contact.phoneNumbers;
    this.postalAddresses = contact.postalAddresses;
    this.birthday = contact.birthday;
  }
}
