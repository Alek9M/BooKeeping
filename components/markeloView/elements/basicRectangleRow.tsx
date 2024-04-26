import React, {Component} from 'react';
import Collapsible from 'react-native-collapsible';
import {Div, Text, ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../../App';
import BasicRectangleView from './basicRectangleView';

interface IProps {
  text: string;
  mb?: number;
  mt?: number;
  onPress?: () => void;
  collapsed?: boolean;
  renderCollapse?: Element;
  h?: number;
  py?: number;
  justifyContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
}

interface IState {}

export default class BasicRectangleRow extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <BasicRectangleView
          h={this.props.h === null ? undefined : this.props.h ?? 40}
          py={this.props.py ?? 0}
          mb={this.props.mb}
          mt={this.props.mt}
          onPress={this.props.onPress}>
          <Div
            row
            alignItems="center"
            justifyContent={this.props.justifyContent ?? 'space-between'}>
            <Text
              mr={this.props.text.length > 0 ? 8 : 0}
              color="#444D56"
              fontFamily={MarkelovTheme.fontFamily.Regular400}
              fontSize="M"
              lineHeight={14}>
              {this.props.text}
            </Text>
            {this.props.children}
          </Div>
          <Collapsible collapsed={this.props.collapsed}>
            {this.props.renderCollapse}
          </Collapsible>
        </BasicRectangleView>
      </ThemeProvider>
    );
  }
}
