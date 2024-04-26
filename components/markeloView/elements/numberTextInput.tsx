import React, {Component} from 'react';
import {TextInput} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import {onChange} from 'react-native-reanimated';
import {MarkelovTheme} from '../../../App';

interface IProps {
  postfix?: string;
  value: number | undefined;
  onChange: (value: number) => void;
  disabled: boolean;
  limit: number;
  decimal: boolean;
  placeholder: string;
}

interface IState {
  forcedDecimal: boolean;
}

// Number.prototype.countDecimals = function () {
//   if (Math.floor(this.valueOf()) === this.valueOf()) return 0;

//   var str = this.toString();
//   if (str.indexOf('.') !== -1 && str.indexOf('-') !== -1) {
//     return str.split('-')[1] || 0;
//   } else if (str.indexOf('.') !== -1) {
//     return str.split('.')[1].length || 0;
//   }
//   return str.split('-')[1] || 0;
// };

export default class NumberTextInput extends Component<IProps, IState> {
  static defaultProps = {
    disabled: false,
    decimal: false,
    limit: 2,
    placeholder: '0',
  };

  // limit for currency AND percentages = 2
  // currency display 0's others dont
  // quantity limit = 3 and displays 0's

  integerInput: TextInput | null = null;
  decimalInput: TextInput | null = null;

  constructor(props: IProps) {
    super(props);
    const decimal = NumberTextInput.decimalValue(props.value, props.limit);
    const forced = decimal != undefined && decimal.length != 0;
    this.state = {
      forcedDecimal: forced,
    };
  }

  private textStyle = {
    fontFamily: MarkelovTheme.fontFamily.SemiBold600,
    fontSize: MarkelovTheme.fontSize.M,
    lineHeight: 15,
    color: '#444D56',
  };

  onChangeInteger(text: string) {
    console.log('OCI: ' + text);

    if (text.endsWith('.')) {
      this.setState({forcedDecimal: true}, () => this.decimalInput?.focus());
    }
    text;
    let number = Number(text.replaceAll(' ', ''));
    if (Number.isNaN(number)) number = 0;
    const decimalValue = this.decimalValue;
    if (decimalValue != undefined) {
      let decimal = Number(this.decimalValue);
      if (Number.isNaN(decimal)) decimal = 0;
      number += decimal / Math.pow(10.0, decimalValue.length);
    }
    this.props.onChange(number);
  }

  onChangeDecimal(text: string) {
    console.log('OCD: ' + text);
    if (text.length == 0) {
      this.integerInput?.focus();
      this.props.onChange(this.integerValue ?? 0);
      this.setState({forcedDecimal: false});
    } else {
      const trimmed = text.substring(0, this.props.limit);
      this.props.onChange(
        this.integerValue ??
          0 + Number(trimmed) / Math.pow(10.0, trimmed.length),
      );
    }
  }

  get beautifiedIntegerValue(): string | undefined {
    const integerValue = this.integerValue;
    if (integerValue == undefined) return undefined;
    return integerValue
      .toString()
      .split('')
      .reverse()
      .join('')
      .replace(/(.{3})/g, '$1 ')
      .split('')
      .reverse()
      .join('');
  }

  get integerValue(): number | undefined {
    if (this.props.value == undefined) return undefined;
    if (this.props.value == 0 && !this.state.forcedDecimal) return '';
    return Math.trunc(this.props.value);
  }

  get decimalValue(): string | undefined {
    return NumberTextInput.decimalValue(this.props.value, this.props.limit);
  }

  static decimalValue(
    value: number | undefined,
    powLimit: number,
  ): string | undefined {
    if (value == undefined) return undefined;
    if (Number.isNaN(value)) return undefined;
    const limit = Math.pow(10, powLimit);
    const roundNumber = Math.round(value * limit) / limit;
    let decimal = roundNumber.toString().split('.')[1];
    if (decimal == undefined) return undefined;
    const trimmed = decimal.substring(0, powLimit);
    return trimmed;
  }

  get decimalInputRender(): Element {
    const lineHeight = 13.5;
    if (!this.props.decimal && !this.state.forcedDecimal) return <></>;
    return (
      <>
        <Text style={{...this.textStyle, lineHeight: lineHeight}}>.</Text>
        <TextInput
          editable={!this.props.disabled}
          style={{
            ...this.textStyle,
            lineHeight: lineHeight,
            fontSize: MarkelovTheme.fontSize.S,
          }}
          keyboardType="decimal-pad"
          placeholder={'0'.repeat(this.props.limit)}
          value={this.decimalValue}
          onChangeText={(text) => {
            this.onChangeDecimal(text);
          }}
          textAlign="left"
          ref={(input) => {
            this.decimalInput = input;
          }}
          onFocus={() => {
            if (
              this.beautifiedIntegerValue?.length == 0 ||
              this.beautifiedIntegerValue == undefined
            )
              this.integerInput?.focus();
          }}
          onTouchStart={() => {
            if (
              this.decimalValue?.length == 0 ||
              this.decimalValue == undefined
            )
              this.integerInput?.focus();
          }}
        />
        {this.decimalValue && this.decimalValue.length < this.props.limit && (
          <Text
            style={{
              ...this.textStyle,
              lineHeight: lineHeight,
              fontSize: MarkelovTheme.fontSize.S,
            }}>
            {'0'.repeat(this.props.limit - this.decimalValue.length)}
          </Text>
        )}
      </>
    );
  }

  get postfix(): Element {
    if (this.props.postfix == undefined || this.props.postfix.length == 0)
      return <></>;
    return (
      <Text style={{...this.textStyle, lineHeight: 15}}>
        {this.props.postfix}
      </Text>
    );
  }

  render() {
    return (
      <Div row pl={12}>
        <TextInput
          editable={!this.props.disabled}
          style={{
            ...this.textStyle,
            minWidth: 20,
            textAlign: 'right',
          }}
          keyboardType="decimal-pad"
          placeholder={this.props.placeholder}
          value={this.beautifiedIntegerValue}
          onChangeText={(text) => {
            this.onChangeInteger(text);
          }}
          ref={(input) => {
            this.integerInput = input;
          }}
        />
        {this.decimalInputRender}
        {this.postfix}
      </Div>
    );
  }
}
