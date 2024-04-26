import React, {Component} from 'react';
import {Button, Text, Icon, Div} from 'react-native-magnus';

interface IProps {
  color: string;
  size: number;
  iconName: string;
  fontFamily:
    | 'AntDesign'
    | 'Entypo'
    | 'EvilIcons'
    | 'Feather'
    | 'FontAwesome'
    | 'FontAwesome5'
    | 'Foundation'
    | 'Ionicons'
    | 'MaterialIcons'
    | 'MaterialCommunityIcons'
    | 'Octicons'
    | 'Zocial'
    | 'Fontisto'
    | 'SimpleLineIcons'
    | undefined;
  text: string;
  onPress: () => void;
}

interface IState {}

export default class FabOptionButton extends Component<IProps, IState> {
  backBlurColor = 'white';
  optionSize = 'xl';

  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <>
        <Button
          px="none"
          bg="transparent"
          alignSelf="flex-end"
          justifyContent="flex-start"
          onPress={(_event) => {
            this.props.onPress();
          }}>
          <Div rounded="sm" bg={this.backBlurColor} p="sm">
            <Text fontSize={this.optionSize}>{this.props.text}</Text>
          </Div>
          <Icon
            name={this.props.iconName}
            fontFamily={this.props.fontFamily}
            fontSize={this.optionSize}
            color={this.props.color}
            h={this.props.size}
            w={this.props.size}
            rounded="circle"
            ml="md"
            shadow="sm"
            bg={this.backBlurColor}
          />
        </Button>
      </>
    );
  }
}
