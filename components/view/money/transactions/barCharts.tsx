import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {Div, Text} from 'react-native-magnus';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryStack,
  VictoryTheme,
} from 'victory-native';
import BudgetTagModel from '../../../../data/budgetTagModel';
import {database} from '../../../../data/database';
import {observeBudgetTagsOn} from '../../../../data/helpers';
import PaymentModel from '../../../../data/paymentModel';
import ProjectModel from '../../../../data/projectModel';
import PurchaseModel from '../../../../data/purchaseModel';
import SaleModel from '../../../../data/saleModel';
import Entry from '../../../../model/entry';
import {PaymentType} from '../../../../model/payment';

interface IProps {
  year: number;
  month: number;
  selectedProjects: ProjectModel[];
  budgetTagsIn: BudgetTagModel[];
  budgetTagsOut: BudgetTagModel[];
  paymentsIn: PaymentModel[];
  paymentsOut: PaymentModel[];
  purchases: PurchaseModel[];
  sales: SaleModel[];
}

interface IState {}

class BarCharts extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  inAxis = 'Доходы';
  outAxis = 'Расходы';

  stacks() {
    const payIn = this.props.paymentsIn.reduce(
      (acc, pay) => acc + pay.amount,
      0,
    );

    const payOut = this.props.paymentsOut.reduce(
      (acc, pay) => acc + pay.amount,
      0,
    );

    const purchases = this.props.purchases.reduce(
      (acc, pur) => acc + pur.amount,
      0,
    );
    const sales = this.props.sales.reduce((acc, sal) => acc + sal.amount, 0);
    return (
      <VictoryStack>
        <VictoryBar
          barWidth={50}
          colorScale={['#7FFFD4', '#7FFFD4']}
          data={[
            // {x: 'shit', y: 15},
            {
              x: this.outAxis,
              y: purchases,
            },
            {
              x: this.inAxis,
              y: sales,
            },
          ]}
        />
        <VictoryBar
          barWidth={50}
          colorScale={['#5F9EA0', '#5F9EA0']}
          data={[
            // {x: 'shit', y: 15},
            {
              x: this.outAxis,
              y: payOut,
            },
            {
              x: this.inAxis,
              y: payIn,
            },
          ]}
        />
      </VictoryStack>
    );
  }

  render() {
    const tagIn = this.props.budgetTagsIn.reduce(
      (acc, tag) => acc + tag.amount,
      0,
    );
    const tagOut = this.props.budgetTagsOut.reduce(
      (acc, tag) => acc + tag.amount,
      0,
    );

    const payIn = this.props.paymentsIn.reduce(
      (acc, pay) => acc + pay.amount,
      0,
    );

    const payOut = this.props.paymentsOut.reduce(
      (acc, pay) => acc + pay.amount,
      0,
    );

    const purchases = this.props.purchases.reduce(
      (acc, pur) => acc + pur.amount,
      0,
    );
    const sales = this.props.sales.reduce((acc, sal) => acc + sal.amount, 0);

    return (
      <>
        <VictoryChart theme={VictoryTheme.material} domainPadding={65}>
          {/* <VictoryAxis /> */}
          <VictoryGroup offset={50}>
            <VictoryBar
              barWidth={50}
              colorScale={[]}
              data={[
                // {x: 'shit', y: 15},
                {
                  x: this.outAxis,
                  y: tagOut,
                },
                {
                  x: this.inAxis,
                  y: tagIn,
                },
              ]}
            />
            {this.stacks()}
          </VictoryGroup>
        </VictoryChart>
        <Div row alignItems="center">
          <Div
            w={38}
            h={38}
            borderColor="grey"
            borderWidth={3}
            rounded={38}
            m={16}
          />
          <Div>
            <Text fontSize={18}>Остаток денежных средств</Text>
            <Text fontSize={18}>{payIn + sales - payOut - purchases} ₽</Text>
          </Div>
        </Div>
      </>
    );
  }
}

const enhanceWithEntries = withObservables(
  ['month', 'year', 'selectedProjects'],
  ({month, year, selectedProjects}) => ({
    budgetTagsIn: observeBudgetTagsOn(PaymentType.Income, year, month).extend(
      Q.where(
        'project_id',
        Q.oneOf(selectedProjects.map((project) => project.id)),
      ),
    ),
    budgetTagsOut: observeBudgetTagsOn(PaymentType.Outcome, year, month).extend(
      Q.where(
        'project_id',
        Q.oneOf(selectedProjects.map((project) => project.id)),
      ),
    ),
    paymentsIn: database
      .get('payments')
      .query(
        Q.where('type', PaymentType.Income),
        Q.where('is_done', true),
        Q.where('year', year),
        Q.where('month', month),
        Entry.filterByProjectDescription(selectedProjects),
      ),
    paymentsOut: database
      .get('payments')
      .query(
        Q.where('type', PaymentType.Outcome),
        Q.where('is_done', true),
        Q.where('year', year),
        Q.where('month', month),
        Entry.filterByProjectDescription(selectedProjects),
      ),
    purchases: database
      .get('purchases')
      .query(
        Q.where('payment_id', null),
        Q.where('is_done', true),
        Q.where('year', year),
        Q.where('month', month),
        Entry.filterByProjectDescription(selectedProjects),
      ),
    sales: database
      .get('sales')
      .query(
        Q.where('is_done', true),
        Q.where('year', year),
        Q.where('month', month),
        Entry.filterByProjectDescription(selectedProjects),
      ),
  }),
);

export default enhanceWithEntries(BarCharts);
