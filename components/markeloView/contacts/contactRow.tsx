import React, {Component} from 'react';
import {Button, Div, Text, ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../../App';
import IContact, {Contact, Nameable} from '../../../model/contact';
import BasicRectangleRow from '../elements/basicRectangleRow';
import BasicRectangleView from '../elements/basicRectangleView';
import Checkbox from '../elements/checkbox';
import {info} from '../icons/contacts/svg';

interface IProps {
  contact: Nameable | IContact;
  owns?: number;
  owned?: number;
  onPress?: () => void;
  isChecked?: boolean;
  onCheck?: (checked: boolean) => boolean;
  onPressInfo?: () => void;
}

interface IState {}

export default class ContactRow extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  moneyText(amount: number, color: string) {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <Text
          fontSize="S"
          color={color}
          fontFamily={MarkelovTheme.fontFamily.Regular400}>
          {amount.toFixed(2)}₽
        </Text>
      </ThemeProvider>
    );
  }

  get ownsRow() {
    if (!this.props.owns || this.props.owns <= 0) return;
    return this.moneyText(this.props.owns, '#ED4949');
  }

  get ownedRow() {
    if (!this.props.owned || this.props.owned <= 0) return;
    return this.moneyText(this.props.owned, '#45B600');
  }

  get hasCheckBox(): boolean {
    return !(
      this.props.isChecked == undefined || this.props.onCheck == undefined
    );
  }

  get checkBox() {
    if (!this.hasCheckBox) return;
    return (
      <Checkbox checked={this.props.isChecked} onCheck={this.props.onCheck} />
    );
  }

  get hasInfo() {
    return !(this.props.onPressInfo == undefined);
  }

  get infoButton() {
    if (!this.hasInfo) return;
    return (
      <Button
        py={2}
        px={0}
        bg="transparent"
        alignItems="center"
        onPress={this.props.onPressInfo}>
        {info({})}
      </Button>
    );
  }

  render() {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <BasicRectangleView mb={12} h={48} onPress={this.props.onPress}>
          <Div row justifyContent="space-between">
            <Div row alignItems="center">
              {this.checkBox}
              <Text
                mr={8}
                ml={this.hasCheckBox ? 7 : 0}
                color="#444D56"
                fontFamily={MarkelovTheme.fontFamily.Regular400}
                fontSize="M"
                lineHeight={14}>
                {Contact.displayedName(this.props.contact)}
              </Text>
            </Div>
            {/* // TODO: does not align in center */}
            <Div row alignItems="center">
              <Div mr={this.hasInfo ? 7 : 0}>
                {this.ownsRow}
                {this.ownedRow}
              </Div>
              {this.infoButton}
            </Div>
          </Div>
        </BasicRectangleView>
      </ThemeProvider>
    );
  }
}
