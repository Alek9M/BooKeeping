import React, {Component} from 'react';
import {FlatList, Linking} from 'react-native';
//
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

import {Div, Text, Button, Icon} from 'react-native-magnus';
import IContact, {Contact} from '../../../model/contact';
import {EntryContext} from '../../../App';
import {database} from '../../../data/database';
import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {ContactsRootStackParamList} from './contactsNavigator';
import PurchaseModel from '../../../data/purchaseModel';
import SaleModel from '../../../data/saleModel';
import PaymentModel from '../../../data/paymentModel';
import {ContactModel} from '../../../data/contactModel';
import PurchaseDetail from './detailRows/purchaseDetail';
import SaleDetail from './detailRows/saleDetail';
import PaymentDetail from './detailRows/paymentDetail';

type Props = StackNavigationProp<ContactsRootStackParamList, 'Contact'>;

interface IProps extends Props {
  route: any;
  navigation: any;
  purchases: PurchaseModel[];
  sales: SaleModel[];
  payments: PaymentModel[];
  contactModel: ContactModel;
}

interface IState {}

class ContactDetail extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    props.navigation.setOptions({
      headerShown: true,
      headerTitle: Contact.displayedName(this.props.route.params.contact),
    });
  }

  contacts = () =>
    this.props.route.params.contact.phoneNumbers.map((phoneNumber) => (
      <Div row py="sm" alignItems="center">
        <Text fontSize="lg" w="20%">
          {phoneNumber.label}
        </Text>
        <Button
          bg="transparent"
          color="black"
          p={0}
          onPress={() => {
            Linking.openURL(`tel:${phoneNumber.number}`);
          }}>
          {phoneNumber.number}
        </Button>
      </Div>
    ));

  emails = () =>
    this.props.route.params.contact.emailAddresses.map((emailAddress) => (
      <Div row py="sm" alignItems="center">
        <Text fontSize="lg" w="20%">
          {emailAddress.label}
        </Text>
        <Text>{emailAddress.email}</Text>
      </Div>
    ));

  render() {
    const contact: IContact = this.props.route.params.contact;
    return (
      <Div px="md" py="xl">
        {contact.birthday && (
          <Div row w="100%" justifyContent="center">
            <Text fontSize="lg">
              {contact.birthday.day +
                '.' +
                contact.birthday.month +
                '.' +
                contact.birthday.year}
            </Text>
          </Div>
        )}
        {contact.company.length > 0 && (
          <Div row w="100%" justifyContent="center">
            <Text fontSize="md">{contact.company}</Text>
          </Div>
        )}
        <Div h={50} />
        {this.contacts()}
        <Div h={20} />
        {this.emails()}
        <FlatList
          data={
            this.props.purchases
              .concat(this.props.sales)
              .concat(this.props.payments) as (
              | PurchaseModel
              | SaleModel
              | PaymentModel
            )[]
          }
          renderItem={(money) => {
            if (money.item instanceof PurchaseModel)
              return <PurchaseDetail purchase={money.item} />;

            if (money.item instanceof SaleModel)
              return <SaleDetail sale={money.item} />;

            if (money.item instanceof PaymentModel)
              return <PaymentDetail payment={money.item} />;
          }}
        />
      </Div>
    );
  }
}

const enhanceWithContact = withObservables(['route'], ({route}) => ({
  contactModel: route.params.model,
  payments: route.params.model.payments,
  purchases: route.params.model.purchases,
  sales: database.get('sales').query(
    Q.on(
      'contact_sale',
      Q.and(
        // Q.where('sale_id', Q.eq(Q.column('id'))),
        Q.where('contact_id', route.params.model.id),
      ),
    ),
  ),
}));

export default enhanceWithContact(ContactDetail);
