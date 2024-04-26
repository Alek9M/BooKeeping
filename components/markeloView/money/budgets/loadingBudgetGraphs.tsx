import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {Div} from 'react-native-magnus';
import BudgetTagModel from '../../../../data/budgetTagModel';
import {database} from '../../../../data/database';
import ProjectModel from '../../../../data/projectModel';
import {PaymentType} from '../../../../model/payment';
import BudgetGraph, {BudgetGraphInfo} from './budgetGraph';
import BudgetGraphs from './budgetGraphs';
import * as rxjs from 'rxjs';
import Calendar from '../../../../model/calendar';
import PurchaseModel from '../../../../data/purchaseModel';
import SaleModel from '../../../../data/saleModel';
import PaymentModel from '../../../../data/paymentModel';

interface IProps {
  budgetTitle: string;
  monthsUpTo: number;
  year: number;
  type: PaymentType;
  project?: ProjectModel;

  budget1?: BudgetTagModel[];
  budget1pay: PaymentModel[];
  budget1pur: PurchaseModel[];
  budget1sal: SaleModel[];

  budget2?: BudgetTagModel[];
  budget2pay: PaymentModel[];
  budget2pur: PurchaseModel[];
  budget2sal: SaleModel[];

  budget3?: BudgetTagModel[];
  budget3pay: PaymentModel[];
  budget3pur: PurchaseModel[];
  budget3sal: SaleModel[];

  onPress?: (amount: number) => void;
}

interface IState {}

class LoadingBudgetGraphs extends Component<IProps, IState> {
  static readonly maxGraphHeight = 170;

  constructor(props: IProps) {
    super(props);
  }

  get graphInfo(): BudgetGraphInfo[] {
    let infos: BudgetGraphInfo[] = [];
    for (const bud of [
      {
        bud: this.props.budget1,
        entries: [
          ...(this.props.budget1pay ?? []),
          ...(this.props.budget1pur ?? []),
          ...(this.props.budget1sal ?? []),
        ],
      },
      {
        bud: this.props.budget2,
        entries: [
          ...(this.props.budget2pay ?? []),
          ...(this.props.budget2pur ?? []),
          ...(this.props.budget2sal ?? []),
        ],
      },
      {
        bud: this.props.budget3,
        entries: [
          ...(this.props.budget3pay ?? []),
          ...(this.props.budget3pur ?? []),
          ...(this.props.budget3sal ?? []),
        ],
      },
    ]) {
      if (bud.bud == undefined || bud.bud.length == 0) continue;
      infos.push({
        month: Calendar.rusMonth[bud.bud[0].month - 1],
        spent: bud.entries.reduce((sum, cur) => (sum += cur.amount), 0),
        planned: bud.bud[0].amount,
      });
    }
    return infos;
  }

  render() {
    if (this.graphInfo.length == 0) return <></>;
    return (
      <BudgetGraphs onPress={this.props.onPress} budgets={this.graphInfo} />
    );
  }
}

function query(
  monthsPrior: number,
  to: number,
  y: number,
  title: string,
  type: PaymentType,
  project: ProjectModel,
): Q.And {
  let month = to - monthsPrior;
  let year = y;
  while (month < 0) {
    year -= 1;
    month += 12;
  }
  return Q.and(
    Q.where('type', type),
    Q.where('title', title),
    Q.where('project_id', project.id),
    Q.where('year', year),
    Q.where('month', month),
  );
}

const enhanceWithBuds = withObservables(
  ['budgetTitle', 'monthsUpTo', 'year', 'type', 'project'],
  ({
    budgetTitle,
    monthsUpTo,
    year,
    type,
    project,
  }: {
    budgetTitle: string;
    monthsUpTo: number;
    year: number;
    type: PaymentType;
    project: ProjectModel;
  }) => {
    if (project == undefined || budgetTitle.length == 0) return {};
    const table = database.collections.get(BudgetTagModel.table);
    return {
      budget1:
        table.query(query(3, monthsUpTo, year, budgetTitle, type, project)) ??
        rxjs.of(undefined),
      budget2:
        table.query(query(2, monthsUpTo, year, budgetTitle, type, project)) ??
        rxjs.of(undefined),
      budget3:
        table.query(query(1, monthsUpTo, year, budgetTitle, type, project)) ??
        rxjs.of(undefined),
    };
  },
);
const enhanceWithBudsSpent = withObservables(
  ['budget1', 'budget2', 'budget3'],
  ({
    budget1,
    budget2,
    budget3,
  }: {
    budget1?: BudgetTagModel[];
    budget2?: BudgetTagModel[];
    budget3?: BudgetTagModel[];
  }) => {
    return {
      budget1pay: budget1?.[0]?.spentPayments ?? rxjs.of(undefined),
      budget1pur: budget1?.[0]?.spentPurchases ?? rxjs.of(undefined),
      budget1sal: budget1?.[0]?.spentSales ?? rxjs.of(undefined),

      budget2pay: budget2?.[0]?.spentPayments ?? rxjs.of(undefined),
      budget2pur: budget2?.[0]?.spentPurchases ?? rxjs.of(undefined),
      budget2sal: budget2?.[0]?.spentSales ?? rxjs.of(undefined),

      budget3pay: budget3?.[0]?.spentPayments ?? rxjs.of(undefined),
      budget3pur: budget3?.[0]?.spentPurchases ?? rxjs.of(undefined),
      budget3sal: budget3?.[0]?.spentSales ?? rxjs.of(undefined),
    };
  },
);

export default enhanceWithBuds(enhanceWithBudsSpent(LoadingBudgetGraphs));
