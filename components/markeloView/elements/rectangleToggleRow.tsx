import React, {Component} from 'react';
import BasicRectangleRow from './basicRectangleRow';
import BasicToggle from './basicToggle';

interface IProps {
  text: string;
  isOn: boolean;
  onSwitch: (value: boolean) => void;
  mb?: number;
}

interface IState {}

export default class RectangleToggleRow extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <BasicRectangleRow
        h={null}
        py={12}
        text={this.props.text}
        mb={this.props.mb}
        collapsed={!this.props.isOn}
        renderCollapse={this.props.children}>
        <BasicToggle isOn={this.props.isOn} onSwitch={this.props.onSwitch} />
      </BasicRectangleRow>
    );
  }
}
