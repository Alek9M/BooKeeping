import {StackScreenProps} from '@react-navigation/stack';
import {FlatList} from 'react-native';
import React, {Component} from 'react';
import {FabModalRootStackParamList} from './fabModal';
import SaleObject from '../../model/saleObject';
import {Button, Text} from 'react-native-magnus';
import HeaderButton from './customComponents/headerButton';
import PurchaseObject from '../../model/purchaseObject';
import BasicModal from './customComponents/basicModal';

type Props = StackScreenProps<FabModalRootStackParamList, 'ItemList'>;

interface IProps {}

interface IState {
  saleObjects: PurchaseObject[];
}

export default class ItemsList extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          title="Добавить"
          onPress={() =>
            this.props.navigation.navigate('ViewItem', {
              contacts: props.route.params.contacts,
              onAdd: props.route.params.onAdd,
            })
          }
        />
      ),
    });

    let purchase = new PurchaseObject();
    purchase.name = 'Орхидея';
    purchase.buyingPrice = 120;
    purchase.quantity = 15;
    purchase.sellingPrice = 130;

    this.state = {
      saleObjects: [purchase],
    };
  }

  render() {
    return (
      <BasicModal>
        <FlatList
          data={this.state.saleObjects}
          keyExtractor={(item, _index) => item.uuid}
          renderItem={(item) => (
            <Button
              bg="transparent"
              onPress={() =>
                this.props.navigation.navigate('ViewItem', {
                  contacts: this.props.route.params.contacts,
                  onAdd: this.props.route.params.onAdd,
                  item: item.item,
                })
              }>
              <Text>{item.item.name}</Text>
            </Button>
          )}
        />
      </BasicModal>
    );
  }
}
