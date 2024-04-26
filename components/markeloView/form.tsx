import React, {Component} from 'react';
import {FlatList, TextInput} from 'react-native';
import {Div, Text, ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../App';
import Article, {ArticleIn, ArticleOut} from '../../model/article';
import {BillableModelable} from '../../model/billableModelable';
import {Contact} from '../../model/contact';
import {Service} from '../../model/service';
import {ServiceExecution} from '../../model/serviceExecution';
import CustomCheckbox from '../fab/customComponents/customCheckbox';
import NamedRow from '../fab/customComponents/customRow';
import BasicModalView from './basicViews/basicModalView';
import BasicSeparator from './basicViews/basicSeparator';
import BasicRectangleRow from './elements/basicRectangleRow';
import BasicRectangleView from './elements/basicRectangleView';
import Checkbox from './elements/checkbox';
import NumberTextInput from './elements/numberTextInput';
import PostfixInput from './elements/postfixInput';
import RoundSelector from './elements/roundSelector';
import TextInputRow from './elements/textInputRow';
import {barCode} from './icons/fab/svg';
import RectangleList from './RectangleList';

interface IProps {
  item?: Article | Service;
  onAdd: (article: Article) => void;
}

interface IState {
  item: Article;
}

export default class Form extends Component<IProps, IState> {
  forSale: boolean;
  constructor(props: IProps) {
    super(props);

    this.props.navigation.setOptions({
      headerShown: false,
    });

    this.forSale = this.props.route.name == 'SaleItemForm';

    // * Sale
    let item = props.route.params.item;
    if (this.forSale) {
      if (item?.outcoming?.length == 0)
        item.outcoming.push(
          item instanceof Article
            ? new ArticleOut(item, {})
            : new ServiceExecution(item, {}),
        );
      if (props.route.params.contact) {
        item.outcoming.forEach((out: BillableModelable) => {
          out.addContact(props.route.params.contact, true);
          out.everyone = false;
          out.split = false;
        });
      }

      if (item?.outcoming[0].everyone) {
        item.outcoming[0].contacts = props.route.params.contacts;
      }
    }

    // Sale *
    const article = new Article({});
    article.incoming.push(new ArticleIn(article, {}));

    this.state = {
      item: item ?? article,
    };
  }

  aPriceIn(ins: ArticleIn[] | undefined): number | undefined {
    if (!ins) return undefined;
    return ins.reduce((acc, next) => (acc += next.priceIn), 0) / ins.length;
  }

  getTheOldestNotEmptyIn(quantity?: number): ArticleIn[] | undefined {
    // TODO: fix for service
    if (!(this.state.item instanceof Article)) return;
    let selling =
      quantity ??
      this.state.item.outcoming.reduce(
        (acc, next) => (acc += next.quantity),
        0,
      );
    let result = [];
    for (const inc of this.state.item.incoming) {
      if (inc.left > 0) {
        if (selling <= inc.left) {
          result.push(inc);
          return result;
        } else {
          selling -= inc.left;
          result.push(inc);
        }
      }
    }
    return undefined;
  }

  setOutQuantity(quantity: number) {
    if (this.state.item instanceof Service)
      this.setState((state, _props) => {
        let item = state.item;
        if (item.outcoming[0].split) {
          item.outcoming[0].quantity = quantity;
        } else {
          item.outcoming[0]._quantity = quantity;
        }
        return {item: item};
      });
    else
      this.setState((state, _props) => {
        let item = state.item;
        let left = quantity;
        let using = this.getTheOldestNotEmptyIn(quantity);
        if (!using) {
          item.outcoming[0].quantity = quantity;
          return {item: item};
        }
        let prev = item.outcoming[0];
        if (using.length == 1) {
          let out = new ArticleOut(item, {articleOut: prev}, using[0]);
          out.quantity = quantity;
          item.outcoming = [out];
        } else {
          item.outcoming = [];
          for (const use of using) {
            let artOut = new ArticleOut(item, {articleOut: prev}, use);
            artOut.quantity = use.left <= left ? use.left : left;
            left -= artOut.quantity;
            item.outcoming.push(artOut);
          }
        }

        return {item: item};
      });
  }

  getOutSum(): number {
    if (this.state.item instanceof Service)
      return this.state.item.outcoming[0].sum;
    return this.state.item.outcoming.reduce((acc, next) => {
      const nextCopy = next;
      if (nextCopy.priceOut == 0)
        nextCopy.priceOut = nextCopy.source?.suggestedPriceOut ?? 0;
      return acc + next.sum;
    }, 0);
  }

  text(text: string): Text {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <Text
          style={{
            fontFamily: MarkelovTheme.fontFamily.Regular400,
            fontSize: MarkelovTheme.fontSize.M,
            lineHeight: 14,
            color: '#444D56',
          }}>
          {text}
        </Text>
      </ThemeProvider>
    );
  }

  textSemiBold(text: string) {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <Text
          style={{
            fontFamily: MarkelovTheme.fontFamily.SemiBold600,
            fontSize: MarkelovTheme.fontSize.M,
            lineHeight: 15,
            color: '#444D56',
          }}>
          {text}
        </Text>
      </ThemeProvider>
    );
  }

  namedInputRow(
    title: string,
    postfix: string,
    placeholder: string,
    value: number,
    onChange: (text: number) => void,
    limit?: number,
  ) {
    return (
      <Div row justifyContent="space-between">
        {this.text(title)}
        {/* <PostfixInput
          postfix={postfix}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        /> */}
        <NumberTextInput
          postfix={postfix}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          limit={limit}
        />
        {/* {this.postfixInput(postfix, placeholder, value, onChange)} */}
      </Div>
    );
  }

  postfixInput(
    postfix: string,
    placeholder: string,
    value: number,
    onChange: (value: number) => void,
    disabled: boolean = false,
  ) {
    return (
      <Div row pl={12}>
        {/* <TextInput
          editable={!disabled}
          style={{
            fontFamily: MarkelovTheme.fontFamily.SemiBold600,
            fontSize: MarkelovTheme.fontSize.M,
            lineHeight: 15,
            color: '#444D56',
            minWidth: 20,
            textAlign: 'right',
          }}
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
        />
        {this.textSemiBold(postfix)} */}
        <NumberTextInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          postfix={postfix}
          disabled={disabled}
        />
      </Div>
    );
  }

  title() {
    return (
      <TextInputRow
        mb={0}
        disabled={this.forSale}
        value={this.state.item.title}
        placeholder="Название"
        onChangeText={(text) => {
          this.setState((state, _props) => {
            let item = state.item;
            item.title = text;
            return {item: item};
          });
        }}
      />
    );
  }

  priceIn() {
    if (this.state.item instanceof Service) return;
    const price = !this.forSale
      ? this.state.item?.incoming[0].priceIn
      : this.aPriceIn(this.getTheOldestNotEmptyIn());
    return (
      <BasicRectangleRow text="Цена покупки:">
        {/* {this.postfixInput(
          '₽',
          '',
          price != 0 ? price?.toString?.() ?? '' : '',
          (text) => {
            this.setState((state, _props) => {
              let item = state.item;
              item.incoming[0].priceIn = Number(text);
              return {item: item};
            });
          },
          this.forSale,
        )} */}
        <NumberTextInput
          onChange={(text: number) => {
            this.setState((state, _props) => {
              let item = state.item;
              item.incoming[0].priceIn = text;
              return {item: item};
            });
          }}
          value={price}
          postfix={'₽'}
        />
      </BasicRectangleRow>
    );
  }

  barCode() {
    if (this.forSale) return;
    return (
      <BasicRectangleRow text="Добавить штрих-код">
        {barCode({})}
      </BasicRectangleRow>
    );
  }

  profitRow() {
    if (this.state.item instanceof Service) return;
    if (
      !this.state.item.incoming[0].suggestedPriceOut ||
      !this.state.item?.incoming[0].priceIn
    )
      return;
    const profit =
      this.state.item.incoming[0].suggestedPriceOut -
      this.state.item?.incoming[0].priceIn;
    const profitP = (profit / this.state.item?.incoming[0].priceIn) * 100;
    return (
      <Div row justifyContent="space-between" mt={16}>
        {this.text('Прибыль:')}
        <Div row>
          {/* // TODO: make profit changes change something */}
          {this.postfixInput('₽', '0', profit, () => {})}
          {this.postfixInput('%', '0', profitP, () => {})}
        </Div>
      </Div>
    );
  }

  priceOutNProfit() {
    const priceOut =
      this.state.item instanceof Service
        ? this.state.item.priceOut
        : this.state.item.outcoming[0]?.priceOut > 0
        ? this.state.item.outcoming[0].priceOut
        : this.state.item.incoming[0].suggestedPriceOut;

    const onChange = this.forSale
      ? (text: number) => {
          // FIXME: doesn't change sale price for article
          this.setState((state, _props) => {
            let item = state.item as Article;
            item.outcoming.forEach((out) => (out.priceOut = text));
            return {item: item};
          });
        }
      : (text: number) => {
          this.setState((state, _props) => {
            let item = state.item;
            item.incoming[0].suggestedPriceOut = text;
            return {item: item};
          });
        };
    return (
      <BasicRectangleView>
        {this.namedInputRow('Цена продажи:', '₽', '0', priceOut ?? 0, onChange)}

        {this.profitRow()}
      </BasicRectangleView>
    );
  }

  quantityNSum() {
    const quantity = this.forSale
      ? this.state.item.outcoming[0]?.quantity ?? 0
      : this.props.route.params.item?.incoming[0]?.quantity ??
        this.state.item.incoming[0].quantity;

    const onChange = this.forSale
      ? (text: number) => this.setOutQuantity(text)
      : (text: number) => {
          this.setState((state, _props) => {
            let item = state.item;
            item.incoming[0].quantity = text;
            return {item: item};
          });
        };

    const sum = this.forSale
      ? this.getOutSum()
      : this.state.item.incoming[0].sum;

    return (
      <BasicRectangleView>
        {this.namedInputRow('Количество:', '', '0', quantity, onChange, 0)}
        {/* // TODO: make sum changes change something */}
        {!this.state.item.outcoming[0].split && (
          <Div mt={16}>
            {this.namedInputRow(
              'Количество на каждого:',
              '',
              '0',
              quantity / this.state.item.outcoming[0].contacts.length,
              (perCustomer) => {
                onChange(
                  perCustomer * this.state.item.outcoming[0].contacts.length,
                );
              },
            )}
          </Div>
        )}
        <Div mt={16}>
          {this.namedInputRow('Сумма:', '₽', '0', sum, (text) => {})}
        </Div>
      </BasicRectangleView>
    );
  }

  discount() {
    if (!this.forSale) return;
    return (
      <BasicRectangleRow text="Скидка:">
        {this.postfixInput(
          '%',
          '0',
          this.state.item.outcoming[0]?.discount ?? 0,
          (text) => {
            this.setState((state, _props) => {
              let item = state.item;
              item.outcoming[0].discount = text;
              return {item: item};
            });
          },
        )}
      </BasicRectangleRow>
    );
  }

  allSelector() {
    if (!this.forSale || this.props.route.params.contacts.length <= 1) return;
    return (
      <RoundSelector
        values={['Выбрать', 'На всех']}
        selectedIndex={+this.state.item.outcoming[0].everyone}
        onChange={(index) => {
          this.setState((state, props) => {
            let item = state.item;
            if (Boolean(index) != item.outcoming[0].everyone) {
              if (Boolean(index)) {
                item.outcoming.forEach(
                  (out) => (out.contacts = props.route.params.contacts),
                );
              } else {
                item.outcoming.forEach((out) => (out.contacts = []));
              }
            }
            item.outcoming.forEach((out) => (out.everyone = Boolean(index)));
            return {item: item};
          });
        }}
      />
    );
  }
  eachSelector() {
    if (!this.forSale || this.props.route.params.contacts.length <= 1) return;
    return (
      <RoundSelector
        values={['Каждому', 'Скинуться']}
        selectedIndex={+this.state.item.outcoming[0].split}
        onChange={(index) => {
          this.setState((state, props) => {
            let item = state.item;
            item.outcoming.forEach((out) => (out.split = Boolean(index)));
            return {item: item};
          });
        }}
      />
    );
  }

  list() {
    if (!this.forSale || this.state.item.outcoming[0].everyone) return;
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <RectangleList
          title="Выберите кому"
          data={this.props.route.params.contacts}
          renderItem={(listItem) => (
            <Div row mt={10}>
              <Checkbox
                checked={this.state.item.outcoming[0].contacts.some(
                  (con) => con.recordID == listItem.item.recordID,
                )}
                onCheck={(checked) => {
                  this.setState((state, props) => {
                    let item = state.item;
                    checked
                      ? item.outcoming.forEach((out) =>
                          out.addContact(listItem.item, true),
                        )
                      : item.outcoming.forEach((out) =>
                          out.removeContact(listItem.item),
                        );
                    return {item: item};
                  });
                }}
              />
              <Div
                row
                ml={10}
                flex={1}
                alignItems="center"
                justifyContent="space-between">
                <Text
                  fontSize="M"
                  lineHeight={14}
                  fontFamily={MarkelovTheme.fontFamily.Regular400}
                  color="#444D56">
                  {Contact.displayedName(listItem.item)}
                </Text>
                {/* // TODO: add cost per person */}
                {this.state.item.outcoming[0].contacts.some(
                  (con) => con.recordID == listItem.item.recordID,
                ) && (
                  <Text
                    fontSize="S"
                    lineHeight={12}
                    fontFamily={MarkelovTheme.fontFamily.Regular400}
                    // or #45B600 for green
                    color="#444D56">
                    {}12.000₽
                  </Text>
                )}
              </Div>
            </Div>
          )}
        />
      </ThemeProvider>
    );
  }

  render() {
    return (
      <BasicModalView
        title="Формирование"
        left="Отменить"
        onPressLeft={() => this.props.navigation.pop()}
        right="Сохранить"
        onPressRight={() => {
          this.props.route.params.onAdd(this.state.item);
          this.props.navigation.popToTop();
        }}>
        <BasicSeparator vertical={12}>
          <Div />
          {this.title()}
          {this.barCode()}
          {this.priceIn()}
          {this.priceOutNProfit()}
          {this.quantityNSum()}
          {this.discount()}
          {this.allSelector()}
          {this.eachSelector()}
          {this.list()}
        </BasicSeparator>
      </BasicModalView>
    );
  }
}

// react-native-fs
