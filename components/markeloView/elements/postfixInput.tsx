import React, {Component} from 'react';
import {TextInput} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import {MarkelovTheme} from '../../../App';

interface IProps {
  postfix: string;
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  disabled?: boolean;
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad';
}

interface IState {}

export default class PostfixInput extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <Div row pl={12}>
        {/* // TODO: numbers are separated by dit and types without coma */}
        <TextInput
          editable={!this.props.disabled}
          style={{
            fontFamily: MarkelovTheme.fontFamily.SemiBold600,
            fontSize: MarkelovTheme.fontSize.M,
            lineHeight: 15,
            color: '#444D56',
            minWidth: 30,
            textAlign: 'right',
          }}
          keyboardType={this.props.keyboardType ?? 'decimal-pad'}
          placeholder={this.props.placeholder ?? 'NaN'}
          value={this.props.value.length > 0 ? this.props.value : undefined}
          onChangeText={this.props.onChange}
        />
        <Text
          style={{
            fontFamily: MarkelovTheme.fontFamily.SemiBold600,
            fontSize: MarkelovTheme.fontSize.M,
            lineHeight: 15,
            color: '#444D56',
          }}>
          {this.props.postfix}
        </Text>
      </Div>
    );
  }
}
