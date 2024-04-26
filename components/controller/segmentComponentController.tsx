interface SegmentComponent {
  title: string;
  component: JSX.Element;
}

export default class SegmentComponentController {
  private _values: SegmentComponent[];
  public get view() {
    return this._values[this.index].component;
  }
  private _titles: string[];
  get titles() {
    return this._titles;
  }

  private _index: number;
  public get index(): number {
    return this._index;
  }
  public set index(v: number) {
    if (v >= 0 && v < this._titles.length) {
      this._index = v;
    }
  }

  constructor(values: SegmentComponent[]) {
    if (values.length == 0) {
      throw new Error('Empty values array for segment');
    }
    this._values = values;
    this._titles = values.map((value) => value.title);
    this._index = 0;
  }
}
