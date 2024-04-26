import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';

import {Modal} from 'react-native-magnus';
import Contacts from 'react-native-contacts';

import ContactInfo from './contactInfo';
import ContactsList from './contactsList';
import HeaderButton from './customComponents/headerButton';
import Note, {NoteInt} from './note';
import Payment from './payment';
import Purchase from './purchase';
import AddItemForm from './addItemForm';
import PurchaseObject from '../../model/purchaseObject';
import IContact from '../../model/contact';
import Sale from './sale';
import SaleObject from '../../model/saleObject';
import ViewSaleItem from './viewSaleItem';
import ItemsList from './itemsList';
import {EntryContext, EntryContextValue} from '../../App';
import CNote from '../../model/note';
import CPayment from '../../model/payment';
import CPurchase from '../../model/purchase';
import CSale from '../../model/sale';
import Projects from '../../model/project';

import {screens} from './fabMenu';
import Project from '../../model/project';
import Article from '../../model/article';

export type FabModalRootStackParamList = {
  Contact: {contact: IContact; onPress: (contact: IContact) => void};
  Contacts: {onPress: (contact: IContact) => void};
  AddContact: {onPress: (contact: IContact) => void};
  Note: {note?: CNote; onDone: () => void};
  Payment: {payment?: CPayment; project?: Project; onDone: () => void};
  Purchase: {purchase?: CPurchase; project?: Project; onDone: () => void};
  AddItemForm: {onAdd: (item: Article) => void; item?: Article};
  Sale: {sale?: CSale; project?: Project; onDone: () => void};
  ItemList: {contacts: IContact[]; onAdd: (item: SaleObject) => void};
  ViewItem: {
    contacts: IContact[];
    onAdd: (item: SaleObject) => void;
    item?: PurchaseObject;
  };
};

const FabModalStack = createStackNavigator<FabModalRootStackParamList>();

interface IProps {
  initialStack: screens;
  hideModal: () => void;
  note?: NoteInt;
}

interface IState {}

export default class FabModal extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  cancelButton = () => (
    <EntryContext.Consumer>
      {(value) => (
        <HeaderButton
          title="Отменить"
          onPress={() => {
            this.props.hideModal();
            value.onChangeEntry(undefined);
          }}
        />
      )}
    </EntryContext.Consumer>
  );

  addItemFormScreen = () => (
    <FabModalStack.Screen
      name="AddItemForm"
      component={AddItemForm}
      options={({route, navigation}) => ({
        title: 'Новая позиция',
      })}
    />
  );

  contactScreen = () => (
    <FabModalStack.Screen
      name="Contact"
      component={ContactInfo}
      options={({route, navigation}) => ({
        title:
          route.params.contact.givenName +
          ' ' +
          route.params.contact.familyName,
        headerRight: () => (
          <HeaderButton
            title="Выбрать"
            onPress={() => {
              route.params.onPress(route.params.contact);
              navigation.dispatch(StackActions.popToTop());
            }}
          />
        ),
      })}
    />
  );

  contactsScreen = () => (
    <FabModalStack.Screen
      name="Contacts"
      component={ContactsList}
      options={({route, navigation}) => ({
        title: 'Контакты',
        headerRight: () => (
          <HeaderButton
            title="Добавить"
            onPress={() => {
              Contacts.openContactForm({}).then((contact) => {
                route.params.onPress(contact);
                navigation.dispatch(StackActions.popToTop());
              });
            }}
          />
        ),
      })}>
      {/* {(props) => (
        <ContactsList
          onPress={(contact) => {}}
          onPressInfo={(contact) => {}}
          {...props}
        />
      )} */}
    </FabModalStack.Screen>
  );

  purchaseScreen = (value: EntryContextValue) => (
    <FabModalStack.Screen
      name="Purchase"
      component={Purchase}
      initialParams={{
        purchase: value.entry instanceof CPurchase ? value.entry : undefined,
        project: value.project,
        onDone: this.props.hideModal,
      }}
      options={{
        title: 'Покупка',
        headerLeft: this.cancelButton,
      }}
    />
  );

  saleScreen = (value: EntryContextValue) => (
    <FabModalStack.Screen
      name="Sale"
      component={Sale}
      initialParams={{
        sale: value.entry instanceof CSale ? value.entry : undefined,
        project: value.project,
        onDone: this.props.hideModal,
      }}
      options={{
        title: 'Продажа',
        headerLeft: this.cancelButton,
      }}
    />
  );

  itemListScreen = () => (
    <FabModalStack.Screen
      name="ItemList"
      component={ItemsList}
      options={{
        title: 'Позиции',
      }}
    />
  );

  viewItemScreen = () => (
    <FabModalStack.Screen
      name="ViewItem"
      component={ViewSaleItem}
      options={{
        title: 'Позиция',
      }}
    />
  );

  paymentScreen = (value: EntryContextValue) => (
    <FabModalStack.Screen
      name="Payment"
      component={Payment}
      initialParams={{
        payment: value.entry instanceof CPayment ? value.entry : undefined,
        project: value.project,
        onDone: this.props.hideModal,
      }}
      options={{
        title: 'Оплата',
        headerLeft: this.cancelButton,
      }}
    />
  );

  noteScreen = (value: EntryContextValue) => (
    <FabModalStack.Screen
      name="Note"
      component={Note}
      initialParams={{
        note: value.entry instanceof CNote ? value.entry : undefined,
        onDone: this.props.hideModal,
      }}
      options={{
        title: 'Задача',
        headerLeft: this.cancelButton,
      }}
    />
  );

  render() {
    return (
      <>
        <EntryContext.Consumer>
          {(value) => (
            <Modal
              isVisible={
                Boolean(this.props.initialStack) || Boolean(value.entry)
              }
              h="95%"
              useNativeDriver
              propagateSwipe
              swipeDirection="down"
              onSwipeComplete={() => {
                this.props.hideModal();
              }}>
              <NavigationContainer>
                <FabModalStack.Navigator
                  initialRouteName={
                    value.entry
                      ? value.entry.constructor.name
                      : this.props.initialStack
                  }
                  screenOptions={{}}>
                  {this.paymentScreen(value)}
                  {this.noteScreen(value)}
                  {this.contactsScreen()}
                  {this.contactScreen()}
                  {this.purchaseScreen(value)}
                  {this.addItemFormScreen()}
                  {this.saleScreen(value)}
                  {this.itemListScreen()}
                  {this.viewItemScreen()}
                </FabModalStack.Navigator>
              </NavigationContainer>
            </Modal>
          )}
        </EntryContext.Consumer>
      </>
    );
  }
}
