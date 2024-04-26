import React, {Component} from 'react';

import {Div} from 'react-native-magnus';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import ModalHeader from './modalHeader';

interface IProps {}

interface IState {}

export default class BasicModal extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <>
        {/* <KeyboardAwareScrollView keyboardShouldPersistTaps="handled"> */}
        <Div px="md" py="xl">
          {this.props.children}
        </Div>
        {/* </KeyboardAwareScrollView> */}
      </>
    );
  }
}
