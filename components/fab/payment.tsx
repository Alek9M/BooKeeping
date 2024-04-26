import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';

const Stack = createStackNavigator();

import {Div, Text} from 'react-native-magnus';
import SegmentedControl from '@react-native-community/segmented-control';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import ModalHeader from './customComponents/modalHeader';
import Input from './customComponents/TextInput';
import DatePickerRow from './customComponents/datePickerRow';
import CustomDropdown from './customComponents/customDropdown';
import BasicModal from './customComponents/basicModal';
import NamedButtonRow from './customComponents/namedButtonRow';
import HeaderButton from './customComponents/headerButton';

import Note from './note';
import NamedRow from './customComponents/customRow';
import ICalendar from '../../model/calendar';
import IContact from '../../model/contact';
import ProjectsPicker from './customComponents/projectsPicker';
import BudgetTag from '../../model/budgetTag';
import Calendar from '../../model/calendar';
import CPayment from '../../model/payment';
import {FabModalRootStackParamList} from './fabModal';
import withObservables from '@nozbe/with-observables';

interface IProps {
  onDone: () => void;
}

type Props = StackScreenProps<FabModalRootStackParamList, 'Payment'>;

interface IState {
  payment: CPayment;
}

export default class Payment extends Component<Props, IState> {
  // TODO: load tags
  categories = [
    {
      id: 1,
      name: 'Проезд',
    },
    {
      id: 2,
      name: 'Непредвиденное',
    },
  ];

  constructor(props: Props) {
    super(props);

    let payment: CPayment;

    if (props.route.params.payment) {
      payment = props.route.params.payment;
    } else if (props.route.params.project) {
      payment = new CPayment(props.route.params.project, {});
    } else {
      throw Error('Incorrect payment screen init');
    }

    this.state = {
      payment: payment,
    };

    payment.load().then(() => this.forceUpdate());
  }

  render() {
    this.props.navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButton
            title="Сохранить"
            disabled={!this.state.payment.isValid()}
            onPress={() => {
              this.state.payment
                .save()
                .then(() => this.props.route.params.onDone());
            }}
          />
        );
      },
    });

    return (
      <>
        <BasicModal>
          <Div px="md" pb="xl">
            <Input
              onChange={(text) =>
                this.setState((state, props) => {
                  const payment = state.payment;
                  payment.title = text;
                  return {payment: payment};
                })
              }
              textValue={this.state.payment.title}
              // TODO: disgusting, change
              placeholder="За что оплата"
            />
            <DatePickerRow
              day={this.state.payment.date}
              onDayChange={(day) =>
                this.setState((state, props) => {
                  const payment = state.payment;
                  payment.date = new Calendar(day);
                  return {payment: payment};
                })
              }
            />
            <SegmentedControl
              values={['Приход', 'Расход']}
              selectedIndex={this.state.payment.type}
              onChange={(event) => {
                const i = event.nativeEvent.selectedSegmentIndex;
                this.setState((state, props) => {
                  const payment = state.payment;
                  payment.type = i;
                  payment.tag = undefined;
                  return {payment: payment};
                });
              }}
              style={{
                marginTop: 8,
              }}
            />
            <NamedRow title="Сумма">
              <Input
                textValue={this.state.payment.totalAmount.toPrecision(2)}
                onChange={(text) =>
                  this.setState((state, props) => {
                    const payment = state.payment;
                    payment.totalAmount = Number(text);
                    return {payment: payment};
                  })
                }
                placeholder="0.00"
                type="money"
              />
            </NamedRow>
            <NamedButtonRow
              name="Контакт"
              buttonName={
                this.state.payment.contact
                  ? this.state.payment.contact.givenName +
                    ' ' +
                    this.state.payment.contact.familyName
                  : 'Выбрать'
              }
              onPress={() => {
                this.props.navigation.navigate('Contacts', {
                  onPress: (contact: IContact) =>
                    this.setState((state, props) => {
                      const payment = state.payment;
                      payment.contact = contact;
                      return {payment: payment};
                    }),
                });
              }}
            />
            <CustomDropdown
              // items={this.categories}
              placeholder="Категория"
              type={this.state.payment.type}
              year={this.state.payment.date.year}
              month={this.state.payment.date.month}
              currentProject={this.state.payment.project}
              // TODO: onSelect
              tag={this.state.payment.tag}
              onSelect={(selected: BudgetTag) => {
                this.setState((state, props) => {
                  const payment = state.payment;
                  payment.tag = selected;
                  return {payment: payment};
                });
              }}
            />
          </Div>
        </BasicModal>
      </>
    );
  }
}
