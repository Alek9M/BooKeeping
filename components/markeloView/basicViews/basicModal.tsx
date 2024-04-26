import React, {Component} from 'react';
import {Modal, ScrollView} from 'react-native';
import {Div} from 'react-native-magnus';
import ModalHeader from '../modalHeader';
import BasicModalView from './basicModalView';

interface IProps {
  // onHide: () => void;
  py?: number;
  isVisible: boolean;
  title?: string;
  left?: string;
  onPressLeft?: () => void;
  right?: string;
  onPressRight?: () => void;
}

interface IState {}

export default class BasicModal extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <Modal
        visible={this.props.isVisible}
        animationType="slide"
        hardwareAccelerated
        //   useNativeDriver
        // propagateSwipe
        // swipeDirection="down"
        // onSwipeComplete={this.props.onHide}
      >
        <BasicModalView
          title={this.props.title}
          left={this.props.left}
          right={this.props.right}
          onPressLeft={this.props.onPressLeft}
          onPressRight={this.props.onPressRight}
          py={this.props.py}>
          {this.props.children}
        </BasicModalView>
      </Modal>
    );
  }
}
