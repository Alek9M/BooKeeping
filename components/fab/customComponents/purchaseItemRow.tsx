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
import {ArticleIn} from '../../../model/article';
import PurchaseObject from '../../../model/purchaseObject';
import {bin} from '../../markeloView/icons/svg';

interface IProps {
  item: ArticleIn;
  onPress: () => void;
  onDelete: () => void;
}

interface IState {
  opacity: number;
}

export default class PurchaseButtonRow extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {opacity: 1};
  }

  static optionsWidth = 71;

  text(
    text: string | number,
    flex: number,
    alignRight: boolean = false,
  ): JSX.Element {
    return (
      <Text
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
    );
  }

  options(props: {onDelete: () => void}) {
    const {item, percentOpen} = useSwipeableItemParams<ArticleIn>();
    // TODO: pass padding from top
    const width = Dimensions.get('window').width - (27.5 + 15) * 2;
    const limit = width - PurchaseButtonRow.optionsWidth;
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
        {/* <Button row bg="transparent" p={0} alignItems="center"> */}
        <TouchableOpacity
          onPress={props.onDelete}
          style={{padding: 3, flexDirection: 'row'}}>
          {bin({})}
          <Text
            ml={6}
            color="#ED4949"
            fontSize={11}
            // lineHeight={11}
            fontFamily="Inter">
            Удалить
          </Text>
        </TouchableOpacity>
        {/* </Button> */}
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
            {this.text(this.props.item.article.title, 6)}
            {this.textRub(this.props.item.priceIn, 2)}
          </Div>
        </Button>
        <Div
          row
          flex={4}
          // borderWidth={1}
        >
          <SwipeableItem
            renderUnderlayLeft={() => (
              <this.options onDelete={this.props.onDelete} />
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
              {this.text(this.props.item.quantity, 1, true)}
              {this.textRub(this.props.item.sum, 2)}
            </Div>
          </SwipeableItem>
        </Div>
      </Div>
    );
  }
}
