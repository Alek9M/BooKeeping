import React, {Component} from 'react';
import {TextInput} from 'react-native';
import {Div} from 'react-native-magnus';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import {MarkelovTheme} from '../../../App';

interface IProps {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  mt?: number;
  mb?: number;
  autoGrow?: boolean;
}

interface IState {}

export default class TextInputRow extends Component<IProps, IState> {
  inputStyle;

  constructor(props: IProps) {
    super(props);

    this.inputStyle = {
      backgroundColor: '#F9F9FA',
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 7,
      fontFamily: MarkelovTheme.fontFamily.Regular400,
      fontSize: MarkelovTheme.fontSize.M,
      color: '#444D56',
    };
  }

  render() {
    return (
      <Div
        mt={this.props.mt}
        mb={this.props.mb ?? 12}
        flex={1}
        // h={40}
        minH={40}
        // maxH={120}
        p={0}
        style={{
          // borderColor: 'green',
          // borderWidth: 2,
          shadowColor: '#000000',
          shadowRadius: 4,
          shadowOpacity: 0.15,
          shadowOffset: {width: 0, height: 1},
        }}>
        {this.props.autoGrow && (
          <AutoGrowingTextInput
            editable={!this.props.disabled}
            value={this.props.value}
            numberOfLines={2}
            // multiline
            placeholder={this.props.placeholder}
            onChangeText={this.props.onChangeText}
            style={{
              ...this.inputStyle,
              paddingTop: 10,
              paddingBottom: 13,
              maxHeight: 75,
              // paddingVertical: 15,
              textAlignVertical: 'center',
              flex: 1,
              height: 100,
            }}
          />
        )}
        {!this.props.autoGrow && (
          <TextInput
            editable={!this.props.disabled}
            value={this.props.value}
            // numberOfLines={1}
            // multiline
            placeholder={this.props.placeholder}
            onChangeText={this.props.onChangeText}
            style={{
              ...this.inputStyle,
              paddingVertical: 11,
            }}
          />
        )}
      </Div>
    );
  }
}
