import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {ActionSheetIOS, FlatList} from 'react-native';
import {Div, Text, ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../../../App';
import ServiceExecutionModel from '../../../../data/serviceExecutionModel';
import ServicePriceModel from '../../../../data/servicePriceModel';
import Calendar, {Precision} from '../../../../model/calendar';
import BasicRectangleRow from '../../elements/basicRectangleRow';
import BasicRectangleView from '../../elements/basicRectangleView';
import {binBig} from '../../icons/svg';
import ServiceSaleExecutionPanel from './serviceSaleExecutionPanel';

interface IProps {
  servicePrice: ServicePriceModel;
  executions: ServiceExecutionModel[];
  difference?: number;
}

interface IState {}

class ServicePriceChangePanelNexecutionList extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  get previousPriceDiv() {
    if (!this.props.difference) return <Div />;
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <Div>
          <Text mt={6} fontSize="M" color="#444D56">
            Цена до: {this.props.servicePrice.price - this.props.difference}₽
          </Text>
          <Div mt={6} row>
            <Text fontSize="M" color="#444D56" mr={6}>
              Изменение цены:
            </Text>
            <Text
              fontSize="M"
              color={this.props.difference > 0 ? '#45B600' : '#444D56'}
              mr={6}>
              {this.props.difference > 0 ? '+' : '-'}
              {this.props.difference}₽
            </Text>
            <Text fontSize="M" color="#92969C">
              {(
                (this.props.difference / this.props.servicePrice.price) *
                100
              ).toFixed(1)}
              %
            </Text>
          </Div>
        </Div>
      </ThemeProvider>
    );
  }

  render() {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <FlatList
          data={this.props.executions.sort(
            (a, b) => b.createdAt.valueOf() - a.createdAt.valueOf(),
          )}
          renderItem={(item) => (
            <ServiceSaleExecutionPanel execution={item.item} />
          )}
        />
        <BasicRectangleView mb={12}>
          <Div mb={6}>
            <Div row justifyContent="space-between">
              <Text fontSize="XL" fontFamily="Inter-SemiBold" color="#444D56">
                Изменение цены
              </Text>
              <Text fontSize="M" fontFamily="Inter-SemiBold" color="#000000">
                {this.props.servicePrice.price}₽
              </Text>
            </Div>
            <Text fontSize="XXS" fontFamily="Inter" color="#444D56" mt={4}>
              {Calendar.for(
                this.props.servicePrice.createdAt as Date,
              ).readableName(Precision.Day)}
            </Text>
          </Div>
          <Div row justifyContent="space-between" alignItems="flex-end">
            {/* // TODO: make it work */}
            <Div>
              <Text mt={6} fontSize="M" color="#444D56" mr={6}>
                Продано: {this.props.executions.length}
              </Text>
              {this.previousPriceDiv}
            </Div>
            <BasicRectangleRow
              text=""
              onPress={() => {
                if (this.props.executions.length == 0) {
                  this.props.servicePrice.delete();
                } else {
                  ActionSheetIOS.showActionSheetWithOptions(
                    {
                      options: ['Отмена', 'Как станет', 'Как было', 'Удалить'],
                      destructiveButtonIndex: 3,
                      cancelButtonIndex: 0,
                      title: 'Удаление цены услуги',
                      message:
                        'Какую цену установить для совершенных продаж по этой цене?',
                    },
                    (buttonIndex: number) => {
                      if (buttonIndex > 0) {
                        this.props.servicePrice.delete(
                          buttonIndex == 3 ? 0 : buttonIndex == 2 ? -1 : 1,
                        );
                      }
                    },
                  );
                }
              }}>
              {binBig({})}
            </BasicRectangleRow>
          </Div>
        </BasicRectangleView>
      </ThemeProvider>
    );
  }
}

const enhanceWithService = withObservables(
  ['servicePrice'],
  ({servicePrice}: {servicePrice: ServicePriceModel}) => {
    return {
      servicePrice: servicePrice,
      executions: servicePrice.executions,
    };
  },
);

export default enhanceWithService(ServicePriceChangePanelNexecutionList);
