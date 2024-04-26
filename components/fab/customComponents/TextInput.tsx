import React, {Component} from 'react';

import {Input, Text} from 'react-native-magnus';

interface IProps {
  placeholder: string;
  type: 'default' | 'money' | 'multiline' | 'number';
  onChange: (text: string) => void;
  textValue?: string;
  editable: boolean;
  required: boolean;
  warn: boolean;
}

interface IState {
  textValue: string;
}

export default class TextInput extends Component<IProps, IState> {
  public static defaultProps = {
    type: 'default',
    editable: true,
    required: false,
    warn: false,
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      textValue: props.textValue ?? '',
    };
  }

  keyboardType(): 'default' | 'decimal-pad' {
    switch (this.props.type) {
      case 'money':
      case 'number':
        return 'decimal-pad';
      default:
        return 'default';
    }
  }

  isMultiline(): boolean {
    switch (this.props.type) {
      case 'multiline':
        return true;
      default:
        return false;
    }
  }

  textAlign(): 'left' | 'center' | 'right' {
    switch (this.props.type) {
      case 'money':
        return 'right';
      default:
        return 'left';
    }
  }

  render() {
    return (
      <Input
        editable={this.props.editable}
        onChangeText={(text: string) => {
          if (
            (this.props.type != 'money' && this.props.type != 'number') ||
            (this.props.type == 'number' &&
              (!isNaN(parseFloat(text)) || text.length == 0)) ||
            (this.props.type == 'money' &&
              (!isNaN(parseFloat(text)) || text.length == 0) &&
              ((text.split('.').length == 2 &&
                text.split('.')[1].length <= 2) ||
                text.split('.').length == 1) &&
              ((text.split(',').length == 2 &&
                text.split(',')[1].length <= 2) ||
                text.split(',').length == 1))
          ) {
            this.props.onChange(text);
            this.setState({textValue: text});
          }
        }}
        value={
          ((this.props.type == 'money' || this.props.type == 'number') &&
            Number(this.state.textValue) == 0) ||
          // Number(this.props.textValue) == 0 ||
          this.state.textValue.length == 0
            ? undefined
            : this.state.textValue //this.props.textValue ?? this.state.textValue
        }
        keyboardType={this.keyboardType()}
        placeholder={this.props.placeholder}
        my="md"
        minW="40%"
        multiline={this.isMultiline()}
        textAlignVertical="top"
        textAlign={this.textAlign()}
        h={this.props.type == 'multiline' ? 200 : 50}
        borderWidth={1}
        borderColor={
          this.props.required && this.props.warn && !this.state.textValue.length
            ? 'red'
            : 'grey'
        }
        suffix={
          this.props.type == 'money' ? <Text fontSize="2xl">₽</Text> : undefined
        }
        focusBorderColor="blue700"
      />
    );
  }
}
