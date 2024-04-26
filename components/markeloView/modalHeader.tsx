import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import {Button, Div, Text, ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../App';

interface IProps {
  title?: string;
  left?: string;
  onPressLeft?: () => void;
  right?: string;
  onPressRight?: () => void;
}

interface IState {}

export default class ModalHeader extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  get left(): Element | undefined {
    if (!this.props.left || !this.props.onPressLeft) return;
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <Button onPress={this.props.onPressLeft} bg="transparent" p={0}>
          <Text
            fontFamily={MarkelovTheme.fontFamily.Regular400}
            color="#576880"
            fontSize="M"
            lineHeight={16.94}>
            {this.props.left}
          </Text>
        </Button>
      </ThemeProvider>
    );
  }

  get right(): Element | undefined {
    if (!this.props.right || !this.props.onPressRight) return;
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <Button onPress={this.props.onPressRight} bg="transparent" p={0}>
          <Text
            fontFamily={MarkelovTheme.fontFamily.SemiBold600}
            color="#5A7CEF" // TODO: while !isValid ORIGIN color, isValid -> current color // *ORIGIN* "#576880"
            fontSize="M"
            lineHeight={16.94}>
            {this.props.right}
          </Text>
        </Button>
      </ThemeProvider>
    );
  }

  get title(): Element | undefined {
    if (!this.props.title) return;
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <Text
          mb={27}
          fontFamily={MarkelovTheme.fontFamily.Bold700}
          fontSize="XL"
          lineHeight={21.78}
          color="#576880">
          {this.props.title}
        </Text>
      </ThemeProvider>
    );
  }

  get buttons(): Element | undefined {
    if (!this.props.left && !this.props.right) return;
    return (
      <>
        <Div>{this.left}</Div>
        <Div flex={1}></Div>
        <Div>{this.right}</Div>
      </>
    );
  }

  render() {
    return (
      <Div bg="#DFE5F3">
        <SafeAreaView style={{alignItems: 'center'}}>
          <Div row mx={28} mb={27}>
            {this.buttons}
          </Div>
          {this.title}
        </SafeAreaView>
      </Div>
    );
  }
}
