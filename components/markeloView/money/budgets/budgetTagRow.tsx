import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {Button, Div, Text} from 'react-native-magnus';
import BudgetTagModel from '../../../../data/budgetTagModel';
import PurchaseModel from '../../../../data/purchaseModel';
import SaleModel from '../../../../data/saleModel';
import PaymentModel from '../../../../data/paymentModel';
import {PaymentType} from '../../../../model/payment';
import {MarkelovTheme} from '../../../../App';

interface IProps {
  tag: BudgetTagModel;
  type: number;
  sales: SaleModel[];
  purchases: PurchaseModel[];
  paymentsIn: PaymentModel[];
  paymentsOut: PaymentModel[];
  onPressRow: (budget: BudgetTagModel) => void;
}

interface IState {}

class BudgetTagRow extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  sumUp(entry: (SaleModel | PaymentModel | PurchaseModel)[]): number {
    return entry.reduce((sum, next) => (sum += next.amount), 0);
  }

  get spent(): number {
    return (
      this.sumUp(this.props.paymentsIn) +
      this.sumUp(this.props.paymentsOut) +
      this.sumUp(this.props.sales) +
      this.sumUp(this.props.purchases)
    );
  }

  get left(): number {
    return this.props.tag.amount - this.spent;
  }

  get leftPercent(): number {
    return (this.left / this.props.tag.amount) * 100;
  }

  render() {
    return (
      <Button
        onPress={() => this.props.onPressRow(this.props.tag)}
        w="100%"
        justifyContent="flex-start"
        bg={this.spent >= this.props.tag.amount ? '#BCBCBC' : '#F1F2F5'}
        rounded={7}
        mt={8}>
        {this.spent < this.props.tag.amount && (
          <Div
            overflow="hidden"
            position="absolute"
            bg={this.props.type == PaymentType.Income ? '#ADF0A2' : '#EDA2A2'}
            w={`${100 - this.leftPercent}%`}
            rounded={7}
            h="100%"
          />
        )}

        <Div row justifyContent="space-between" flex={1} my={9} mx={15}>
          <Div>
            <Text fontFamily={MarkelovTheme.fontFamily.SemiBold600}>
              {this.props.tag.title}
            </Text>
            <Text mt={2}>{this.props.tag.amount}₽</Text>
          </Div>
          <Div alignItems="flex-end">
            <Text fontFamily={MarkelovTheme.fontFamily.SemiBold600}>
              {this.leftPercent}%
            </Text>
            <Text>{this.left}₽</Text>
          </Div>
        </Div>
      </Button>
    );
  }
}
// TODO: consider delayed sales and purchases, check the prev version for clues
const enhanceWithEntries = withObservables(
  ['tag'],
  ({tag}: {tag: BudgetTagModel}) => ({
    tag: tag,
    paymentsIn: tag.payments.extend(
      Q.where('is_done', true),
      Q.where('type', PaymentType.Income),
    ),
    paymentsOut: tag.payments.extend(
      Q.where('is_done', true),
      Q.where('type', PaymentType.Outcome),
    ),
    purchases: tag.purchases.extend(
      Q.where('is_done', true),
      Q.where('payment_id', null),
    ),
    sales: tag.sales.extend(Q.where('is_done', true)),
  }),
);

export default enhanceWithEntries(BudgetTagRow);
