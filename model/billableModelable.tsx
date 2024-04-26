import {Model} from '@nozbe/watermelondb';
import ArticleOutModel from '../data/articleOutModel';
import IContact, {Contact} from './contact';
import Modelable from './modelable';

export abstract class BillableModelable extends Modelable {
  contacts: IContact[] = [];
  everyone = true;
  _split = true;
  _quantity: number = 0;
  priceOut: number = 0;
  discount: number = 0;

  get split(): boolean {
    return this._split;
  }

  set split(v: boolean) {
    if (v == this._split) return;
    const _quantityBA = this._quantity;
    this._split = v;
    this.quantity = _quantityBA;
  }

  get sum(): number {
    return this.finalPrice * this.quantity;
  }

  get finalPrice(): number {
    return this.priceOut * (1 - this.discount / 100);
  }

  get pricePerPerson(): number {
    return this.sum / this.contacts.length;
  }

  get quantityPerPerson(): number {
    return this.split ? this.quantity : this.quantity / this.contacts.length;
  }

  get quantity(): number {
    return this._quantity;
  }

  set quantity(v: number) {
    this._quantity = this.split ? v : v * this.contacts.length;
  }

  fillWatermelon(entry: Model): Model {
    entry = super.fillWatermelon(entry);
    entry.everyone = this.everyone;
    entry.split = this.split;
    entry.quantity = this._quantity;
    entry.priceOut = this.priceOut;
    entry.discount = this.discount;
    entry.contact = Contact.join(this.contacts);
    return entry;
  }

  constructor(props: {model?: ArticleOutModel}) {
    super(props);
    if (props.model) {
      this.contacts = Contact.separate(props.model.contact);
      this.priceOut = props.model.priceOut;
      this.discount = props.model.discount;
      this.everyone = props.model.everyone;
      this.split = props.model.split;
      this._quantity = props.model.quantity;
      //   this.contacts = Contact.separate(props.model.contact);
      // TODO: type
    }
  }

  addContact(contact: IContact, selected: boolean = false) {
    if (this.everyone || selected) {
      this.contacts.push(contact);
    }
  }

  removeContact(contact: IContact) {
    this.contacts = this.contacts.filter(
      (client) => client.recordID != contact.recordID,
    );
  }

  priceFor(contact: IContact): number {
    return this.contacts.some((client) => client.recordID == contact.recordID)
      ? this.pricePerPerson
      : 0;
  }

  quantityFor(contact: IContact): number {
    return this.contacts.some((client) => client.recordID == contact.recordID)
      ? this.quantityPerPerson
      : 0;
  }
}
