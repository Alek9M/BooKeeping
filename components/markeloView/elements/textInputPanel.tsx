import React, {Component} from 'react';
import {TextInput} from 'react-native';
import {Div} from 'react-native-magnus';
import {MarkelovTheme} from '../../../App';

interface IProps {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  mt?: number;
  mb?: number;
}

interface IState {}

export default class TextInputPanel extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <Div
        mt={this.props.mt}
        mb={this.props.mb}
        style={{
          shadowColor: '#000000',
          shadowRadius: 4,
          shadowOpacity: 0.15,
          shadowOffset: {width: 0, height: 1},
        }}>
        <TextInput
          editable={!this.props.disabled}
          value={this.props.value}
          placeholder={this.props.placeholder}
          onChangeText={this.props.onChangeText}
          multiline
          style={{
            backgroundColor: '#F9F9FA',
            textAlignVertical: 'top',
            minHeight: 176,
            paddingHorizontal: 15,
            fontSize: MarkelovTheme.fontSize.M,
            fontFamily: MarkelovTheme.fontFamily.Regular400,
            // paddingVertical: 13, doesn't work for some reason
            paddingTop: 13,
            paddingBottom: 13,
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 7,
            marginBottom: 12,
          }}
        />
      </Div>
    );
  }
}
