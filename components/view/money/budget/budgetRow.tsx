import React, {Component} from 'react';
//
import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {Button, Div, Text} from 'react-native-magnus';
//
import BudgetTagModel from '../../../../data/budgetTagModel';
import ProjectModel from '../../../../data/projectModel';
import ProjectIcon from '../../tab/tabWide/projectIcon';
import PaymentModel from '../../../../data/paymentModel';
import PurchaseModel from '../../../../data/purchaseModel';
import SaleModel from '../../../../data/saleModel';

interface IProps {
  budgetTag: BudgetTagModel;
  project: ProjectModel;
  payments: PaymentModel[];
  purchases: PurchaseModel[];
  sales: SaleModel[];
  onPress: (budget: BudgetTagModel) => void;
}

interface IState {}

class BudgetRow extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  sumUp(entry: (SaleModel | PaymentModel | PurchaseModel)[]): number {
    return entry.reduce((sum, next) => (sum += next.amount), 0);
  }

  spent(): number {
    return (
      this.sumUp(this.props.payments) +
      this.sumUp(this.props.sales) +
      this.sumUp(this.props.purchases)
    );
  }

  render() {
    return (
      <Button
        onPress={() => this.props.onPress(this.props.budgetTag)}
        rounded={6}
        bg="#AEAEB2"
        // bg="transparent"
        flex={1}
        p={0}
        mx={6}
        my={6}>
        <Div
          row
          bg="#9E42FB"
          position="absolute"
          w={`${(this.spent() / this.props.budgetTag.amount) * 100}%`}
          h="100%"
          m={0}
          left={0}
        />
        <Div justifyContent="space-between" py={13} px={22} flex={1} row>
          <Div>
            <Text fontWeight="600" color="white" fontSize={15}>
              {this.props.budgetTag.title}
            </Text>
            <ProjectIcon project={this.props.project} isOn />
          </Div>
          <Div>
            <Text fontSize={14} color="white" fontWeight="400">
              {this.props.budgetTag.amount - this.spent()}₽
            </Text>
          </Div>
        </Div>
      </Button>
    );
  }
}

function periodQuery(tag: BudgetTagModel): Q.And {
  return Q.and(Q.where('year', tag.year), Q.where('month', tag.month));
}

const enhanceWithEntries = withObservables(
  ['budgetTag'],
  ({budgetTag}: {budgetTag: BudgetTagModel}) => ({
    budgetTag: budgetTag,
    project: budgetTag.project,
    payments: budgetTag.payments.extend(
      periodQuery(budgetTag),
      Q.where('is_done', true),
    ),
    purchases: budgetTag.purchases.extend(
      periodQuery(budgetTag),
      Q.where('is_done', true),
      Q.where('payment_id', null),
    ),
    sales: budgetTag.sales.extend(
      periodQuery(budgetTag),
      Q.where('is_done', true),
      Q.on('payments', 'sale_id', Q.notEq(Q.column('id'))),
    ),
  }),
);

export default enhanceWithEntries(BudgetRow);
