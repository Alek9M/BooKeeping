import {StackScreenProps} from '@react-navigation/stack';
import React, {Component} from 'react';

import {Div, Text} from 'react-native-magnus';

import HeaderButton from './customComponents/headerButton';
import BasicModal from './customComponents/basicModal';
import TextInput from './customComponents/TextInput';
import {FabModalRootStackParamList} from './fabModal';
import CustomDropdown from './customComponents/customDropdown';
import NamedRow from './customComponents/customRow';
import PurchaseObject from '../../model/purchaseObject';
import Article, {ArticleIn} from '../../model/article';

type Props = StackScreenProps<FabModalRootStackParamList, 'AddItemForm'>;

interface IProps {
  item?: Article;
  onAdd: (article: Article) => void;
}

interface IState {
  item: Article;
}

export default class AddItemForm extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    this
      .setHeaderButtonDisabled
      // !props.route.params.item?.isCompleted() ?? false,
      ();

    const article = new Article({});
    article.incoming.push(new ArticleIn(article, {}));

    this.state = {
      item: props.route.params.item ?? article,
    };
  }

  setHeaderButtonDisabled() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          title="Добавить"
          onPress={() => {
            this.props.route.params.onAdd(this.state.item);
            this.props.navigation.popToTop();
          }}
          // disabled={isDisabled}
        />
      ),
    });
  }

  render() {
    return (
      <BasicModal>
        {/* // TODO: load existing items */}
        {/* <CustomDropdown
          placeholder="Название"
          items={[]}
          onItemAdded={(text: string) => {
            this.setState((state, _props) => {
              let item = state.item;
              item.name = text;
              this.setHeaderButtonDisabled(!item.isCompleted());
              return {item: item};
            });
          }}
          onSelect={(selected: string) => {
            this.setState((state, _props) => {
              let item = state.item;
              item.name = selected;
              this.setHeaderButtonDisabled(!item.isCompleted());
              return {item: item};
            });
          }}
        /> */}
        <TextInput
          placeholder="Название"
          textValue={this.state.item.title}
          onChange={(text) => {
            this.setState((state, _props) => {
              let item = state.item;
              item.title = text;
              return {item: item};
            });
          }}
        />
        <TextInput
          type="money"
          placeholder="Цена покупки"
          textValue={this.props.route.params.item?.incoming[0].priceIn.toString()}
          onChange={(text) => {
            this.setState((state, _props) => {
              let item = state.item;
              item.incoming[0].priceIn = Number(text);
              return {item: item};
            });
          }}
        />
        <TextInput
          type="money"
          placeholder="Цена продажи"
          textValue={this.state.item.incoming[0].suggestedPriceOut?.toString()}
          onChange={(text) => {
            this.setState((state, _props) => {
              let item = state.item;
              item.incoming[0].suggestedPriceOut = Number(text);
              return {item: item};
            });
          }}
        />
        <TextInput
          type="number"
          placeholder="Количество"
          textValue={this.props.route.params.item?.incoming[0].quantity.toString()}
          onChange={(text) => {
            this.setState((state, _props) => {
              let item = state.item;
              item.incoming[0].quantity = Number(text);
              return {item: item};
            });
          }}
        />
        <NamedRow title="Сумма">
          <Text style={{fontWeight: 'bold'}} fontSize="xl" color="blue700">
            {this.state.item.incoming[0].sum}₽
          </Text>
        </NamedRow>
      </BasicModal>
    );
  }
}
