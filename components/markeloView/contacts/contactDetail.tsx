import React, {Component} from 'react';
import {FlatList, Linking} from 'react-native';
//
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

import {Div, Text, Button, Icon} from 'react-native-magnus';
import IContact, {Contact} from '../../../model/contact';
import {EntryContext, MarkelovTheme} from '../../../App';
import {database} from '../../../data/database';
import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import PurchaseModel from '../../../data/purchaseModel';
import SaleModel from '../../../data/saleModel';
import PaymentModel from '../../../data/paymentModel';
import {ContactModel} from '../../../data/contactModel';
import PurchaseDetail from '../../view/contacts/detailRows/purchaseDetail'; //' ./detailRows/purchaseDetail';
import SaleDetail from '../../view/contacts/detailRows/saleDetail'; //'./detailRows/saleDetail';
import PaymentDetail from '../../view/contacts/detailRows/paymentDetail'; //'./detailRows/paymentDetail';
import BasicModal from '../basicViews/basicModal';
import * as RX from 'rxjs';
import Title from '../elements/title';
import BasicRectangleView from '../elements/basicRectangleView';
import BasicSeparator from '../basicViews/basicSeparator';
import RectangleToggleRow from '../elements/rectangleToggleRow';
import BasicSelector from '../elements/basicSelector';
import BasicToggle from '../elements/basicToggle';
import Collapsible from 'react-native-collapsible';
import CalendarPickerRow from '../../view/fab/calendarPickerRow';
import Calendar from '../../../model/calendar';
import {ContactCardModel} from '../../../data/contactCardModel';
import {cross} from '../icons/as/svg';
import TextInputPanel from '../elements/textInputPanel';
import TaskDetail from './taskDetail';
import BasicModalView from '../basicViews/basicModalView';

interface IProps {
  isNotModal?: boolean;
  left?: string;
  right?: string;
  onPressLeft?: () => void;
  onPressRight?: () => void;
  purchases: PurchaseModel[];
  sales: SaleModel[];
  payments: PaymentModel[];
  cards: ContactCardModel[];
  contact?: IContact;
  contactModel?: ContactModel;
  onHide: () => void;
}

interface IState {}

class ContactDetailModal extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  linkLine = (label: string, linkText: string, onPress: () => void) => (
    <Div row alignItems="center">
      <Text pr={6}>{label}</Text>
      <Button bg="transparent" color="black" p={0} onPress={onPress}>
        <Text textDecorLine="underline">{linkText}</Text>
      </Button>
    </Div>
  );

  get hasContactsAndEmails(): boolean {
    return (
      !!this.props.contact?.phoneNumbers &&
      this.props.contact.phoneNumbers.length > 0 &&
      !!this.props.contact?.emailAddresses &&
      this.props.contact.emailAddresses.length > 0
    );
  }

  contacts = () =>
    this.props.contact?.phoneNumbers?.map?.((phoneNumber) =>
      this.linkLine('Телефон:', phoneNumber.number, () => {
        Linking.openURL(`tel:${phoneNumber.number}`);
      }),
    );

  emails = () =>
    this.props.contact?.emailAddresses?.map?.((emailAddress) =>
      this.linkLine('Email:', emailAddress.email, () =>
        Linking.openURL(`mailto:${emailAddress.email}`),
      ),
    );

  get hadBusiness(): boolean {
    return (
      this.props.purchases.length > 0 ||
      this.props.payments.length > 0 ||
      this.props.sales.length > 0
    );
  }

  get balance(): Element | undefined {
    if (!this.hadBusiness) return;
    return (
      <BasicRectangleView>
        {this.props.purchases.length > 0 && (
          <Div row>
            <Text color={MarkelovTheme.colors.Red} pr={6}>
              Долг:
            </Text>
            <Text>TODO: number</Text>
          </Div>
        )}
        {this.props.sales.length > 0 && (
          <Div row>
            <Text color={MarkelovTheme.colors.Green} pr={6}>
              Переплата:
            </Text>
            <Text>TODO: number</Text>
          </Div>
        )}

        <Div row>
          <Text pr={6}>Количество операций:</Text>
          <Text>
            {this.props.payments.length +
              this.props.purchases.length +
              this.props.sales.length}
          </Text>
        </Div>
      </BasicRectangleView>
    );
  }

  get cards(): Element | undefined {
    if (this.props.cards.length == 0) return;
    return (
      <BasicRectangleView>
        <Text fontFamily={MarkelovTheme.fontFamily.SemiBold600} pb={12}>
          Банковские карты
        </Text>
        <BasicSeparator vertical={12}>
          {this.props.cards.map((card) => (
            <Div row alignItems="center">
              <Button pr={6} h="100%">
                {cross({})}
              </Button>
              <Text pr={12}>{card.number}</Text>
              <Text>{card.bank}</Text>
            </Div>
          ))}
        </BasicSeparator>
      </BasicRectangleView>
    );
  }

  get activity(): (PurchaseModel | SaleModel | PaymentModel)[] {
    return this.props.payments
      .concat(this.props.purchases)
      .concat(this.props.sales)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  get base(): Element {
    return (
      <>
        <Title
          text={Contact.displayedName(
            this.props.contact ?? {givenName: 'Без', familyName: 'Имени'},
          )}
        />
        <BasicSeparator vertical={12}>
          <BasicRectangleView py={16}>
            <BasicSeparator vertical={20}>{this.contacts()}</BasicSeparator>
            <Div h={this.hasContactsAndEmails ? 20 : 0} />
            <BasicSeparator vertical={20}>{this.emails()}</BasicSeparator>
          </BasicRectangleView>
          {this.props.contact?.birthday && (
            <BasicRectangleView>
              <BasicSeparator vertical={16}>
                <Div row justifyContent="space-between">
                  <Text fontFamily={MarkelovTheme.fontFamily.SemiBold600}>
                    День рождения
                  </Text>
                  <Text>
                    {this.props.contact.birthday.day +
                      '.' +
                      this.props.contact.birthday.month +
                      '.' +
                      this.props.contact.birthday.year}
                  </Text>
                </Div>
                <Div row justifyContent="space-between">
                  <Text>Напоминание</Text>
                  <BasicToggle isOn />
                </Div>
                <Collapsible collapsed={false}>
                  <CalendarPickerRow day={new Calendar()} />
                </Collapsible>
              </BasicSeparator>
            </BasicRectangleView>
          )}
          <RectangleToggleRow text="Чёрный список" isOn />
          {this.balance}
          {this.cards}
          <TextInputPanel mb={0} mt={0} placeholder="Комментарий" />
          {this.activity.length > 0 && (
            <>
              <Title text="История операций" mb={24} />
              <FlatList
                data={this.activity}
                renderItem={(money) => <TaskDetail task={money.item} />}
              />
            </>
          )}
        </BasicSeparator>
        <Div h={150} />
      </>
    );
  }

  get modal(): Element {
    return (
      <BasicModal
        title="Контакт"
        isVisible={!!this.props.contactModel}
        left="Назад"
        onPressLeft={this.props.onHide}
        right="Изменить">
        {this.base}
      </BasicModal>
    );
  }

  render() {
    if (!this.props.contactModel && !this.props.contact) return <></>;
    const contact: IContact = this.props.contactModel;
    if (this.props.isNotModal)
      return (
        <BasicModalView
          title="Контакт"
          left={this.props.left}
          onPressLeft={this.props.onPressLeft}
          right={this.props.right}
          onPressRight={this.props.onPressRight}>
          {this.base}
        </BasicModalView>
      );
    return this.modal;
  }
}

const enhanceWithContact = withObservables(
  ['contact'],
  ({contact}: {contact?: IContact}) => {
    if (!contact) return {contactModel: RX.of(undefined)};
    return {
      contactModel: database
        .get('contacts')
        .query(Q.where('record_id', contact.recordID)),
    };
  },
);

const enhanceWithContactDetails = withObservables(
  ['contactModel'],
  ({contactModel}: {contactModel?: ContactModel[]}) => {
    if (!contactModel || contactModel.length != 1)
      return {
        payments: RX.of([]),
        purchases: RX.of([]),
        sales: RX.of([]),
        cards: RX.of([]),
      };
    return {
      payments: contactModel[0].payments,
      purchases: contactModel[0].purchases,
      //   purchasesUnpaid: contactModel.purchases.extend(Q.where('payment_id', Q.notEq(null))), TODO:
      sales: database.get('sales').query(
        Q.on(
          'contact_sale',
          Q.and(
            // Q.where('sale_id', Q.eq(Q.column('id'))),
            Q.where('contact_id', contactModel[0].id),
          ),
        ),
      ),
      cards: contactModel[0].cards,
    };
  },
);

export default enhanceWithContact(
  enhanceWithContactDetails(ContactDetailModal),
);
