import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
//
import {Div} from 'react-native-magnus';
import Contacts from 'react-native-contacts';
//
import ContactInfo from '../../../components/fab/contactInfo';
import ContactsList from '../../../components/fab/contactsList';
import HeaderButton from '../../../components/fab/customComponents/headerButton';
import AddItemForm from '../../../components/fab/addItemForm';
import PurchaseObject from '../../model/purchaseObject';
import SaleObject from '../../model/saleObject';
import ViewSaleItem from '../../../components/fab/viewSaleItem';
import ItemsList from '../../../components/fab/itemsList';
import {EntryContext, EntryContextValue} from '../../../App';
// import Prices from '../../main/prices';

import Article from '../../model/article';
import EntryModal from './entryModal';
import {Service} from '../../../model/service';
import SaleItemForm from './forms/saleItemForm';
import Prices from '../AS/prices';
import IContact from '../../../model/contact';
import ContactsView from '../contacts/contacts';
import ProjectModel from '../../../data/projectModel';
import QRScan, {BillQR} from './forms/qrScan';
import BasicModal from '../../markeloView/basicViews/basicModal';
import {Modal} from 'react-native';
import Form from '../../markeloView/form';

export type FabModalRootStackParamList = {
  Contact: {contact: IContact; onPress: (contact: IContact) => void};
  Contacts: {
    onPress: (contact: IContact) => void;
    onPressInfo?: (contact: IContact) => void;
    filter?: (contact: IContact) => boolean;
    isSettingsButtonVisible?: boolean;
    isModal?: boolean;
  };
  AddContact: {onPress: (contact: IContact) => void};
  AddItemForm: {onAdd: (item: Article) => void; item?: Article};
  ItemList: {contacts: IContact[]; onAdd: (item: SaleObject) => void};
  ViewItem: {
    contacts: IContact[];
    onAdd: (item: SaleObject) => void;
    item?: PurchaseObject;
  };
  Entry: {qr?: BillQR};
  Prices: {
    onPress?: (article: Article | Service) => void;
    onAdd?: () => void;
    isServicesVisible?: boolean;
    isArticlesVisible?: boolean;
    isSettingsVisible?: boolean;
    selectedProjects?: ProjectModel[];
    hideSelect?: boolean;
  };
  SaleItemForm: {
    item: Article | Service;
    onAdd?: (article: Article | Service) => void;
    contacts: IContact[];
    contact?: IContact;
  };
  QR: {onQRFound: (qr: BillQR) => void};
};

const FabModalStack = createStackNavigator<FabModalRootStackParamList>();

interface IProps {}

interface IState {}

export default class EntryModalNavigator extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  cancelButton = () => (
    <EntryContext.Consumer>
      {(value) => (
        <HeaderButton
          title="Отменить"
          onPress={() => {
            value.onChangeEntry(undefined);
            value.onChangeProject(undefined);
          }}
        />
      )}
    </EntryContext.Consumer>
  );

  addItemFormScreen = () => (
    <FabModalStack.Screen
      name="AddItemForm"
      component={Form} //{AddItemForm}
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
      // component={ContactsList}
      component={ContactsView}
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

  entryScreen = (value: EntryContextValue) => (
    <FabModalStack.Screen
      name="Entry"
      component={EntryModal}
      options={{
        headerShown: false,
        // headerLeft: this.cancelButton,
        // headerTitle: value.entry?.constructor.name,
      }}
    />
  );

  pricesScreen = () => (
    <FabModalStack.Screen
      name="Prices"
      component={Prices}
      options={{title: 'Товары/Услуги'}}
    />
  );
  saleItemFormScreen = () => (
    <FabModalStack.Screen
      name="SaleItemForm"
      component={Form} //{SaleItemForm}
      options={{title: 'Формировка'}}
    />
  );

  qrScanScreen = () => (
    <FabModalStack.Screen
      name="QR"
      component={QRScan}
      options={{
        title: 'Сканер',
      }}
    />
  );

  render() {
    return (
      <>
        <EntryContext.Consumer>
          {(value) => (
            <Modal
              visible={!!value.entry}
              animationType="slide"
              hardwareAccelerated
              // isVisible={!!value.entry}
              // h="95%"
              // useNativeDriver
              // propagateSwipe
              // swipeDirection="down"

              // onSwipeComplete={() => {
              //   value.onChangeEntry(undefined);
              // }}
            >
              <NavigationContainer>
                <FabModalStack.Navigator initialRouteName="Entry">
                  {this.entryScreen(value)}
                  {this.contactsScreen()}
                  {this.contactScreen()}
                  {this.addItemFormScreen()}
                  {this.itemListScreen()}
                  {this.viewItemScreen()}
                  {this.pricesScreen()}
                  {this.saleItemFormScreen()}
                  {this.qrScanScreen()}
                </FabModalStack.Navigator>
              </NavigationContainer>
            </Modal>
          )}
        </EntryContext.Consumer>
      </>
    );
  }
}
