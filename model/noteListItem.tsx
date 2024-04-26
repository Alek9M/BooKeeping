import {database} from '../data/database';
import NoteListItemModel from '../data/noteListItemModel';
import Modelable from './modelable';
import Note from './note';

export default class NoteListItem extends Modelable {
  item: string;
  isDone: boolean;
  note: Note;

  constructor(props: {model?: NoteListItemModel}, note: Note) {
    super(props);
    this.item = props.model?.item ?? '';
    this.isDone = props.model?.isDone ?? false;
    this.note = note;
  }

  get isValid(): boolean {
    return this.item.length > 0 && this.note.model != undefined;
  }

  async save() {
    if (!this.isValid) return;
    if (this._model) await this._update();
    else await this._save();
  }

  async _save() {
    await database.action(async () => {
      await database.collections
        .get('noteListItems')
        .create((item: NoteListItemModel) => {
          item.item = this.item;
          item.isDone = this.isDone;
          item.note.set(this.note.model);
          item.uuid = this.uuid;
        });
    });
  }

  async _update() {
    await database.action(async () => {
      await this.model?.update((item: NoteListItemModel) => {
        item.item = this.item;
        item.isDone = this.isDone;
        item.note.set(this.note.model);
      });
    });
  }

  delete(): void {
    throw new Error('Method not implemented.');
  }
}
