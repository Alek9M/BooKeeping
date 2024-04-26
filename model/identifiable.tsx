import {Model} from '@nozbe/watermelondb';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

export interface IIdentifiable {
  uuid?: string;
}

export default abstract class Identifiable implements IIdentifiable {
  private _uuid: string;

  get uuid(): string {
    return this._uuid;
  }

  get copy(): Identifiable {
    var clone = Object.create(this);
    clone._uuid = uuidv4();
    return clone;
  }

  constructor(props: {identifiable?: IIdentifiable; uuid?: string}) {
    this._uuid = props.identifiable?.uuid ?? props.uuid ?? uuidv4();
  }

  static get randomUUID(): string {
    return uuidv4();
  }

  get randomUUID(): string {
    return uuidv4();
  }

  generateUUID() {
    this._uuid = uuidv4();
  }

  fillWatermelon(entry: Model): Model {
    if (!entry.uuid) entry.uuid = this.uuid;
    return entry;
  }

  equals(another: Identifiable): boolean {
    return this.uuid == another.uuid;
  }
}
