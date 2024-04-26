import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

export interface PurchaseObjectInt {
  name: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice?: number;
}

export default class PurchaseObject {
  name: string = '';
  quantity: number = 0;
  buyingPrice: number = 0;
  sellingPrice?: number;
  readonly uuid: string = uuidv4();

  isCompleted(): boolean {
    return this.name.length > 0 && this.quantity > 0 && this.buyingPrice > 0;
  }

  sum(): number {
    return this.buyingPrice * this.quantity;
  }

  equals(another: PurchaseObject): boolean {
    return this.uuid == another.uuid;
  }
}
