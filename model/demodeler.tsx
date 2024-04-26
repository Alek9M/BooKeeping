import EntryModel from '../data/entryModel';
import NoteModel from '../data/noteModel';
import PaymentModel from '../data/paymentModel';
import ProjectModel from '../data/projectModel';
import PurchaseModel from '../data/purchaseModel';
import SaleModel from '../data/saleModel';
import Entry from './entry';
import Note from './note';
import Payment from './payment';
import Project from './project';
import Purchase from './purchase';
import Sale from './sale';

export default class Demodeler {
  _model: EntryModel;

  constructor(model: EntryModel) {
    this._model = model;
  }

  get hasProject(): boolean {
    return Boolean(this._model.project);
  }

  get modelConstructor(): Function {
    return this._model.constructor;
  }

  constructionErrorDescription(at: string): string {
    return 'Trying to construct ' + at + ' without Project';
  }

  async getProject(): Promise<Project | undefined> {
    if (!this.hasProject) return undefined;
    const projectModel: ProjectModel = await this._model.project.fetch();
    const project = new Project({model: projectModel});
    return project;
  }

  async getProjectOrDieTrying(errorFor: string): Promise<Project> {
    const project = await this.getProject();
    if (project == undefined)
      throw new Error(this.constructionErrorDescription(errorFor));
    return project;
  }

  async note(): Promise<Note> {
    return new Note({model: this._model as NoteModel}, await this.getProject());
  }

  async payment(): Promise<Payment> {
    return new Payment(await this.getProjectOrDieTrying('Payment'), {
      model: this._model as PaymentModel,
    });
  }

  async purchase(): Promise<Purchase> {
    return new Purchase(await this.getProjectOrDieTrying('Purchase'), {
      model: this._model as PurchaseModel,
    });
  }

  async sale(): Promise<Sale> {
    return new Sale(await this.getProjectOrDieTrying('Sale'), {
      model: this._model as SaleModel,
    });
  }

  async getEntry(): Entry {
    let entry: Entry | undefined;
    const err = "Can't demodel incompatible model";

    switch (this.modelConstructor) {
      case NoteModel:
        entry = await this.note();
        break;
      case PaymentModel:
        entry = await this.payment();
        break;
      case PurchaseModel:
        entry = await this.purchase();
        break;
      case SaleModel:
        entry = await this.sale();
        break;
      default:
        throw new Error(err);
    }

    if (entry == undefined) throw new Error(err);
    await entry.load();

    return entry;
  }

  static async demodel(model: EntryModel): Entry {
    const projectModel = await model.project?.fetch?.();
    const project = projectModel
      ? new Project({model: projectModel})
      : undefined;
    let entry: Entry | undefined = undefined;
    switch (model.constructor) {
      case NoteModel:
        return new Note({model: model as NoteModel}, project);
      case PaymentModel:
        if (project) {
          entry = new Payment(project, {
            model: model as PaymentModel,
          });
          break;
        } else {
          throw new Error('Trying to construct Payment without Project');
        }
      case PurchaseModel:
        if (project) {
          entry = new Purchase(project, {
            model: model as PurchaseModel,
          });
          break;
        } else {
          throw new Error('Trying to construct Purchase without Project');
        }
      case SaleModel:
        if (project) {
          entry = new Sale(project, {
            model: model as SaleModel,
          });
          break;
        } else {
          throw new Error('Trying to construct Purchase without Project');
        }

      default:
        throw new Error("Can't demodel incompatible model");
    }

    // TODO: doesn't load
    if (entry == undefined) throw new Error("Can't demodel incompatible model");
    await entry.load();
    return entry;
  }
}
