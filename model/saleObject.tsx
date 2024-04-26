import IContact from './contact';

import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

export default class SaleObject {
  title: string = '';
  sellingPrice: number = 0;
  quantity: number = 0;
  discount: number = 0;
  buyer: Buyer = new Buyer();
  readonly uuid: string = uuidv4();

  getSum(): number {
    return this.sellingPrice * this.quantity * (this.discount / 100);
  }

  getSummary(contacts: IContact[]): {contact: IContact; sum: number}[] {
    this.buyer.contacts = this.buyer.contacts.filter((contact) =>
      contacts.find((client) => client.recordID == contact.recordID),
    );

    const mapContactWithSum = (
      contacts: IContact[],
      sum: number,
    ): {contact: IContact; sum: number}[] => {
      return contacts.map((contact) => {
        let bill: {contact: IContact; sum: number} = {
          contact: contact,
          sum: sum,
        };
        return bill;
      });
    };

    const sum = this.getSum();
    switch (this.buyer.type) {
      case BuyerType.All:
        switch (this.buyer.split) {
          case SplitType.Each:
            return mapContactWithSum(contacts, sum);
          case SplitType.Split:
            let sumSplit = sum / contacts.length;
            return mapContactWithSum(contacts, sumSplit);
        }
      case BuyerType.Single:
        let bill: {contact: IContact; sum: number} = {
          contact: this.buyer.contacts[0],
          sum: sum,
        };
        return [bill];
      case BuyerType.Several:
        switch (this.buyer.split) {
          case SplitType.Each:
            return mapContactWithSum(this.buyer.contacts, sum);
          case SplitType.Split:
            let sumSplit = sum / this.buyer.contacts.length;
            return mapContactWithSum(this.buyer.contacts, sumSplit);
        }
    }
  }

  addContact(contact: IContact) {
    switch (this.buyer.type) {
      case BuyerType.All:
        this.buyer.type = BuyerType.Single;
        this.buyer.contacts = [contact];
        break;
      case BuyerType.Single:
        this.buyer.contacts.push(contact);
        if (this.buyer.contacts.length > 1) {
          this.buyer.type = BuyerType.Several;
        }
        break;
      case BuyerType.Several:
        this.buyer.contacts.push(contact);
        break;
    }
  }

  removeContact(contact: IContact) {
    if (this.buyer.contacts.includes(contact)) {
      switch (this.buyer.type) {
        case BuyerType.All:
          break;
        case BuyerType.Single:
          this.buyer.type = BuyerType.All;
          this.buyer.contacts = [];
          break;
        case BuyerType.Several:
          this.buyer.contacts = this.buyer.contacts.filter(
            (buyer) => buyer.recordID != contact.recordID,
          );
          if (this.buyer.contacts.length < 2)
            this.buyer.type = BuyerType.Single;
          break;
      }
    }
  }
}

class Buyer {
  type: BuyerType = BuyerType.All;
  split: SplitType = SplitType.Each;
  contacts: IContact[] = [];
}

export enum SplitType {
  Each,
  Split,
}

export enum BuyerType {
  All,
  Single,
  Several,
}
