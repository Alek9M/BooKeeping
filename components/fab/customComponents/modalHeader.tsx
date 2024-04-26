import {text} from '@nozbe/watermelondb/decorators';
import React, {Component} from 'react';
import {Header, Button, Icon, Text} from 'react-native-magnus';

interface IProps {
  onCancel: () => void;
  onSave: () => void;
  text: string;
}

interface IState {}

export default class ModalHeader extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  HeaderButton(text: string, onPress: () => void): Element {
    return (
      <Button onPress={onPress} bg="transparent" px="lg" m={0}>
        <Text style={{fontWeight: '500'}} color="blue700" fontSize="xl">
          {text}
        </Text>
      </Button>
    );
  }

  render() {
    return (
      <>
        <Header
          p={0}
          m={0}
          borderBottomWidth={1}
          borderBottomColor="gray200"
          alignment="center"
          prefix={this.HeaderButton('Отменить', this.props.onCancel)}
          suffix={this.HeaderButton('Сохранить', this.props.onSave)}>
          {this.props.text}
        </Header>
      </>
    );
  }
}
