import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
//
import ContactsAPI from 'react-native-contacts';
import {Div, Text} from 'react-native-magnus';
import {HeaderContext} from '../../../App';
import {ContactModel} from '../../../data/contactModel';
import {database} from '../../../data/database';
import IContact, {Contact} from '../../../model/contact';
import BasicModalView from '../../markeloView/basicViews/basicModalView';
import BasicTab from '../../markeloView/basicViews/basicTab';
//
import MainTabScreen from '../tab/mainTabScreen';
import ContactRow from './contactRow';
import ContactsFiltered from './contactsFiltered';
import {ContactsRootStackParamList} from './contactsNavigator';

type ContactsProps = StackNavigationProp<ContactsRootStackParamList, 'Contact'>;

interface IProps extends ContactsProps {
  contacts: ContactModel[];
  wrongDoers: ContactModel[];
  nonWrongDoers: ContactModel[];
}

interface IState {
  contacts: IContact[];
}

class Contacts extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      contacts: [],
    };

    props.navigation.setOptions({
      headerShown: false,
    });

    // this.wrongers();

    function contactComparator(a: IContact, b: IContact): number {
      let familyNameComparison = a.familyName.localeCompare(b.familyName);
      if (familyNameComparison == 0) {
        return a.givenName.localeCompare(b.givenName);
      } else {
        return familyNameComparison;
      }
    }

    ContactsAPI.getAll().then((value: IContact[]) => {
      this.setState({contacts: value.sort(contactComparator)});
    });
  }

  componentWillUnmount() {
    // this.focusListner.remove();
  }

  get navigationProps(): any {
    return {navigation: this.props.navigation, route: this.props.route};
  }

  // async wrongers() {
  //   const result = await database.collections
  //     .get('contacts')
  //     .unsafeFetchRecordsWithSQL(
  //       `
  //     select *
  //     from contacts
  //     inner join (select * from payments where is_done = false) as payments
  //     on contacts.id = payments.contact_id
  //     `,
  //     );

  //   const hm = await database.collections
  //     .get('contacts')
  //     .query(
  //       Q.experimentalJoinTables(['payments']),
  //       Q.unsafeSqlExpr(`
  //         contacts.id = any (select contact_id from payments where is_done = false)
  //         `),
  //     )
  //     .fetch();

  //   this.setState({wrongDoers: result as ContactModel[]});
  // }

  static displayedName(contact: IContact): string {
    return contact.givenName + ' ' + contact.familyName;
  }

  modal() {
    if (this.props?.route?.params?.isModal)
      return (
        <BasicModalView
          px={0}
          py={0}
          disableScroll
          title="Контакты"
          left="Назад"
          onPressLeft={this.props.navigation.popToTop}
          right="Добавить"
          onPressRight={() => {
            ContactsAPI.openContactForm({}).then((contact) => {
              this.props?.route.params.onPress(contact);
              this.props?.navigation.dispatch(StackActions.popToTop());
            });
          }}>
          {this.base()}
        </BasicModalView>
      );
    return this.base();
  }

  base() {
    return (
      <BasicTab
        hideSelect //={this.props?.route?.params?.isModal}
        screens={[
          {
            title: 'Должники',
            screen: ContactsFiltered,
            props: {
              onPressInfo: this.props?.route?.params?.onPressInfo,
              contacts: this.state.contacts,
              model: true,
              onPress: this.props?.route?.params?.onPress,
              filter: (contact: IContact) =>
                this.props.wrongDoers
                  .filter(
                    (doer) =>
                      !this.props.nonWrongDoers.some(
                        (nonDoer) => nonDoer.recordID == doer.recordID,
                      ),
                  )
                  .some((model) => model.recordID == contact.recordID) &&
                (this.props?.route?.params?.filter?.(contact) ?? true),
              ...this.navigationProps,
            },
          },
          {
            title: 'Клиенты',
            screen: ContactsFiltered,
            props: {
              onPressInfo: this.props?.route?.params?.onPressInfo,
              contacts: this.state.contacts,
              model: true,
              onPress: this.props?.route?.params?.onPress,
              filter: (contact: IContact) =>
                this.props.contacts.some(
                  (model) => model.recordID == contact.recordID,
                ) &&
                (this.props?.route?.params?.filter?.(contact) ?? true),
              ...this.navigationProps,
            },
          },
          {
            title: 'Все',
            screen: ContactsFiltered,
            props: {
              onPressInfo: this.props?.route?.params?.onPressInfo,
              contacts: this.state.contacts,
              onPress: this.props?.route?.params?.onPress,
              render: Contacts.contactRender,
              filter: this.props?.route?.params?.filter,
            },
          },
        ]}
      />
    );
  }

  render() {
    return this.modal(); //(

    // <MainTabScreen
    //   isSettingsButtonVisible={
    //     this.props?.route?.params?.isSettingsButtonVisible ?? true
    //   }
    //   isProjectChooserVisible={false}
    //   screens={[
    //     {
    //       title: 'Должники',
    //       screen: ContactsFiltered,
    //       props: {
    //         contacts: this.state.contacts,
    //         model: true,
    //         onPress: this.props?.route?.params?.onPress,
    //         filter: (contact: IContact) =>
    //           this.props.wrongDoers
    //             .filter(
    //               (doer) =>
    //                 !this.props.nonWrongDoers.some(
    //                   (nonDoer) => nonDoer.recordID == doer.recordID,
    //                 ),
    //             )
    //             .some((model) => model.recordID == contact.recordID) &&
    //           (this.props?.route?.params?.filter?.(contact) ?? true),
    //         ...this.navigationProps,
    //       },
    //     },
    //     {
    //       title: 'Клиенты',
    //       screen: ContactsFiltered,
    //       props: {
    //         contacts: this.state.contacts,
    //         model: true,
    //         onPress: this.props?.route?.params?.onPress,
    //         filter: (contact: IContact) =>
    //           this.props.contacts.some(
    //             (model) => model.recordID == contact.recordID,
    //           ) &&
    //           (this.props?.route?.params?.filter?.(contact) ?? true),
    //         ...this.navigationProps,
    //       },
    //     },
    //     {
    //       title: 'Все',
    //       screen: ContactsFiltered,
    //       props: {
    //         contacts: this.state.contacts,
    //         onPress: this.props?.route?.params?.onPress,
    //         render: Contacts.contactRender,
    //         filter: this.props?.route?.params?.filter,
    //       },
    //     },
    //   ]}
    // />
    // );
  }
}

const enhanceWithEntries = withObservables([], () => ({
  contacts: Contact.collection.query(),
  wrongDoers: Contact.collection.query(
    Q.experimentalJoinTables(['payments', 'purchases', 'contact_sale']),
    Q.experimentalNestedJoin('contact_sale', 'sales'),
    Q.on(
      'payments',
      Q.and(
        Q.where('is_done', false),
        Q.or(
          Q.where('sale_id', null),
          Q.and(
            Q.where('sale_id', Q.notEq(null)),
            Q.on('contact_sale', Q.on('sales', 'is_done', true)),
          ),
        ),
      ),
    ),
  ),
  nonWrongDoers: Contact.collection.query(
    Q.experimentalJoinTables(['payments', 'purchases']),
    Q.on(
      'payments',
      Q.and(Q.where('is_done', false), Q.on('purchases', 'is_done', false)),
    ),
  ),
  unfinishedSalePayments: database
    .get('payments')
    .query(
      Q.experimentalJoinTables(['sales']),
      Q.and(Q.where('is_done', false), Q.on('sales', 'is_done', true)),
    ),
}));

Contacts.contextType = HeaderContext;

export default enhanceWithEntries(Contacts);
