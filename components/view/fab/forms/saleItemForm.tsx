import React, {Component} from 'react';
import {FlatList, TextInput} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
//
import {Div, Text} from 'react-native-magnus';
import SegmentedControl from '@react-native-community/segmented-control';
//
import Article, {ArticleIn, ArticleOut} from '../../../../model/article';
import {Service} from '../../../../model/service';
// import BasicModal from '../../../fab/customComponents/basicModal';
import NamedRow from '../../../fab/customComponents/customRow';
// import TextInput from '../../../fab/customComponents/TextInput';
import {FabModalRootStackParamList} from '../entryModalNavigator';
import HeaderButton from '../../../fab/customComponents/headerButton';
import CustomCheckbox from '../../../fab/customComponents/customCheckbox';
import {ServiceExecution} from '../../../../model/serviceExecution';
import RoundSelector from '../../../markeloView/elements/roundSelector';
import TextInputRow from '../../../markeloView/elements/textInputRow';
import BasicRectangleRow from '../../../markeloView/elements/basicRectangleRow';
import BasicRectangleView from '../../../markeloView/elements/basicRectangleView';
import BasicModalView from '../../../markeloView/basicViews/basicModalView';
import BasicSeparator from '../../../markeloView/basicViews/basicSeparator';
// import BasicModal from './customComponents/basicModal';
// import TextInput from './customComponents/TextInput';
// import {FabModalRootStackParamList} from './fabModal';
// import CustomDropdown from './customComponents/customDropdown';
// import NamedRow from './customComponents/customRow';
// import PurchaseObject from '../../model/purchaseObject';
// import Article, {ArticleIn} from '../../model/article';

type Props = StackScreenProps<FabModalRootStackParamList, 'SaleItemForm'>;

type Item = Article | Service;

interface IProps {
  item?: Item;
  onAdd: (item: Item) => void;
}

interface IState {
  item: Item;
}

export default class SaleItemForm extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    this.setHeaderButtonDisabled(
      false, //!props.route.params.item?.isCompleted() ?? false,
    );

    let item = props.route.params.item;
    if (item.outcoming.length == 0)
      item.outcoming.push(
        item instanceof Article
          ? new ArticleOut(item, {})
          : new ServiceExecution(item, {}),
      );

    if (item.outcoming[0].everyone) {
      item.outcoming[0].contacts = props.route.params.contacts;
    }
    this.state = {
      item: item,
    };
  }

  setHeaderButtonDisabled(isDisabled: boolean) {
    this.props.navigation.setOptions({
      headerShown: false,
      // headerRight: () => (
      //   <HeaderButton
      //     title="Добавить"
      //     onPress={() => {
      //       this.props.route?.params?.onAdd(this.state.item);
      //       this.props.navigation.popToTop();
      //     }}
      //     // disabled={isDisabled}
      //   />
      // ),
    });
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
        item.outcoming[0].quantity = quantity;
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

  aField(ins: ArticleIn[] | undefined, field: string): number | undefined {
    if (!ins) return undefined;
    return ins.reduce((acc, next) => (acc += next[field]), 0) / ins.length;
  }

  aPriceIn(ins: ArticleIn[] | undefined): number | undefined {
    if (!ins) return undefined;
    return ins.reduce((acc, next) => (acc += next.priceIn), 0) / ins.length;
  }

  aSuggestedPriceOut(ins: ArticleIn[] | undefined): number | undefined {
    return this.aField(ins, 'suggestedPriceOut');
  }

  text(text: string): Text {
    return (
      <Text
        style={{
          fontFamily: 'Inter',
          fontSize: 14,
          lineHeight: 14,
          color: '#444D56',
        }}>
        {text}
      </Text>
    );
  }
  render() {
    return (
      <BasicModalView
        title="Формировка"
        right="Добавить"
        onPressRight={() => {
          this.props.route?.params?.onAdd(this.state.item);
          this.props.navigation.popToTop();
        }}
        left="Отменить"
        onPressLeft={() => this.props.navigation.pop()}>
        <BasicSeparator vertical={12}>
          {this.state.item instanceof Article &&
            this.state.item.model == undefined && (
              <TextInputRow
                mb={0}
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

              // <TextInput
              //   placeholder="Название"
              //   textValue={this.state.item.title}
              //   onChange={(text) => {
              //     this.setState((state, _props) => {
              //       let item = state.item;
              //       item.title = text;
              //       return {item: item};
              //     });
              //   }}
              // />
            )}
          {!(
            this.state.item instanceof Article &&
            this.state.item.model == undefined
          ) && (
            <Div h={50}>
              <TextInputRow
                mb={0}
                value={this.state.item.title}
                disabled
                placeholder={this.state.item.title}
                onChangeText={() => {}}
              />
            </Div>
          )}

          {this.state.item instanceof Article && (
            <NamedRow title="Цена покупки">
              <Text style={{fontWeight: 'bold'}} fontSize="xl" color="blue700">
                {this.aPriceIn(this.getTheOldestNotEmptyIn())}₽
              </Text>
            </NamedRow>
          )}

          {this.state.item instanceof Article && (
            <TextInput
              type="money"
              placeholder={
                this.aSuggestedPriceOut(
                  this.getTheOldestNotEmptyIn(),
                )?.toString() ?? 'Цена продажи'
              }
              textValue={this.state.item.outcoming[0]?.priceOut.toString() ?? 0}
              onChange={(text) => {
                this.setState((state, _props) => {
                  let item = state.item as Article;
                  item.outcoming.forEach(
                    (out) => (out.priceOut = Number(text)),
                  );
                  return {item: item};
                });
              }}
            />
          )}
          {this.state.item instanceof Service && (
            <BasicRectangleView>
              <Div row justifyContent="space-between">
                {this.text('Цена продажи')}
                <Div row>
                  <TextInput
                    placeholder="1"
                    value={this.state.item.lastPrice.toString()}
                    onChange={(text) => {
                      // TODO: make it work b
                      // this.setOutQuantity(Number(text));
                      // this.setState((state, _props) => {
                      //   let item = state.item;
                      //   const quantity = Number(text);
                      //   item.outcoming[0].quantity = quantity;
                      //   return {item: item};
                      // });
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: 'Inter-SemiBold',
                      fontSize: 14,
                      lineHeight: 15,
                      color: '#444D56',
                    }}>
                    ₽
                  </Text>
                </Div>
              </Div>
            </BasicRectangleView>
            // <NamedRow title="Цена продажи">
            //   <Text style={{fontWeight: 'bold'}} fontSize="xl" color="blue700">
            //     {this.state.item.lastPrice}₽
            //   </Text>
            // </NamedRow>
          )}

          <BasicRectangleRow text="Скидка">
            <Div row>
              <TextInput
                style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: 14,
                  lineHeight: 15,
                  color: '#444D56',
                }}
                value={this.state.item.outcoming[0]?.discount.toString() ?? 0}
                onChange={(text) => {
                  this.setState((state, _props) => {
                    let item = state.item;
                    item.outcoming[0].discount = Number(text);
                    return {item: item};
                  });
                }}
                placeholder="0"
                // type="money"
              />
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: 14,
                  lineHeight: 15,
                  color: '#444D56',
                }}>
                %
              </Text>
            </Div>
          </BasicRectangleRow>
          {/* <TextInput
          type="number"
          placeholder="Скидка"
          textValue={this.state.item.outcoming[0]?.discount.toString() ?? 0}
          onChange={(text) => {
            this.setState((state, _props) => {
              let item = state.item;
              item.outcoming[0].discount = Number(text);
              return {item: item};
            });
          }}
        /> */}
          <BasicRectangleView>
            <Div row justifyContent="space-between">
              {this.text('Количество')}
              <TextInput
                placeholder="1"
                value={this.state.item.outcoming[0]?.quantity.toString() ?? 0}
                onChange={(text) => {
                  this.setOutQuantity(Number(text));
                  // this.setState((state, _props) => {
                  //   let item = state.item;
                  //   const quantity = Number(text);
                  //   item.outcoming[0].quantity = quantity;
                  //   return {item: item};
                  // });
                }}
              />
            </Div>
            {/* {!this.state.item.outcoming[0].split && (
              <Div row justifyContent="space-between">
                {this.text('Количество каждому')}
                <TextInput
                  placeholder="1"
                  value={
                    (
                      this.state.item.outcoming[0]?.quantity /
                      this.state.item.outcoming[0]?.contacts.length
                    ).toString() ?? 0
                  }
                  onChange={(text) => {
                    this.setOutQuantity(Number(text));
                    // this.setState((state, _props) => {
                    //   let item = state.item;
                    //   const quantity = Number(text);
                    //   item.outcoming[0].quantity = quantity;
                    //   return {item: item};
                    // });
                  }}
                />
              </Div>
            )} */}
            <Div row justifyContent="space-between" mt={16}>
              {this.text('Сумма')}
              <Div row>
                <TextInput
                  placeholder="1"
                  value={this.getOutSum().toString()}
                  onChange={(text) => {
                    // TODO: make it work b
                    // this.setOutQuantity(Number(text));
                    // this.setState((state, _props) => {
                    //   let item = state.item;
                    //   const quantity = Number(text);
                    //   item.outcoming[0].quantity = quantity;
                    //   return {item: item};
                    // });
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'Inter-SemiBold',
                    fontSize: 14,
                    lineHeight: 15,
                    color: '#444D56',
                  }}>
                  ₽
                </Text>
              </Div>
            </Div>
          </BasicRectangleView>

          {this.props.route.params.contacts.length > 1 && (
            <>
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
                    item.outcoming.forEach(
                      (out) => (out.everyone = Boolean(index)),
                    );
                    return {item: item};
                  });
                }}
              />
              {/* <SegmentedControl
              values={['Выбрать', 'На всех']}
              selectedIndex={+this.state.item.outcoming[0].everyone}
              onChange={(event) => {
                const i = event.nativeEvent.selectedSegmentIndex;
                this.setState((state, props) => {
                  let item = state.item;
                  if (Boolean(i) != item.outcoming[0].everyone) {
                    if (Boolean(i)) {
                      item.outcoming.forEach(
                        (out) => (out.contacts = props.route.params.contacts),
                      );
                    } else {
                      item.outcoming.forEach((out) => (out.contacts = []));
                    }
                  }
                  item.outcoming.forEach((out) => (out.everyone = Boolean(i)));
                  return {item: item};
                });
              }}
              style={{
                marginTop: 8,
              }}
            /> */}
              <RoundSelector
                values={['Каждому', 'Скинуться']}
                selectedIndex={+this.state.item.outcoming[0].split}
                onChange={(index) => {
                  this.setState((state, props) => {
                    let item = state.item;
                    item.outcoming.forEach(
                      (out) => (out.split = Boolean(index)),
                    );
                    return {item: item};
                  });
                }}
              />
              {/* <SegmentedControl
              values={['Каждому', 'Скинуться']}
              selectedIndex={+this.state.item.outcoming[0].split}
              onChange={(event) => {
                const i = event.nativeEvent.selectedSegmentIndex;
                this.setState((state, props) => {
                  let item = state.item;
                  item.outcoming.forEach((out) => (out.split = Boolean(i)));
                  return {item: item};
                });
              }}
              style={{
                marginTop: 8,
              }}
            /> */}
            </>
          )}

          {!this.state.item.outcoming[0].everyone && (
            <FlatList
              data={this.props.route.params.contacts}
              keyExtractor={(contact) => contact.recordID}
              renderItem={(listItem) => (
                <CustomCheckbox
                  title={listItem.item.givenName}
                  isChecked={this.state.item.outcoming[0].contacts.some(
                    (con) => con.recordID == listItem.item.recordID,
                  )}
                  onChecked={(checked) => {
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
              )}
            />
          )}
        </BasicSeparator>
      </BasicModalView>
    );
  }
}
