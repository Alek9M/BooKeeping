import withObservables from '@nozbe/with-observables';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import BudgetTagModel from '../../../../data/budgetTagModel';
import PaymentModel from '../../../../data/paymentModel';
import PurchaseModel from '../../../../data/purchaseModel';
import SaleModel from '../../../../data/saleModel';
//
import {BudgetsRootStackParamList} from '../moneyNavigator';
import Task from '../../toDo/components/task';
import {Q} from '@nozbe/watermelondb';
import BudgetModal from './budgetModal';
import BudgetTag from '../../../../model/budgetTag';
import {Button, Div, Text} from 'react-native-magnus';
import Project from '../../../../model/project';
import ProjectModel from '../../../../data/projectModel';
import ProjectIcon from '../../tab/tabWide/projectIcon';
import BasicModalView from '../../../markeloView/basicViews/basicModalView';
import {HeaderContextValue, MarkelovTheme} from '../../../../App';
import CalendarPicker, {
  CalendarPickerType,
} from '../../tab/tabWide/calendarPicker';
import Calendar, {Precision} from '../../../../model/calendar';
import CalendarPickerRow from '../../fab/calendarPickerRow';
import BasicRectangleView from '../../../markeloView/elements/basicRectangleView';
import BasicSeparator from '../../../markeloView/basicViews/basicSeparator';
import Title from '../../../markeloView/elements/title';
import ProjectBadge from '../../../markeloView/elements/projectBadge';
import {ListRenderItemInfo} from 'react-native';

type Props = StackNavigationProp<BudgetsRootStackParamList, 'Budget'>;

interface IProps extends Props {
  model: BudgetTagModel;
  payments: PaymentModel[];
  purchases: PurchaseModel[];
  sales: SaleModel[];
  project: ProjectModel;
}

interface IState {
  newBudget?: BudgetTag;
}

class BudgetDetail extends Component<IProps, IState> {
  focusListener = undefined;
  constructor(props: IProps) {
    super(props);

    this.state = {newBudget: undefined};

    props.navigation.setOptions({
      headerTitle: props.model.title,
      headerShown: false,
      headerRight: () => (
        <>
          <Button
            bg="transparent"
            onPress={() =>
              this.setState({
                newBudget: new BudgetTag(
                  {model: props.model},
                  new Project({model: props.project}),
                ),
              })
            }>
            <Text>Edit</Text>
          </Button>
        </>
      ),
    });
  }

  // componentDidMount() {
  //   const headerContext: HeaderContextValue = this.props.route.params
  //     .headerContext;
  //   headerContext.setHeaderVisible(false);
  // }

  componentWillMount() {
    const headerContext: HeaderContextValue = this.props.route.params
      .headerContext;
    headerContext.setHeaderVisible(false);
  }

  componentWillUnmount() {
    const headerContext: HeaderContextValue = this.props.route.params
      .headerContext;
    headerContext.setHeaderVisible(true);
  }

  sumUp(entry: (SaleModel | PaymentModel | PurchaseModel)[]): number {
    return entry.reduce((sum, next) => (sum += next.amount), 0);
  }

  spent(): number {
    return (
      this.sumUp(this.props.payments) +
      this.sumUp(this.props.sales) +
      this.sumUp(this.props.purchases)
    );
  }

  get activity(): (PaymentModel | PurchaseModel | SaleModel)[] {
    return this.props.payments
      .concat(this.props.purchases)
      .concat(this.props.sales);
  }

  render() {
    return (
      <>
        <BasicModalView
          title="Бюджет"
          left="Назад"
          onPressLeft={() => this.props.navigation.goBack()}
          right="Изменить"
          onPressRight={() =>
            this.setState({
              newBudget: new BudgetTag(
                {model: this.props.model},
                new Project({model: this.props.project}),
              ),
            })
          }>
          <BasicSeparator vertical={24}>
            <CalendarPicker
              type={CalendarPickerType.Month}
              day={Calendar.of(
                this.props.model.year,
                this.props.model.month,
                1,
              )}
            />
            <BasicRectangleView>
              <Text fontFamily={MarkelovTheme.fontFamily.SemiBold600} mb={12}>
                Дата формирования отчета
              </Text>
              <CalendarPickerRow
                day={new Calendar()}
                onDayChange={undefined}
                title="Дата формирования отчета"
              />
            </BasicRectangleView>
            <BasicSeparator vertical={12}>
              <Title text={this.props.model.title} mb={0} />
              <Div row justifyContent="space-between" alignItems="center">
                <Text fontSize="XL">{this.props.model.amount}₽</Text>
                <ProjectBadge isOn project={this.props.project} />
              </Div>
              <Div w="100%" h={50} bg="#F9F9FA" rounded={7}>
                <Div
                  bg="#ADF0A2"
                  h={50}
                  rounded={7}
                  position="absolute"
                  w="30%"
                  // w={`${Math.min(
                  //   100,
                  //   this.spent() / this.props.model.amount * 100,
                  // )}%`}
                />
                <Div
                  row
                  position="absolute"
                  w="100%"
                  px={20}
                  py={9}
                  justifyContent="space-between">
                  <Div>
                    <Text
                      fontFamily={MarkelovTheme.fontFamily.SemiBold600}
                      fontSize="S">
                      {(this.spent() / this.props.model.amount) * 100}%
                    </Text>
                    <Text fontSize="S">{this.spent()}₽</Text>
                  </Div>
                  <Div>
                    <Text
                      textAlign="right"
                      fontFamily={MarkelovTheme.fontFamily.SemiBold600}
                      fontSize="S">
                      {((this.props.model.amount - this.spent()) /
                        this.props.model.amount) *
                        100}
                      %
                    </Text>
                    <Text fontSize="S" textAlign="right">
                      {this.props.model.amount - this.spent()}₽
                    </Text>
                  </Div>
                </Div>
              </Div>
            </BasicSeparator>
            {this.activity.length > 0 && (
              <Title text="История операций" mb={0} />
            )}

            <FlatList
              data={this.activity}
              renderItem={(
                item: ListRenderItemInfo<
                  PaymentModel | PurchaseModel | SaleModel
                >,
              ) => (
                // <Task checkable={false} entry={item.item} />
                <BasicRectangleView>
                  <Div row justifyContent="space-between">
                    <Div>
                      <Text
                        mb={10}
                        fontFamily={MarkelovTheme.fontFamily.SemiBold600}
                        fontSize="XL">
                        {item.item.title}
                      </Text>
                      <Text fontSize="XXS">
                        {Calendar.derive(item.item.date).readableName(
                          Precision.Day,
                        )}
                      </Text>
                    </Div>
                    <Div>
                      <Text mb={6} textAlign="right">
                        {item.item.amount}₽
                      </Text>
                      <Text textAlign="right" fontSize="S">
                        {(
                          (item.item.amount / this.props.model.amount) *
                          100
                        ).toFixed(0)}
                        %
                      </Text>
                    </Div>
                  </Div>
                </BasicRectangleView>
              )}
            />
          </BasicSeparator>
          <BudgetModal
            budgetTag={this.state.newBudget}
            onChange={(budget) => {
              this.setState({newBudget: budget});
            }}
            onDelete={() => {
              this.setState({newBudget: undefined}, () => {
                this.props.navigation.goBack();
              });
            }}
            savedReturnValue={null}
          />
        </BasicModalView>
      </>
    );
  }
}

function periodQuery(tag: BudgetTagModel): Q.And {
  return Q.and(Q.where('year', tag.year), Q.where('month', tag.month));
}

const enhanceWithEntries = withObservables(['route'], ({route}) => ({
  model: route.params.model,
  project: route.params.model.project,
  payments: route.params.model.payments.extend(
    periodQuery(route.params.model),
    Q.where('is_done', true),
  ),
  purchases: route.params.model.purchases.extend(
    periodQuery(route.params.model),
    Q.where('is_done', true),
    Q.where('payment_id', null),
  ),
  sales: route.params.model.sales.extend(
    periodQuery(route.params.model),
    Q.where('is_done', true),
    Q.on('payments', 'sale_id', Q.notEq(Q.column('id'))),
  ),
}));

export default enhanceWithEntries(BudgetDetail);
