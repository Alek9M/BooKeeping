import React, {Component} from 'react';
import {FlatList, processColor} from 'react-native';
//
import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {VictoryChart, VictoryLegend, VictoryPie} from 'victory-native';
//
import BudgetTagModel from '../../../../data/budgetTagModel';
import {observeBudgetTagsOn} from '../../../../data/helpers';
// import Project from '../../../../model/project';
import {Div, Text} from 'react-native-magnus';
import {MarkelovTheme} from '../../../../App';
import {PaymentType} from '../../../../model/payment';
import MoneyLegend from '../../../markeloView/money/moneyLegend';
import BasicPie from '../../../markeloView/money/basicPie';

interface IProps {
  budgetTags: BudgetTagModel[];
  width: number;
  type: number;
}

interface IState {}

interface PieSlice {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

interface BudgetInfo {
  title: string;
  amount: number;
  id: string;
}

class BudgetPie extends Component<IProps, IState> {
  static colors: string[] = [
    '#66B4AF',
    '#8DB863',
    '#E59042',
    '#C67CB6',
    '#8376D1',
  ];

  static greyColor = '#849B9A';

  static limit = BudgetPie.colors.length;

  // limit = Project.colors.length;

  constructor(props: IProps) {
    super(props);
  }

  total(): number {
    return this.props.budgetTags.reduce((acc, next) => (acc += next.amount), 0);
  }

  sorted() {
    return this.props.budgetTags.sort((a, b) => b.amount - a.amount);
  }

  topLimit(): BudgetInfo[] {
    const sorted = this.sorted();
    const topLimit = sorted.slice(0, BudgetPie.limit) as BudgetInfo[];
    const leftovers = sorted.slice(BudgetPie.limit).reduce<BudgetInfo>(
      (acc, next) => {
        return {title: acc.title, amount: acc.amount + next.amount, id: '0'};
      },
      {title: 'Others', amount: 0, id: '0'},
    );
    if (leftovers.amount > 0) topLimit.push(leftovers);
    return topLimit;
  }

  tagToPieSlice(tag: BudgetInfo, index: number): PieSlice {
    return {
      name: tag.title,
      amount: tag.amount,
      color: index < BudgetPie.limit ? BudgetPie.colors[index] : 'gray',
      legendFontColor: 'black',
      legendFontSize: 15,
    };
  }

  radius = this.props.width / 2 - 10;

  render() {
    if (this.props.budgetTags.length == 0) return <></>;
    const top = this.topLimit();
    return (
      <Div w={this.props.width}>
        <Div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            width: this.props.width,
            height: this.props.width,
          }}>
          <Text fontSize="S">
            {this.props.type == PaymentType.Income ? 'Доход' : 'Расход'}
          </Text>
        </Div>
        <VictoryPie
          width={this.props.width}
          height={this.props.width}
          data={top.map((tag, index) => {
            return {
              x: index,
              y: tag.amount,
              label: ' ', // `${((tag.amount / this.total()) * 100).toPrecision(3)}%`,
            };
          })}
          colorScale={[...BudgetPie.colors, 'grey']}
          innerRadius={this.radius * 0.5}
          radius={this.radius}
          labelPosition="centroid"
          labels={['15']}
          style={{
            labels: {
              fontSize: 25,
              fill: 'white',
            },
          }}
        />
        <BasicPie
          diameter={this.props.width}
          title={this.props.type == PaymentType.Income ? 'Доход' : 'Расход'}
          data={this.props.budgetTags.map((tag) => tag.amount)}
          colors={BudgetPie.colors}
          greyColor={BudgetPie.greyColor}
        />
        <FlatList
          data={top}
          keyExtractor={(item) => item.id}
          style={{marginTop: 24}}
          renderItem={(item) => (
            <MoneyLegend
              title={item.item.title}
              amount={item.item.amount}
              color={
                item.index < BudgetPie.limit
                  ? BudgetPie.colors[item.index]
                  : 'grey'
              }
            />
          )}
        />
      </Div>
    );
  }
}

const enhanceWithEntries = withObservables(
  ['month', 'year', 'type', 'selectedProjects'],
  ({month, year, type, selectedProjects}) => ({
    budgetTags: observeBudgetTagsOn(type, year, month).extend(
      Q.where(
        'project_id',
        Q.oneOf(selectedProjects.map((project) => project.id)),
      ),
    ),
  }),
);

export default enhanceWithEntries(BudgetPie);
