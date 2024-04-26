import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {Button, Div, Icon, Text} from 'react-native-magnus';
import {EntryContext} from '../../../../App';
import ArticleInModel from '../../../../data/articleInModel';
import ArticleModel from '../../../../data/articleModel';
import ArticleOutModel from '../../../../data/articleOutModel';
import PaymentModel from '../../../../data/paymentModel';
import ProjectModel from '../../../../data/projectModel';
import PurchaseModel from '../../../../data/purchaseModel';
import Payment, {PaymentType} from '../../../../model/payment';
import Project from '../../../../model/project';
import Purchase from '../../../../model/purchase';
import PurchaseList from './purchaseList';

interface IProps {
  payment: PaymentModel;
  project: ProjectModel;
}

interface IState {}

class PaymentDetail extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <EntryContext.Consumer>
        {(value) => (
          <Div
            row
            alignSelf="center"
            justifyContent="space-between"
            w="80%"
            alignItems="center">
            <Button
              bg="gray100"
              m="sm"
              onPress={() => {
                const project = new Project({model: this.props.project});
                const purchase = new Payment(project, {
                  model: this.props.payment,
                });
                purchase.load().then(() => value.onChangeEntry(purchase));
              }}>
              <Div flex={1}>
                <Text fontSize="xl">{this.props.payment.title}</Text>
                <Text>{this.props.payment.date}</Text>
              </Div>
              <Text
                color={
                  this.props.payment.type == PaymentType.Income
                    ? 'green'
                    : 'red'
                }
                fontSize="xl">
                {this.props.payment.amount}₽
              </Text>
              <Icon name="arrow-right" fontFamily="SimpleLineIcons" pl="sm" />
            </Button>
          </Div>
        )}
      </EntryContext.Consumer>
    );
  }
}

const enhanceWithContact = withObservables(
  ['payment'],
  ({payment}: {payment: PurchaseModel}) => ({
    payment: payment,
    project: payment.project,
  }),
);

export default enhanceWithContact(PaymentDetail);
