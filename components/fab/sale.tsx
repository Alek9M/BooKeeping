import SegmentedControl from '@react-native-community/segmented-control';
import {StackScreenProps} from '@react-navigation/stack';
import React, {Component} from 'react';
import {FlatList} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import ICalendar from '../../model/calendar';
import IContact from '../../model/contact';
import Input from './customComponents/TextInput';
import SaleObject from '../../model/saleObject';
import HeaderButton from './customComponents/headerButton';
import BasicModal from './customComponents/basicModal';
import BoldButton from './customComponents/boldButton';
import CustomCheckbox from './customComponents/customCheckbox';
import NamedRow from './customComponents/customRow';
import DatePickerRow from './customComponents/datePickerRow';
import NamedButtonRow from './customComponents/namedButtonRow';
import SaleContactRow from './customComponents/saleContactRow';
import TextInput from './customComponents/TextInput';
import {FabModalRootStackParamList} from './fabModal';
import CSale, {SaleTypes} from '../../model/sale';
import Calendar from '../../model/calendar';

type Props = StackScreenProps<FabModalRootStackParamList, 'Sale'>;

interface IProps {}

interface IState {
  sale: CSale;
}

export default class Sale extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    let sale: CSale;

    if (props.route.params?.sale) {
      sale = props.route.params.sale;
    } else if (props.route.params?.project) {
      sale = new CSale(props.route.params.project, {});
    } else {
      throw Error('Incorrect payment screen init');
    }

    this.state = {
      sale: sale,
    };
  }

  componentDidUpdate() {
    this.props.navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButton
            title="Сохранить"
            disabled={!this.state.sale.isValid()}
            onPress={() => {
              this.state.sale
                .save()
                .then(() => this.props.route.params.onDone());
            }}
          />
        );
      },
    });
  }

  render() {
    return (
      <BasicModal>
        <Input
          placeholder="Название события"
          onChange={(text) =>
            this.setState((state, props) => {
              const sale = state.sale;
              sale.title = text;
              return {sale: sale};
            })
          }
        />
        <DatePickerRow
          day={this.state.sale.date}
          onDayChange={(day) =>
            this.setState((state, props) => {
              const sale = state.sale;
              sale.date = day;
              return {sale: sale};
            })
          }
        />
        <CustomCheckbox
          title="Отложенный платёж"
          isChecked={!!this.state.sale._delayedDate}
          onChecked={(checked) => {
            this.setState((state, props) => {
              const sale = state.sale;
              sale._delayedDate = checked ? new Calendar() : undefined;
              return {sale: sale};
            });
          }}
        />
        {this.state.sale._delayedDate && (
          <DatePickerRow
            title="Планируемая дата оплаты"
            day={this.state.sale._delayedDate}
            onDayChange={(day) =>
              this.setState((state, props) => {
                const sale = state.sale;
                sale._delayedDate = day;
                return {sale: sale};
              })
            }
          />
        )}
        {this.state.sale.contacts.length > 1 && (
          <SegmentedControl
            values={['Групповая', 'Индивидуальная']}
            selectedIndex={this.state.sale.type}
            onChange={(event) => {
              const i = event.nativeEvent.selectedSegmentIndex;
              this.setState((state, _props) => {
                const sale = state.sale;
                sale.type = i;
                return {sale: sale};
              });
            }}
            style={{
              marginTop: 8,
            }}
          />
        )}

        <FlatList
          data={this.state.sale.contacts}
          keyExtractor={(item, _index) => item.recordID}
          renderItem={(item) => (
            <SaleContactRow
              contact={item.item}
              items={this.state.sale.articles}
              contacts={this.state.sale.contacts}
            />
          )}
        />

        <FlatList
          data={this.state.sale.articles}
          keyExtractor={(item, _index) => item.uuid}
          renderItem={(item) => (
            <Div row justifyContent="space-between">
              <Text>{item.item.title}</Text>
              <Text>
                {item.item.outcoming[0].priceOut} /{' '}
                {this.state.sale.type == SaleTypes.Group
                  ? this.state.sale.contacts.length
                  : 1}
              </Text>
            </Div>
          )}
        />

        <BoldButton
          title="Добавить контакт"
          onPress={() => {
            this.props.navigation.navigate('Contacts', {
              onPress: (contact: IContact) => {
                this.setState((state, props) => {
                  let sale = state.sale;
                  sale.contacts.push(contact);
                  return {sale: sale};
                });
              },
            });
          }}
        />
        {this.state.sale.contacts.length > 0 && (
          <BoldButton
            title="Добавить позицию"
            onPress={() => {
              this.props.navigation.navigate('ItemList', {
                contacts: this.state.sale.contacts,
                onAdd: (item) => {
                  this.setState((state, props) => {
                    let sale = state.sale;
                    sale.articles.push(item);
                    return {sale: sale};
                  });
                  this.props.navigation.popToTop();
                },
              });
            }}
          />
        )}
        <NamedRow title="Сумма фактической оплаты">
          <Input
            type="money"
            onChange={(text) => {
              this.setState((state, props) => {
                const sale = state.sale;
                sale.totalAmount = Number(text);
                return {sale: sale};
              });
            }}
            placeholder={this.state.sale.articles
              .map((item) => item.incoming)
              .reduce((accum, current) => accum.concat(current), [])
              .map((item) => item.priceIn * item.quantity)
              .reduce((accum, current) => (accum += current), 0)
              .toString()}
          />
        </NamedRow>
      </BasicModal>
    );
  }
}
