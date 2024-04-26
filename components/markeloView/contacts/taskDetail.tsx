import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {Button, Div, Text} from 'react-native-magnus';
import {MarkelovTheme} from '../../../App';
import ArticleModel from '../../../data/articleModel';
import PaymentModel from '../../../data/paymentModel';
import PurchaseModel from '../../../data/purchaseModel';
import SaleModel from '../../../data/saleModel';
import Calendar, {Precision} from '../../../model/calendar';
import {PaymentType} from '../../../model/payment';
import task from '../../main/customElements/task';
import BasicRectangleView from '../elements/basicRectangleView';
import {arrowUp} from '../icons/fab/svg';
import * as RX from 'rxjs';
import ArticleInModel from '../../../data/articleInModel';
import ArticleOutModel from '../../../data/articleOutModel';
import ServiceExecutionModel from '../../../data/serviceExecutionModel';
import TaskDetailRow from './taskDetailRow';

type ArticleInOutModel = ArticleInModel | ArticleOutModel;

interface IProps {
  task: PaymentModel | PurchaseModel | SaleModel;
  articles: ArticleInOutModel[];
  services: ServiceExecutionModel[];
}

interface IState {
  isCollapsed?: boolean;
}

class TaskDetail extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isCollapsed: props.task instanceof PaymentModel ? undefined : false,
    };
  }

  get typeColor(): string {
    if (this.props.task instanceof PurchaseModel)
      return MarkelovTheme.colors.Red;
    if (this.props.task instanceof SaleModel) return MarkelovTheme.colors.Green;
    if (
      this.props.task instanceof PaymentModel &&
      this.props.task.type == PaymentType.Income
    )
      return MarkelovTheme.colors.Green;
    if (
      this.props.task instanceof PaymentModel &&
      this.props.task.type == PaymentType.Outcome
    )
      return MarkelovTheme.colors.Red;
    return MarkelovTheme.colors.BlackBodyText;
  }

  render() {
    return (
      <BasicRectangleView mb={12}>
        <Div row justifyContent="space-between">
          <Div>
            <Text
              fontFamily={MarkelovTheme.fontFamily.SemiBold600}
              fontSize="L"
              pb={8}>
              {this.props.task.title}
            </Text>
            <Text>
              {Calendar.derive(this.props.task.date).readableName(
                Precision.Day,
              )}
            </Text>
          </Div>
          <Text color={this.typeColor} fontSize="L">
            {this.props.task.amount}₽
          </Text>
        </Div>
        {!(this.props.task instanceof PaymentModel) && (
          <>
            <Div row justifyContent="space-between" pt={12}>
              <Text fontFamily={MarkelovTheme.fontFamily.SemiBold600}>
                Позиции:
              </Text>
              <Button
                style={
                  this.state.isCollapsed
                    ? {transform: [{rotateX: '180deg'}]}
                    : {}
                }
                onPress={() =>
                  this.setState((prev) => {
                    return {isCollapsed: !prev.isCollapsed};
                  })
                }>
                {arrowUp({})}
              </Button>
            </Div>
            <Collapsible collapsed={this.state.isCollapsed}>
              <FlatList
                data={this.props.articles.concat(this.props.services)}
                scrollEnabled={false}
                keyExtractor={(item) => item.uuid}
                renderItem={(
                  item: ListRenderItemInfo<
                    ArticleInOutModel | ServiceExecutionModel
                  >,
                ) => <TaskDetailRow product={item.item} />}
              />
            </Collapsible>
          </>
        )}
      </BasicRectangleView>
    );
  }
}

const enhanceWithTask = withObservables(
  ['task'],
  ({task}: {task: PaymentModel | PurchaseModel | SaleModel}) => {
    return {
      task: task,
      articles: task?.articles ?? RX.of([]),
      services: task?.services ?? RX.of([]),
    };
  },
);

export default enhanceWithTask(TaskDetail);
