import SegmentedControl from '@react-native-community/segmented-control';
import {StackScreenProps} from '@react-navigation/stack';
import React, {Component} from 'react';
import {FlatList} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import SaleObject, {BuyerType} from '../../model/saleObject';
import BasicModal from './customComponents/basicModal';
import CustomCheckbox from './customComponents/customCheckbox';
import TextInput from './customComponents/TextInput';
import {FabModalRootStackParamList} from './fabModal';
import HeaderButton from './customComponents/headerButton';

type Props = StackScreenProps<FabModalRootStackParamList, 'ViewItem'>;

interface IProps {}

interface IState {
  selectedIndex: number;
  sale: SaleObject;
}

export default class ViewSaleItem extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          title="Добавить"
          onPress={() => props.route.params.onAdd(this.state.sale)}
        />
      ),
    });
    let saleObject = new SaleObject();
    if (props.route.params.item) {
      saleObject.title = props.route.params.item.name;
      if (props.route.params.item.sellingPrice) {
        saleObject.sellingPrice = props.route.params.item.sellingPrice;
      }
    }

    this.state = {
      selectedIndex: 0,
      sale: saleObject,
    };
  }

  setSale(
    field: 'title' | 'sellingPrice' | 'quantity' | 'discount',
    text: string,
  ) {
    this.setState((state, _props) => {
      let sale = state.sale;
      sale[field] = text;
      return {sale: sale};
    });
  }

  render() {
    return (
      <BasicModal>
        {this.props.route.params.item ? (
          <Text>{this.props.route.params.item.name}</Text>
        ) : (
          <TextInput
            placeholder="Название"
            textValue={this.state.sale.title}
            onChange={(text) => this.setSale('title', text)}
          />
        )}
        <Div row justifyContent="space-between">
          {this.props.route.params.item ? (
            <Div>
              <Text>Цена покупки</Text>
              <Text>{this.props.route.params.item.buyingPrice}</Text>
            </Div>
          ) : (
            <TextInput type="money" placeholder="Цена покупки" />
          )}
          <TextInput
            type="money"
            onChange={(text) => this.setSale('sellingPrice', text)}
            textValue={this.state.sale.sellingPrice}
            placeholder={
              this.props.route.params.item?.sellingPrice?.toString() ??
              'Цена продажи'
            }
          />
        </Div>
        <Div row justifyContent="space-between">
          <TextInput
            textValue={this.state.sale.quantity}
            onChange={(text) => this.setSale('quantity', text)}
            type="number"
            placeholder="Количество"
          />
          <TextInput
            textValue={this.state.sale.discount}
            onChange={(text) => this.setSale('discount', text)}
            type="number"
            placeholder="Скидка"
          />
        </Div>

        {this.props.route.params.contacts.length > 1 && (
          <SegmentedControl
            values={['На всех', 'Выбрать']}
            selectedIndex={this.state.sale.buyer.type}
            onChange={(event) => {
              const i = event.nativeEvent.selectedSegmentIndex;
              this.setState((state, props) => {
                let sale = state.sale;
                sale.buyer.type = i;
                return {sale: sale};
              });
            }}
            style={{
              marginTop: 8,
            }}
          />
        )}

        {this.state.sale.buyer.type != BuyerType.Single &&
          this.props.route.params.contacts.length > 1 && (
            <SegmentedControl
              values={['Каждому', 'Скинуться']}
              selectedIndex={this.state.sale.buyer.split}
              onChange={(event) => {
                const i = event.nativeEvent.selectedSegmentIndex;
                this.setState((state, props) => {
                  let sale = state.sale;
                  sale.buyer.split = i;
                  return {sale: sale};
                });
              }}
              style={{
                marginTop: 8,
              }}
            />
          )}

        {this.state.sale.buyer.type != BuyerType.All && (
          <FlatList
            data={this.props.route.params.contacts}
            keyExtractor={(contact) => contact.recordID}
            renderItem={(item) => (
              <CustomCheckbox
                title={item.item.givenName}
                onChecked={(checked) => {
                  this.setState((state, props) => {
                    let sale = state.sale;
                    checked
                      ? sale.addContact(item.item)
                      : sale.removeContact(item.item);
                    return {sale: sale};
                  });
                }}
              />
            )}
          />
        )}
      </BasicModal>
    );
  }
}
