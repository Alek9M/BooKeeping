import {StackScreenProps} from '@react-navigation/stack';
import React, {Component} from 'react';
import {Button, Div, Modal, Text} from 'react-native-magnus';
import {RootStackParamList} from '../navigation';
import {Calendar, CalendarList} from 'react-native-calendars';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import {FlatList} from 'react-native';
import HeaderButton from '../../fab/customComponents/headerButton';
import BasicModal from '../../fab/customComponents/basicModal';
import TextInput from '../../fab/customComponents/TextInput';
import ModalHeader from '../../fab/customComponents/modalHeader';
import ICalendar from '../../../model/calendar';
import ProjectsDropDownPicker from '../customElements/projectsDropDownPicker';
import Project from '../../../model/project';
import BudgetTag from '../../../model/budgetTag';
import CCalendar from '../../../model/calendar';
import SegmentedControl from '@react-native-community/segmented-control';
import withObservables from '@nozbe/with-observables';
import {observeBudgetTags} from '../../../data/helpers';
import BudgetTagModel from '../../../data/budgetTagModel';
import ProjectsPicker from '../../fab/customComponents/projectsPicker';
import ProjectModel from '../../../data/projectModel';
import NoteModel from '../../../data/noteModel';
import PaymentModel from '../../../data/paymentModel';
import BudgetTagRow from './BudgetTagRow';
import BudgetsFlatList from './budgetsFlatList';

type Props = StackScreenProps<RootStackParamList, 'Budgets'>;

interface EProps extends Props {
  // incomeTags: BudgetTagModel[];
  // outcomeTags: BudgetTagModel[];
}

interface IState {
  year: number;
  month: number;
  projects: Project[];
  budget?: BudgetTag;
}

export default class Budgets extends Component<EProps, IState> {
  constructor(props: EProps) {
    super(props);

    props.navigation.setOptions({
      headerRight: () => <HeaderButton title="Добавить" onPress={() => {}} />,
    });

    const today = new CCalendar();

    this.state = {
      year: today.year,
      month: today.month,
      projects: [],
    };
  }

  data: {name: string; factual: number; plan: number}[] = [
    {name: 'Выручка', factual: 1500, plan: 2000},
    {name: 'Транспорт', factual: 200, plan: 200},
    {name: 'Питание', factual: 3000, plan: 1300},
  ];

  previousData: {month: string; factual: number; plan: number}[] = [
    {month: 'Январь', factual: 2000, plan: 1500},
    {month: 'Февраль', factual: 2000, plan: 1500},
    {month: 'Март', factual: 2000, plan: 1500},
  ];

  render() {
    return (
      <Div>
        <Calendar
          // Callback which gets executed when visible months change in scroll view. Default = undefined
          onVisibleMonthsChange={(months: ICalendar[]) => {
            if (months.length == 1) {
              this.setState({year: months[0].year, month: months[0].month});
            }
          }}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={50}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={50}
          // Enable or disable scrolling of calendar list
          scrollEnabled={true}
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            height: 50,
            overflow: 'hidden',
          }}
        />
        <ProjectsDropDownPicker
          onChange={(projects: Project[]) => {
            this.setState({projects: projects});
          }}
          selectedProjects={this.state.projects}
        />
        <Div justifyContent="space-between" row>
          <Text>Входящий остаток</Text>
          <Text>100</Text>
        </Div>
        <Text>Доходная часть</Text>
        <Div row justifyContent="flex-end">
          <Div w="60%" row>
            <Text flex={1}>Факт</Text>
            <Text flex={1}>План</Text>
            <Text flex={1}>Отклонение</Text>
            <Text flex={1}>Отклонение в %</Text>
          </Div>
        </Div>
        <BudgetsFlatList
          type={0}
          year={this.state.year}
          month={this.state.month}
          chosenProjects={this.state.projects}
          {...this.props}
        />
        <Text>Расходная часть</Text>
        <BudgetsFlatList
          type={1}
          year={this.state.year}
          month={this.state.month}
          chosenProjects={this.state.projects}
          {...this.props}
        />
        <Button
          onPress={() => {
            this.setState({
              budget: new BudgetTag({
                budget: {
                  year: this.state.year,
                  month: this.state.month,
                  title: '',
                  type: 0,
                },
              }),
            });
          }}>
          <Text>Добавить</Text>
        </Button>
        <Modal
          h="95%"
          isVisible={Boolean(this.state.budget)}
          useNativeDriver
          propagateSwipe
          swipeDirection="down"
          onSwipeComplete={() => this.setState({budget: undefined})}>
          <ModalHeader
            text="Бюджет"
            onCancel={() => this.setState({budget: undefined})}
            onSave={() => {
              this.state.budget
                ?.save()
                .then(() => this.setState({budget: undefined}));
            }}
          />
          <BasicModal>
            <TextInput
              placeholder="Категория"
              onChange={(text) =>
                this.setState((state, props) => {
                  const budget = state.budget;
                  budget!.title = text;
                  return {budget: budget};
                })
              }
            />
            <SegmentedControl
              values={['Приход', 'Расход']}
              selectedIndex={this.state.budget?.type ?? 0}
              onChange={(event) => {
                const i = event.nativeEvent.selectedSegmentIndex;

                this.setState((state, _props) => {
                  const budget = state.budget;
                  if (budget) {
                    budget.type = i;
                    return {budget: budget};
                  } else {
                    return {budget: budget};
                  }
                });
              }}
              style={{
                marginTop: 8,
              }}
            />
            <TextInput
              type="money"
              placeholder="Бюджет"
              onChange={(text) =>
                this.setState((state, props) => {
                  const budget = state.budget;
                  budget!.amount = Number(text);
                  return {budget: budget};
                })
              }
            />
            <ProjectsPicker
              isOptional={false}
              onSelect={(project) =>
                this.setState((state, props) => {
                  const budget = state.budget;
                  if (budget) {
                    budget.project = project;
                    return {budget: budget};
                  }
                })
              }
              selected={this.state.budget?.project}
              tag={this.state.budget}
              // onError={() => this.setState({budget: undefined})}
            />
            <Text>{this.state.budget?.project?.name}</Text>
            {this.state.budget?.model && (
              <>
                <Text flex={1} textAlign="center">
                  Статистика за последние 3 месяца
                </Text>
                <FlatList
                  data={this.previousData}
                  renderItem={(item) => {
                    return (
                      <Div justifyContent="space-between" row>
                        <Text>{item.item.month}</Text>
                        <Div w="60%" row justifyContent="flex-end">
                          <Text flex={1}>{item.item.factual}</Text>
                          <Text flex={1}>{item.item.factual}</Text>
                        </Div>
                      </Div>
                    );
                  }}
                />
              </>
            )}
          </BasicModal>
        </Modal>
      </Div>
    );
  }
}

// const enhanceWithTags = withObservables([], () => ({
//   incomeTags: observeBudgetTags(0),
//   outcomeTags: observeBudgetTags(1),
// }));

// export default enhanceWithTags(Budgets);
