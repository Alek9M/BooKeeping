import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
//
import {Button, Div, Text} from 'react-native-magnus';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import SwipeableItem, {
  OpenDirection,
  useSwipeableItemParams,
} from 'react-native-swipeable-item';
//
import Article, {ArticleIn} from '../../../model/article';
import PurchaseObject from '../../../model/purchaseObject';
import {Service} from '../../../model/service';
import {bin} from '../../markeloView/icons/svg';

interface IProps {
  item: Article | Service;
  onPress: () => void;
  onDelete: () => void;
}

interface IState {
  opacity: number;
}

// Object.defineProperty(Number.prototype, 'toRub', {
//   value() {
//     return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₽';
//   },
// });

export default class SaleButtonRow extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {opacity: 1};
  }

  static optionsWidth = 71;

  text(
    text: string | number,
    flex: number,
    alignRight: boolean = false,
    oneLine: boolean = false,
  ): JSX.Element {
    return (
      <Text
        numberOfLines={oneLine ? 1 : undefined}
        color="#444D56"
        fontFamily="Inter"
        fontSize={12}
        lineHeight={12}
        flex={flex}
        mx={2}
        textAlign={alignRight ? 'right' : 'left'}>
        {text}
      </Text>
    );
  }

  textRub(text: number, flex: number): JSX.Element {
    return this.text(
      text
        .toFixed()
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₽',
      flex,
      true,
      true,
    );
  }

  options(props: {
    setOpacity: (opacity: number) => void;
    onDelete: () => void;
  }) {
    const {item, percentOpen} = useSwipeableItemParams<ArticleIn>();
    // TODO: pass padding from top
    const width = Dimensions.get('window').width - (27.5 + 15) * 2;
    const limit = width - SaleButtonRow.optionsWidth;
    const animStyle = useAnimatedStyle(
      // () => ({marginLeft: width - width * percentOpen.value + limit}),
      () => {
        // props.setOpacity(1 - percentOpen.value);
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
        <TouchableOpacity
          onPress={props.onDelete}
          style={{padding: 3, flexDirection: 'row'}}>
          {/* <Button
            row
            bg="black"
            p={3}
            alignItems="center"
            onPress={() => {
              console.log('delete item on sale pressed');

              props.onDelete();
            }}> */}
          {/* <Div row alignItems="center"> */}
          {bin({})}
          <Text
            ml={6}
            color="#ED4949"
            fontSize={11}
            // lineHeight={11}
            fontFamily="Inter">
            Удалить
          </Text>
          {/* </Div> */}
          {/* </Button> */}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  render() {
    return (
      <Div row alignItems="center" pt={12}>
        <Button
          bg="transparent"
          // w="100%"
          onPress={this.props.onPress}
          // borderWidth={1}
          p={0}
          flex={8}>
          <Div row justifyContent="space-between" w="100%" alignItems="center">
            {this.text(this.props.item.title, 6)}
            {this.textRub(this.props.item.priceOut, 2)}
          </Div>
        </Button>
        <Div
          row
          flex={4}
          // borderWidth={1}
        >
          <SwipeableItem
            renderUnderlayLeft={() => (
              <this.options
                setOpacity={(opacity: number) =>
                  this.setState({opacity: opacity})
                }
                onDelete={() => {
                  this.props.onDelete();
                }}
              />
            )}
            item={this.props.item}
            key={this.props.item.uuid}
            snapPointsLeft={[0.1]}
            onChange={(params) =>
              this.setState({
                opacity: params.open == OpenDirection.LEFT ? 0 : 1,
              })
            }
            overSwipe={20}>
            <Div row opacity={this.state.opacity}>
              {this.text(this.props.item.quantityOut, 1, true)}
              {this.textRub(this.props.item.sumOut, 2)}
            </Div>
          </SwipeableItem>
        </Div>
      </Div>
    );
  }
}