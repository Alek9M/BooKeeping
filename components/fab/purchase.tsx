import React, {Component} from 'react';
import {FlatList} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {FabModalRootStackParamList} from './fabModal';

import {Checkbox, Text, Collapse, Button, Div} from 'react-native-magnus';

import BasicModal from './customComponents/basicModal';

import DatePickerRow from './customComponents/datePickerRow';
import Input from './customComponents/TextInput';
import NamedButtonRow from './customComponents/namedButtonRow';
import CustomDropdown from './customComponents/customDropdown';
import HeaderButton from './customComponents/headerButton';
import BoldButton from './customComponents/boldButton';
import NamedRow from './customComponents/customRow';
import PurchaseButtonRow from './customComponents/purchaseItemRow';
import PurchaseObject from '../../model/purchaseObject';
import ICalendar from '../../model/calendar';
import CustomCheckbox from './customComponents/customCheckbox';
import IContact from '../../model/contact';
import CPurchase from '../../model/purchase';
import Calendar from '../../model/calendar';
import BudgetTag from '../../model/budgetTag';
import Article from '../../model/article';

type Props = StackScreenProps<FabModalRootStackParamList, 'Purchase'>;

interface IProps {}

interface IState {
  purchase: CPurchase;
}

export default class Purchase extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    let purchase: CPurchase;

    if (props.route.params.purchase) {
      purchase = props.route.params.purchase;
    } else if (props.route.params.project) {
      purchase = new CPurchase(props.route.params.project, {});
    } else {
      throw Error('Incorrect payment screen init');
    }

    this.state = {
      purchase: purchase,
    };
  }

  componentDidUpdate() {
    this.props.navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButton
            title="Сохранить"
            disabled={!this.state.purchase.isValid()}
            onPress={() => {
              this.state.purchase
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
              const purchase = state.purchase;
              purchase.title = text;
              return {purchase: purchase};
            })
          }
        />
        <DatePickerRow
          day={this.state.purchase.date}
          onDayChange={(day) =>
            this.setState((state, props) => {
              const purchase = state.purchase;
              purchase.date = day;
              return {purchase: purchase};
            })
          }
        />
        <CustomCheckbox
          title="Отложенный платёж"
          isChecked={!!this.state.purchase.delayedDate}
          onChecked={(checked) => {
            this.setState((state, props) => {
              const purchase = state.purchase;
              purchase.delayedDate = checked ? new Calendar() : undefined;
              return {purchase: purchase};
            });
          }}
        />
        {this.state.purchase.delayedDate && (
          <DatePickerRow
            title="Планируемая дата оплаты"
            day={this.state.purchase.delayedDate}
            onDayChange={(day) =>
              this.setState((state, props) => {
                const purchase = state.purchase;
                purchase.delayedDate = day;
                return {purchase: purchase};
              })
            }
          />
        )}
        <NamedButtonRow
          name="Контакт"
          buttonName={
            this.state.purchase.contact
              ? this.state.purchase.contact.givenName +
                ' ' +
                this.state.purchase.contact.familyName
              : 'Выбрать'
          }
          onPress={() => {
            this.props.navigation.navigate('Contacts', {
              onPress: (contact: IContact) =>
                this.setState((state, props) => {
                  const purchase = state.purchase;
                  purchase.contact = contact;
                  return {purchase: purchase};
                }),
            });
          }}
        />

        <CustomDropdown
          // items={this.categories}
          placeholder="Категория"
          type={1}
          year={this.state.purchase.date.year}
          month={this.state.purchase.date.month}
          currentProject={this.state.purchase.project}
          // TODO: onSelect
          tag={this.state.purchase.tag}
          onSelect={(selected: BudgetTag) => {
            this.setState((state, props) => {
              const purchase = state.purchase;
              purchase.tag = selected;
              return {purchase: purchase};
            });
          }}
        />

        <FlatList
          data={this.state.purchase.articles
            .map((item) => item.incoming)
            .reduce((accum, current) => accum.concat(current), [])}
          keyExtractor={(item) => item.uuid}
          renderItem={(item) => (
            <PurchaseButtonRow
              item={item.item}
              onPress={() => {
                this.props.navigation.navigate('AddItemForm', {
                  onAdd: (item: Article) => {
                    // this.setState((state, props) => {
                    //   let purchase = state.purchase;
                    //   let i = purchase.articles.findIndex(article => article.uuid == item.uuid)
                    //   purchase = purchase.articles.filter(
                    //     (itemed, index) => !itemed.equals(item),
                    //   );
                    //   purchase.push(item);
                    //   return {purchase: purchase};
                    // });
                  },
                  item: item.item.article,
                });
              }}
            />
          )}
        />
        <NamedRow title="Сумма фактической оплаты">
          <Input
            type="money"
            onChange={(text) => {
              this.setState((state, props) => {
                const purchase = state.purchase;
                purchase.totalAmount = Number(text);
                return {purchase: purchase};
              });
            }}
            placeholder={this.state.purchase.articles
              .map((item) => item.incoming)
              .reduce((accum, current) => accum.concat(current), [])
              .map((item) => item.priceIn * item.quantity)
              .reduce((accum, current) => (accum += current), 0)
              .toString()}
          />
        </NamedRow>
        <BoldButton
          title="Добавить позицию"
          onPress={() => {
            this.props.navigation.navigate('AddItemForm', {
              onAdd: (item: Article) => {
                this.setState((state, props) => {
                  let purchase = state.purchase;
                  let i = purchase.articles.findIndex(
                    (article) => article.title == item.title,
                  );
                  if (i >= 0) {
                    item.incoming.forEach((inc) =>
                      purchase.articles[i].incoming.push(inc),
                    );
                  } else {
                    purchase.articles.push(item);
                  }
                  return {purchase: purchase};
                });
              },
            });
          }}
        />
      </BasicModal>
    );
  }
}
