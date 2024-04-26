import React, {Component} from 'react';
import {Button, Div, ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../../App';

interface IProps {
  checked: boolean;
  onCheck: (checked: boolean) => void;
  badgeColor?: string;
  color?: string;
}

interface IState {}

export default class Checkbox extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  // Checkbox
  diameter = 24;
  radius = 16;
  borderWidth = 1;

  // Switch
  innerDiameter = 18;
  innerRadius = 16;

  // Badge
  badgeDiameter = 12;
  badgeRadius = 16;
  badgeBorderWidth = 1;
  badgeOffset = 14;

  // Palate
  white = '#F9F9FA';
  grey = '#767676';
  black = 'rgba(0, 0, 0, 0.25)'; // *ORIGIN* MarkelovTheme.colors.Black10;

  badge() {
    if (!this.props.badgeColor) return;
    return (
      <Div
        h={this.badgeDiameter}
        w={this.badgeDiameter}
        rounded={this.badgeRadius}
        borderWidth={this.badgeBorderWidth}
        borderColor={this.grey}
        bg={this.props.badgeColor}
        position="absolute"
        ml={this.badgeOffset}
        mb={this.badgeOffset}
        // Makes it tap-through
        pointerEvents="none"
      />
    );
  }

  switch() {
    if (!this.props.checked) return;
    return (
      <Div
        h={this.innerDiameter}
        w={this.innerDiameter}
        rounded={this.innerRadius}
        bg={this.props.color ? this.black : this.grey}
      />
    );
  }

  render() {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <Div>
          <Button
            h={this.diameter}
            w={this.diameter}
            rounded={this.radius}
            borderWidth={this.borderWidth}
            borderColor={this.props.color ? this.black : this.grey}
            bg={this.props.color ?? this.white}
            onPress={() => this.props.onCheck(!this.props.checked)}>
            {this.switch()}
          </Button>
          {this.badge()}
        </Div>
      </ThemeProvider>
    );
  }
}
