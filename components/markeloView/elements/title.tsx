import React, {Component} from 'react';
import {Div, Text, ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../../App';

interface IProps {
  text: string;
  mt?: number;
  mb?: number;
  color?: string;
}

interface IState {}

export default class Title extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <Div
          row
          justifyContent="space-between"
          mb={this.props.mb ?? 24}
          mt={this.props.mt}>
          <Text
            fontFamily={MarkelovTheme.fontFamily.Bold700}
            color={this.props.color ?? MarkelovTheme.colors.BlackBodyText}
            fontSize="XXL"
            lineHeight={24}>
            {this.props.text}
          </Text>
          {this.props.children}
        </Div>
      </ThemeProvider>
    );
  }
}
