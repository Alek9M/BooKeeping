import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {Button, Div, Icon, Text} from 'react-native-magnus';
import {ContactModel} from '../../../data/contactModel';
import {database} from '../../../data/database';
import PaymentModel from '../../../data/paymentModel';
import PurchaseModel from '../../../data/purchaseModel';
import IContact, {Contact} from '../../../model/contact';
import {PaymentType} from '../../../model/payment';
import BasicRectangleRow from '../../markeloView/elements/basicRectangleRow';
import {ContactsRootStackParamList} from './contactsNavigator';
import MarkelovContactRow from '../../markeloView/contacts/contactRow';

type Props = StackNavigationProp<ContactsRootStackParamList, 'Main'>;

interface IProps extends Props {
  onPress?: (contact: IContact) => void;
  onPressInfo?: (contact: IContact) => void;
  contact: IContact;
  contactModel: ContactModel;
  paymentsIn: PaymentModel[];
  paymentsForDoneSales: PaymentModel[];
  paymentsOut: PaymentModel[];
  purchasesDonePaymentsOut: PaymentModel[];
  purchasesNotDonePaymentsOut: PaymentModel[];
  purchases: PurchaseModel[];
}

interface IState {}

class ContactRow extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  calculateOwns(): number {
    return (
      this.props.paymentsIn.reduce((acc, next) => (acc += next.amount), 0) +
      this.props.paymentsForDoneSales.reduce(
        (acc, pay) => (acc += pay.amount),
        0,
      )
    );
  }

  calculateIsOwned(): number {
    const pOut = this.props.paymentsOut
      .filter(
        (payment) =>
          !this.props.purchasesNotDonePaymentsOut.some(
            (purchasePayment) => purchasePayment.uuid == payment.uuid,
          ),
      )
      .reduce((acc, next) => (acc += next.amount), 0);
    const purchases = this.props.purchases.reduce(
      (acc, next) => (acc += next.amount),
      0,
    );
    return pOut + purchases;
  }

  defaultOnPress() {
    this.props.navigation.navigate('Contact', {
      model: this.props.contactModel,
      contact: this.props.contact,
    });
  }

  render() {
    const owns = this.calculateOwns();
    const isOwned = this.calculateIsOwned();
    return (
      <MarkelovContactRow
        contact={this.props.contactModel}
        onPressInfo={this.props.onPressInfo}
        onPress={() => {
          this.props.onPress?.(this.props.contact);
          if (this.props.onPress) return;
          this.defaultOnPress();
        }}
        owns={this.calculateOwns()}
        owned={this.calculateIsOwned()}
      />
      // <BasicRectangleRow
      //   mb={12}
      //   h={48}
      //   text={Contact.displayedName(this.props.contactModel)}
      //   onPress={() => {
      //     this.props.onPress?.(this.props.contact);
      //     if (this.props.onPress) return;
      //     this.defaultOnPress();
      //   }}>
      //   <Div>
      //     {owns > 0 && (
      //       <Text fontSize={12} color="#ED4949" fontFamily="Inter">
      //         {owns.toFixed(2)}₽
      //       </Text>
      //     )}
      //     {isOwned > 0 && (
      //       <Text fontSize={12} color="#45B600" fontFamily="Inter">
      //         {isOwned.toFixed(2)}₽
      //       </Text>
      //     )}
      //   </Div>
      // </BasicRectangleRow>
      // <Button
      //   p={0}
      //   m={0}
      //   bg="transparent"
      //   w="100%"
      //   onPress={() => {
      //     this.props.onPress?.(this.props.contact);
      //     if (this.props.onPress) return;
      //     this.defaultOnPress();
      //   }}>
      //   <Div
      //     row
      //     flex={1}
      //     justifyContent="space-between"
      //     bg="#AEAEB2"
      //     rounded={6}
      //     mx={20}
      //     my="sm"
      //     py={10}
      //     px={20}
      //     alignItems="center">
      //     <Div>
      //       <Text>{Contact.displayedName(this.props.contactModel)}</Text>
      //     </Div>
      //     <Div>
      //       {!!owns && <Text textAlign="right">Долг: {owns.toFixed(2)}₽</Text>}
      //       {!!isOwned && (
      //         <Text textAlign="right">Недоплата: {isOwned.toFixed(2)}₽</Text>
      //       )}
      //     </Div>
      //     {/* {!!this.props.onPress && (
      //       <Button
      //         onPress={this.defaultOnPress}
      //         bg="transparent"
      //         py="md"
      //         px="lg"
      //         alignItems="center"
      //         justifyContent="center">
      //         <Icon
      //           name="info"
      //           fontSize="lg"
      //           fontFamily="Feather"
      //           color="blue700"
      //         />
      //       </Button>
      //     )} */}
      //   </Div>
      // </Button>
    );
  }
}

const enhanceWithDetails = withObservables(
  ['contactModel'],
  ({contactModel}: {contactModel: ContactModel[]}) => ({
    contactModel: contactModel[0],
    paymentsIn: contactModel[0].payments.extend(
      Q.where('type', PaymentType.Income),
      Q.where('is_done', false),
      Q.where('sale_id', null),
    ),
    paymentsForDoneSales: contactModel[0].payments.extend(
      Q.experimentalJoinTables(['sales']),
      Q.where('type', PaymentType.Income),
      Q.where('is_done', false),
      Q.on('sales', 'is_done', true),
    ),
    paymentsOut: contactModel[0].payments.extend(
      Q.experimentalJoinTables(['purchases']),
      Q.where('is_done', false),
      Q.where('type', PaymentType.Outcome),
    ),
    purchasesDonePaymentsOut: contactModel[0].payments.extend(
      Q.experimentalJoinTables(['purchases']),
      Q.where('is_done', false),
      Q.where('type', PaymentType.Outcome),
      Q.on('purchases', 'is_done', true),
    ),
    purchasesNotDonePaymentsOut: contactModel[0].payments.extend(
      Q.experimentalJoinTables(['purchases']),
      Q.where('is_done', false),
      Q.where('type', PaymentType.Outcome),
      Q.on('purchases', 'is_done', false),
    ),
    purchases: contactModel[0].purchases.extend(
      Q.where('payment_id', null),
      Q.where('is_done', false),
    ),
    sales: contactModel[0].sales.extend(
      // Q.where('payment_id', null),
      Q.where('is_done', false),
    ),
  }),
);

const enhanceWithContact = withObservables(
  ['contact'],
  ({contact}: {contact: IContact}) => ({
    contactModel: Contact.findByRecordIdQuery(contact.recordID),
    allPayments: database.collections.get('payments').query(),
  }),
);

export default enhanceWithContact(enhanceWithDetails(ContactRow));
