import React, {Component} from 'react';
import {Div} from 'react-native-magnus';

interface IProps {
  vertical?: number;
  horizontal?: number;
}

interface IState {}

export default class BasicSeparator extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <>
        {this.props.children.map((child, index, children) => {
          if (child != undefined)
            return (
              <>
                {child}
                {index != children.length - 1 && (
                  <Div
                    my={this.props.vertical ?? 0 / 2}
                    mx={this.props.horizontal ?? 0 / 2}
                  />
                )}
              </>
            );
        })}
      </>
    );
  }
}

// react-native-fs
