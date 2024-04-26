import BudgetTagModel from '../data/budgetTagModel';
import {saveProject, updateProject} from '../data/helpers';
import NoteModel from '../data/noteModel';
import PaymentModel from '../data/paymentModel';
import ProjectModel from '../data/projectModel';
import PurchaseModel from '../data/purchaseModel';
import SaleModel from '../data/saleModel';
import ServiceModel from '../data/serviceModel';
import BudgetTag from './budgetTag';
import Demodeler from './demodeler';
import Entry from './entry';
import {IIdentifiable} from './identifiable';
import Modelable, {IModelable} from './modelable';
import Note from './note';
import Payment from './payment';
import Purchase from './purchase';
import Sale from './sale';
import {Service} from './service';

export enum ProjectType {
  Money,
  Quantity,
}

export interface IProject extends IModelable {
  name: string;
  type: ProjectType;
  color: string;
}

export default class Project extends Modelable implements IProject {
  name: string = '';
  type: ProjectType = ProjectType.Money;
  color: string = '';
  entries: Entry[] = [];
  _model?: ProjectModel;

  notes: Note[] = [];
  payments: Payment[] = [];
  purchases: Purchase[] = [];
  sales: Sale[] = [];
  services: Service[] = [];
  tags: BudgetTag[] = [];

  get model() {
    return this._model;
  }

  constructor(props: {project?: IProject; model?: ProjectModel}) {
    super({modelable: props.project, model: props.model});
    this.name = props.project?.name ?? props.model?.name ?? '';
    this.type = props.project?.type ?? props.model?.type ?? ProjectType.Money;
    this.color =
      props.project?.color ?? props.model?.color ?? Project.colorsCustom[0];
  }

  static demodel(project: ProjectModel): Project {
    let iProject: IProject = {
      name: project.name,
      type: project.type,
      color: project.color,
      uuid: project.uuid,
      model: project,
    };
    return new Project({project: iProject, model: project});
  }

  isValid(): boolean {
    return this.name.length > 0 && this.color.length > 0;
  }

  async save() {
    if (this.model) {
      await updateProject(this);
    } else {
      await saveProject(this);
    }
  }

  async load() {
    await this._loadNotes();
    await this._loadPayments();
    await this._loadPurchases();
    await this._loadSales();
    await this._loadServices();
    await this._loadTags();
  }

  async _loadNotes() {
    const notes: NoteModel[] = await this.model?.notes.fetch();
    for (const note of notes) {
      const demodeler = new Demodeler(note);
      this.notes.push((await demodeler.getEntry()) as Note);
    }
  }
  async _loadPayments() {
    const payments: PaymentModel[] = await this.model?.payments.fetch();
    for (const payment of payments) {
      const demodeler = new Demodeler(payment);
      this.payments.push((await demodeler.getEntry()) as Payment);
    }
  }
  async _loadPurchases() {
    const purchases: PurchaseModel[] = await this.model?.purchases.fetch();
    for (const purchase of purchases) {
      const demodeler = new Demodeler(purchase);
      this.purchases.push((await demodeler.getEntry()) as Purchase);
    }
  }
  async _loadSales() {
    const sales: SaleModel[] = await this.model?.sales.fetch();
    for (const sale of sales) {
      const demodeler = new Demodeler(sale);
      this.sales.push((await demodeler.getEntry()) as Sale);
    }
  }
  async _loadServices() {
    const services: ServiceModel[] = await this.model?.services.fetch();
    for (const service of services) {
      this.services.push(new Service({model: service}));
    }
  }
  async _loadTags() {
    const tags: BudgetTagModel[] = await this.model?.budgetTags.fetch();
    for (const tag of tags) {
      this.tags.push(new BudgetTag({model: tag}, this));
    }
  }

  static get(project: IProject): Project {
    // TODO: check if exists
    return new Project({project: project});
  }

  static colors: string[] = [
    'red',
    'yellow',
    'orange',
    'green',
    'teal',
    'blue',
    'indigo',
    'purple',
    'pink',
  ];

  async delete() {
    for (const note of this.notes) {
      await note.delete();
    }
    for (const sale of this.sales) {
      await sale.delete();
    }
    for (const purchase of this.purchases) {
      await purchase.delete();
    }
    for (const payment of this.payments) {
      await payment.delete();
    }
    for (const tag of this.tags) {
      await tag.delete();
    }
    for (const service of this.services) {
      await service.delete();
    }
    await this.model?.delete();
  }

  // static colorsCustom: string[] = [
  //   '#F7FF58',
  //   '#6EEB83',
  //   '#33A9AB',
  //   '#FFA746',
  //   '#F96041',
  //   '#CB48B7',
  //   '#981F62',
  //   '#593C8F',
  //   '#3423A6',
  //   '#5465FF',
  // ];

  static colorsCustom: string[] = [
    '#FFF48C',
    '#FAAAAA',
    '#ADF0A2',
    '#B3F3F3',
    '#C7C2FB',
    '#F5C0EA',
    '#F3DAAA',
    '#C3EB9B',
    '#F6BBD4',
    '#DFE5F3',
  ];
}
