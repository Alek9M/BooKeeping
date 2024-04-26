import React, {Component} from 'react';
import {Dimensions, FlatList} from 'react-native';
//
import Collapsible from 'react-native-collapsible';
import {Button, Div, Icon, Text} from 'react-native-magnus';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';

import SwipeableItem, {
  OpenDirection,
  useSwipeableItemParams,
} from 'react-native-swipeable-item';
//
import Article from '../../../model/article';
import IContact, {Contact} from '../../../model/contact';
import Sale from '../../../model/sale';
import SaleObject from '../../../model/saleObject';
import {bin} from '../../markeloView/icons/svg';
import SwipeableItemRow from './swipableItemRow';

interface IProps {
  contact: IContact;
  contacts: IContact[];
  items: Article[];
  sale: Sale;
  onDeleteContact: () => void;
  onAddToContact: () => void;
  onDeleteItem?: (item) => void;
  onPressItem?: (item) => void;
}

interface IState {
  isCollapsed: boolean;
}

export default class SaleContactRow extends Component<IProps, IState> {
  static optionsWidth = 71;

  constructor(props: IProps) {
    super(props);

    this.state = {
      isCollapsed: true,
    };
  }

  // getBill(): number {
  //   const sales = this.props.sales;
  //   const summaries = sales.map((sale) => sale.getSummary(this.props.contacts));
  //   const summariesFiltered = summaries.filter((sum) => sum != undefined);
  //   if (summariesFiltered.length > 0) {
  //     const summariesArray = summariesFiltered.reduce((summary, current) =>
  //       summary.concat(current),
  //     );
  //     const myParts = summariesArray.filter(
  //       (summary) => summary.contact.recordID == this.props.contact.recordID,
  //     );
  //     if (myParts.length > 0) {
  //       const myPart = myParts.map((part) => part.sum);
  //       const bill = myPart.reduce((bill, current) => (bill += current));
  //       return bill;
  //     } else {
  //       return 0;
  //     }
  //   } else {
  //     return 0;
  //   }
  // }

  options(props: {onDelete: () => void}) {
    const {item, percentOpen} = useSwipeableItemParams<IContact>();
    // TODO: pass padding from top
    const width = Dimensions.get('window').width - (27.5 + 15) * 2;
    const limit = width - SaleContactRow.optionsWidth;
    const animStyle = useAnimatedStyle(
      // () => ({marginLeft: width - width * percentOpen.value + limit}),
      () => {
        return {opacity: percentOpen.value};
      },
      [percentOpen],
    );
    return (
      <Animated.View
        style={[
          animStyle,
          {
            flex: 1,
            justifyContent: 'flex-end',
            alignSelf: 'flex-end',
          },
        ]} // Fade in on open
      >
        <Button
          row
          bg="transparent"
          p={0}
          alignItems="center"
          onPress={props.onDelete}>
          {bin({})}
          <Text
            ml={6}
            color="#ED4949"
            fontSize={11}
            // lineHeight={11}
            fontFamily="Inter">
            Удалить
          </Text>
        </Button>
      </Animated.View>
    );
  }

  render() {
    return (
      <>
        <Div
          bg="#F1F2F5"
          roundedTop={7}
          roundedBottom={this.state.isCollapsed ? 7 : 0}
          row
          justifyContent="space-between"
          px={12}
          py={8}
          my={this.state.isCollapsed ? 5 : 0}>
          <Div row>
            <Button
              // my={0}
              // mx={20}
              p={0}
              pr={8}
              bg="transparent"
              onPress={() =>
                this.setState((state, _props) => {
                  return {isCollapsed: !state.isCollapsed};
                })
              }>
              <Icon
                fontFamily="SimpleLineIcons"
                name={this.state.isCollapsed ? 'arrow-down' : 'arrow-up'}
              />
            </Button>
            <Text
              fontSize={12}
              lineHeight={12}
              color="#444D56"
              fontFamily="Inter">
              {Contact.displayedName(this.props.contact)}
            </Text>
          </Div>

          <Div row flex={1} justifyContent="flex-end" alignItems="flex-end">
            <SwipeableItem
              renderUnderlayLeft={() => (
                <this.options onDelete={this.props.onDeleteContact} />
              )}
              item={this.props.contact}
              key={this.props.contact.recordID}
              snapPointsLeft={[100]}
              // onChange={(params) =>
              //   this.setState({
              //     opacity: params.open == OpenDirection.LEFT ? 0 : 1,
              //   })
              // }
              overSwipe={20}>
              <Text
                textAlign="right"
                fontSize={12}
                lineHeight={12}
                color="#444D56"
                fontFamily="Inter">
                {this.props.sale.sumOutFor(this.props.contact).toFixed(2)}₽
              </Text>
            </SwipeableItem>
          </Div>
        </Div>
        <Collapsible collapsed={this.state.isCollapsed}>
          <FlatList
            data={this.props.items.filter((item) =>
              item.isSoldTo(this.props.contact),
            )}
            style={{paddingVertical: 10}}
            keyExtractor={(item) => item.uuid}
            renderItem={(item) => (
              <>
                <Div mx={10}>
                  <SwipeableItemRow
                    title={item.item.title}
                    price={item.item.priceOut}
                    quantity={item.item.quantityOutFor(this.props.contact)}
                    item={item.item}
                    onPress={() => this.props.onPressItem?.(item.item)}
                    onDelete={() => this.props.onDeleteItem?.(item.item)}
                  />
                </Div>
                {/* <Div row justifyContent="space-between" mt={8} mx={12.5}>
                  <Text
                    flex={4}
                    fontSize={12}
                    lineHeight={12}
                    fontFamily="Inter"
                    color="#444D56">
                    {item.item.title}
                  </Text>
                  <Div flex={5} row justifyContent="space-evenly">
                    <Text
                      flex={2}
                      textAlign="right"
                      fontSize={12}
                      lineHeight={12}
                      fontFamily="Inter"
                      color="#444D56">
                      {item.item.priceOut}₽
                    </Text>
                    <Text
                      flex={1}
                      textAlign="right"
                      fontSize={12}
                      lineHeight={12}
                      fontFamily="Inter"
                      color="#444D56">
                      {item.item
                        .quantityOutFor(this.props.contact)
                        .toPrecision(2)}
                    </Text>
                    <Text
                      flex={2}
                      textAlign="right"
                      fontSize={12}
                      lineHeight={12}
                      fontFamily="Inter"
                      color="#444D56">
                      {(
                        item.item.priceOutFor(this.props.contact) *
                        item.item.quantityOutFor(this.props.contact)
                      ).toFixed(2)}
                      ₽
                    </Text>
                  </Div>
                </Div> */}
              </>
            )}
          />
          <Button
            roundedBottom={7}
            onPress={() => this.props.onAddToContact()}
            bg="#F1F2F5"
            py={11}
            mb={8}
            mt={14}
            w="100%">
            <Text
              fontSize={10}
              lineHeight={10}
              color="#444D56"
              fontFamily="Inter-Bold">
              + Добавить позицию
            </Text>
          </Button>
        </Collapsible>
      </>
    );
  }
}
