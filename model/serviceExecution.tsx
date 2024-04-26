import {database} from '../data/database';
import SaleModel from '../data/saleModel';
import ServiceExecutionModel from '../data/serviceExecutionModel';
import ServiceModel from '../data/serviceModel';
import ServicePriceModel from '../data/servicePriceModel';
import {BillableModelable} from './billableModelable';
import Project from './project';
import {Service, ServicePrice} from './service';

export class ServiceExecution extends BillableModelable {
  static collection = database.get('serviceExecutions');

  price?: ServicePrice;
  sale?: any; //Sale;
  service: Service;

  constructor(service: Service, props: {model?: ServiceExecutionModel}) {
    super({model: props.model});
    this.service = service;
    this.price = props.model?.price ?? service.lastServicePrice; //service.prices[0];
    this.priceOut = service.lastPrice;
  }

  static async getLoadedService(
    model: ServiceExecutionModel,
  ): Promise<Service> {
    const priceModel = (await model.price.fetch()) as ServicePriceModel;
    const serviceModel = (await priceModel.service.fetch()) as ServiceModel;
    const service = new Service({model: serviceModel});
    const exe = new ServiceExecution(service, {model: model});
    await exe.load();
    await service.load();
    service.outcoming.push(exe);
    return service;
  }

  async load() {
    if (!this._model) return;
    const priceModel = await (this
      ._model as ServiceExecutionModel).price.fetch();
    const saleModel = (await (this
      ._model as ServiceExecutionModel).sale.fetch()) as SaleModel;
    const projectModel = await saleModel.project.fetch();
    const tagModel = await saleModel.budgetTag.fetch();
    const project = new Project({model: projectModel});
    // const serviceModel =
    this.price = new ServicePrice(this.service, {model: priceModel});
    this.priceOut = this.price.price;
    // this.sale = new Sale(
    //   project,
    //   {model: saleModel},
    //   new BudgetTag({model: tagModel}, project),
    // );
  }

  async save() {
    if (this._model) await this._update();
    else await this._save();
  }

  async _update() {
    if (!this._model) return;
    await database.action(async () => {
      await this._model.update((entry: ServiceExecutionModel) => {
        entry = super.fillWatermelon(entry);
        entry.price.set(this.price?.model);
        entry.sale.set(this.sale?.model);
      });
    });
  }

  async _save() {
    this._model = await database.action(async () => {
      await ServiceExecution.collection.create(
        (entry: ServiceExecutionModel) => {
          entry = super.fillWatermelon(entry);
          entry.price.set(this.price?.model);
          entry.sale.set(this.sale?.model);
        },
      );
    });
  }

  async delete() {
    const model = this.model;
    if (model == undefined) return;
    await database.action(async () => {
      await this.model?.destroyPermanently();
    });
  }
}
