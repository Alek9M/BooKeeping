import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {Div} from 'react-native-magnus';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ModalHeader from '../modalHeader';

interface IProps {
  title?: string;
  left?: string;
  onPressLeft?: () => void;
  right?: string;
  onPressRight?: () => void;
  px?: number;
  py?: number;
  disableScroll?: boolean;
}

interface IState {}

export default class BasicModalView extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  scrollView() {
    if (this.props.disableScroll) return this.props.children;
    return (
      <KeyboardAwareScrollView
        extraScrollHeight={30}
        style={{
          paddingHorizontal: this.props.px ?? 27.5,
          paddingTop: this.props.py ?? 30,
          backgroundColor: '#F1F2F5',
          flex: 1,
        }}>
        {/* <Div px={27.5} bg="#F1F2F5"> */}
        {this.props.children}
        {/* </Div> */}
      </KeyboardAwareScrollView>
    );
  }

  render() {
    return (
      <Div h="100%">
        <ModalHeader
          title={this.props.title}
          left={this.props.left}
          right={this.props.right}
          onPressLeft={this.props.onPressLeft}
          onPressRight={this.props.onPressRight}
        />
        {this.scrollView()}
      </Div>
    );
  }
}
