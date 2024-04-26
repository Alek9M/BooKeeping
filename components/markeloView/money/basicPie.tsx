import React, {Component} from 'react';
import {Div, Text} from 'react-native-magnus';
import {VictoryChart, VictoryLegend, VictoryPie} from 'victory-native';

interface IProps {
  diameter: number;
  title: string;
  data: number[];
  colors: string[];
  greyColor: string;
}

interface IState {}

export default class BasicPie extends Component<IProps, IState> {
  //   static colors: string[] = [
  //     '#66B4AF',
  //     '#8DB863',
  //     '#E59042',
  //     '#C67CB6',
  //     '#8376D1',
  //   ];

  //   static greyColor = '#849B9A';

  //   static limit = BasicPie.colors.length;

  constructor(props: IProps) {
    super(props);
  }

  get radius(): number {
    return this.props.diameter / 2;
  }

  get processedData(): number[] {
    const sorted = this.props.data.sort((a, b) => a - b);
    const top = sorted.slice(0, this.limit);
    const leftovers = sorted
      .slice(this.limit)
      .reduce((acc, cur) => (acc += cur), 0);
    return [...top, leftovers];
  }

  get limit(): number {
    return this.props.colors.length;
  }

  render() {
    return (
      <Div w={this.props.diameter}>
        <Div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            width: this.props.diameter,
            height: this.props.diameter,
          }}>
          <Text fontSize="S">{this.props.title}</Text>
        </Div>
        <VictoryPie
          width={this.props.diameter}
          height={this.props.diameter}
          data={this.processedData.map((data, index) => {
            return {
              x: index,
              y: data,
              label: data.toString(), //' ', // `${((tag.amount / this.total()) * 100).toPrecision(3)}%`,
            };
          })}
          colorScale={[...this.props.colors, this.props.greyColor]}
          innerRadius={this.radius * 0.5}
          radius={this.radius}
          labelPosition="centroid"
          //   labels={this.processedData.map((data) => data.toString())}
          labels={({datum}) => `y: ${datum.label}`}
          style={{
            labels: {
              fontSize: 25,
              fill: 'white',
            },
          }}
        />
      </Div>
    );
  }
}
