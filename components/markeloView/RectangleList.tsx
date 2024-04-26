import React, {Component} from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {Button, Div, Text, ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../App';
import BasicRectangleView from './elements/basicRectangleView';
import {plus} from './icons/fab/svg';

interface IProps {
  title: string;
  data: any[];
  renderItem: (info: ListRenderItemInfo<any>) => Element;
  onAdd?: () => void;
}

interface IState {}

export default class RectangleList extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <BasicRectangleView>
          <Div
            row
            justifyContent="space-between"
            mb={this.props.data.length > 0 ? 8 : 0}>
            <Text
              fontFamily={MarkelovTheme.fontFamily.SemiBold600}
              fontSize="M"
              lineHeight={14}
              color="#444D56">
              {this.props.title}
            </Text>
            {this.props.onAdd && (
              <Button p={0} bg="transparent" onPress={this.props.onAdd}>
                {plus({})}
              </Button>
            )}
          </Div>
          <FlatList data={this.props.data} renderItem={this.props.renderItem} />
        </BasicRectangleView>
      </ThemeProvider>
    );
  }
}
