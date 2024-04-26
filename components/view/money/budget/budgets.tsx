import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
//
import {Button, Div, Text} from 'react-native-magnus';
import BudgetTagModel from '../../../../data/budgetTagModel';
import {observeBudgetTagsOn} from '../../../../data/helpers';
import BudgetTag from '../../../../model/budgetTag';
import Calendar from '../../../../model/calendar';
import {PaymentType} from '../../../../model/payment';
import CalendarPicker, {
  CalendarPickerType,
} from '../../tab/tabWide/calendarPicker';
import BudgetModal from './budgetModal';
import BudgetsList from './budgetsList';
import BudgetPie from './budgetPie';
import ProjectModel from '../../../../data/projectModel';
import {ScrollView} from 'react-native-gesture-handler';
import {Dimensions} from 'react-native';
import Title from '../../../markeloView/elements/title';
import {MarkelovTheme} from '../../../../App';

interface IProps {
  onPressBudget: (budget: BudgetTagModel) => void;
}

interface IState {
  year: number;
  month: number;
  newBudget?: BudgetTag;
  selectedProjects: ProjectModel[];
}

export default class Budgets extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const today = new Calendar();

    this.state = {
      selectedProjects: [],
      month: today.month,
      year: today.year,
    };
  }

  createNewBudgetTag(type: PaymentType): BudgetTag {
    let newBudget = new BudgetTag({});
    newBudget.type = type;
    newBudget.month = this.state.month;
    newBudget.year = this.state.year;
    return newBudget;
  }

  render() {
    return (
      <>
        <Div h={Dimensions.get('window').height}>
          <CalendarPicker
            type={CalendarPickerType.Month}
            onDayChange={(month) => {
              const selected = new Calendar(month);
              this.setState({month: selected.month, year: selected.year});
            }}
            onMonthChange={(month) => {
              const selected = new Calendar(month);
              this.setState({month: selected.month, year: selected.year});
            }}
          />
          {/* <ScrollView> */}
          {[
            {title: 'Доходы', type: PaymentType.Income},
            {title: 'Расходы', type: PaymentType.Outcome},
          ].map((bud) => (
            <BudgetsList
              title={bud.title}
              type={bud.type}
              month={this.state.month}
              year={this.state.year}
              searchWord={this.props.searchWord}
              onPressRow={(budget: BudgetTagModel) =>
                this.props.onPressBudget(budget)
              }
              selectedProjects={this.props.selectedProjects}
              onPressAdd={() =>
                this.setState({
                  newBudget: this.createNewBudgetTag(bud.type),
                })
              }
            />
          ))}
          <Div row justifyContent="space-between" mt={24}>
            <Title text="Остаток" />
            {/* FIXME: */}
            <Text
              fontFamily={MarkelovTheme.fontFamily.SemiBold600}
              fontSize="L">
              unknown
            </Text>
          </Div>
          <Div row>
            {Object.values(PaymentType).map((type) => (
              <BudgetPie
                width={(Dimensions.get('window').width - 27.5 * 2) / 2}
                month={this.state.month}
                year={this.state.year}
                selectedProjects={this.props.selectedProjects}
                type={PaymentType[type]}
              />
            ))}
          </Div>
          <Div w={10} h={400} />
          {/* </ScrollView> */}
        </Div>
        <BudgetModal
          budgetTag={this.state.newBudget}
          onChange={(budget) => {
            if (budget?._model) {
              this.setState({newBudget: undefined});
            } else {
              this.setState({newBudget: budget});
            }
          }}
        />
      </>
    );
  }
}
