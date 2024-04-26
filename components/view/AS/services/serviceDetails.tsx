import React, {Component} from 'react';
import {Dimensions, ListRenderItemInfo} from 'react-native';
//
import withObservables from '@nozbe/with-observables';
import {StackScreenProps} from '@react-navigation/stack';
import {LineChart} from 'react-native-chart-kit';
import {FlatList} from 'react-native-gesture-handler';
import {Button, Div, Icon, Text} from 'react-native-magnus';
import * as rxjs from 'rxjs';
//
import ServiceModel from '../../../../data/serviceModel';
import ServicePriceModel from '../../../../data/servicePriceModel';
import {Service, ServicePrice} from '../../../../model/service';
import TextInput from '../../../fab/customComponents/TextInput';
import RowActionButton from '../../tab/tabWide/rowActionButton';
import {ASRootStackParamList} from '../asNavigator';
import ProjectModel from '../../../../data/projectModel';
import BasicModal from '../../../markeloView/basicViews/basicModal';
import BasicRectangleView from '../../../markeloView/elements/basicRectangleView';
import RectangleSwitchCalendar from '../../../markeloView/rectangleSwitchCalendar';
import CalendarPickerRow from '../../fab/calendarPickerRow';
import Calendar, {Precision} from '../../../../model/calendar';
import Title from '../../../markeloView/elements/title';
import PostfixInput from '../../../markeloView/elements/postfixInput';
import BasicRectangleRow from '../../../markeloView/elements/basicRectangleRow';
import {binBig} from '../../../markeloView/icons/svg';
import ServiceExecutionModel from '../../../../data/serviceExecutionModel';
import ServicePriceChangePanelNexecutionList from '../../../markeloView/AS/services/servicePriceChangePanelNexecutionList';
import {MarkelovTheme} from '../../../../App';
import WithinRectangleViewButton from '../../../markeloView/elements/withinRectangleViewButton';
import NumberTextInput from '../../../markeloView/elements/numberTextInput';

type Props = StackScreenProps<ASRootStackParamList, 'ServiceDetail'>;

interface EProps extends Props {
  service: ServiceModel;
  prices: ServicePriceModel[];
  project: ProjectModel;
  isVisible: boolean;
  onHide?: () => void;
  onChange?: () => void;
}

interface IState {
  newPrice: ServicePrice;
  indicator: boolean;
}

class ServiceDetail extends Component<EProps, IState> {
  constructor(props: EProps) {
    super(props);

    props?.navigation?.setOptions({headerTitle: props.service.title});

    this.state = {
      indicator: false,
      newPrice: new ServicePrice(new Service({model: this.props.service}), {}),
    };
  }

  render() {
    if (!this.props.service) return <></>;
    const prices = this.props.prices.sort((a, b) => b.createdAt - a.createdAt);
    return (
      <BasicModal
        isVisible={!!this.props.service}
        title="Услуга"
        left="Назад"
        onPressLeft={this.props.onHide}
        right="Изменить"
        onPressRight={this.props.onChange}>
        <BasicRectangleView>
          <Div row justifyContent="space-between" mb={12}>
            <Text
              fontFamily={MarkelovTheme.fontFamily.SemiBold600}
              fontSize={MarkelovTheme.fontSize.M}
              lineHeight={14}
              color="#444D56">
              Дата формирования отчета
            </Text>
          </Div>
          <CalendarPickerRow day={new Calendar()} onDayChange={undefined} />
        </BasicRectangleView>
        <Div row alignItems="center" justifyContent="space-between">
          <Title text={this.props.service.title} mt={24} mb={24} />
          <Text
            fontFamily={MarkelovTheme.fontFamily.SemiBold600}
            fontSize={MarkelovTheme.fontSize.XL}
            color="#92969C">
            {this.props.prices[0].price}₽
          </Text>
        </Div>
        {this.props.prices.length > 3 && (
          <LineChart
            data={{
              labels: prices.map(
                (price) =>
                  `${price.createdAt.getDate()}/${price.createdAt.getMonth()}`,
              ),
              datasets: [
                {
                  data: prices.map((price) => price.price).reverse(),
                },
              ],
            }}
            width={Dimensions.get('window').width - 32} // from react-native
            height={220}
            // yAxisLabel="₽"
            yAxisSuffix="₽"
            // yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#ffa726',
              backgroundGradientTo: this.props.project.color,
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              marginHorizontal: 16,
              borderRadius: 16,
            }}
          />
        )}

        <BasicRectangleView>
          <Div alignItems="center" justifyContent="space-between" mx="lg">
            <Div row justifyContent="space-between" w="100%">
              <Text
                style={{
                  fontFamily: MarkelovTheme.fontFamily.Regular400,
                  fontSize: MarkelovTheme.fontSize.M,
                  lineHeight: 14,
                  color: '#444D56',
                }}>
                Новая цена:
              </Text>
              <NumberTextInput
                postfix="₽"
                placeholder="0"
                value={this.state.newPrice.price}
                onChange={(text) =>
                  this.setState((state, props) => {
                    const price = state.newPrice;
                    price.price = Number(text);
                    return {newPrice: price};
                  })
                }
              />
              {/* <PostfixInput
                postfix="₽"
                placeholder="0"
                value={this.state.newPrice.price.toString()}
                onChange={(text) =>
                  this.setState((state, props) => {
                    const price = state.newPrice;
                    price.price = Number(text);
                    return {newPrice: price};
                  })
                }
              /> */}
            </Div>
            {/* <TextInput
              type="money"
              textValue={this.state.newPrice.price.toString()}
              onChange={(text) =>
                this.setState((state, props) => {
                  const price = state.newPrice;
                  price.price = Number(text);
                  return {newPrice: price};
                })
              }
              placeholder={undefined}
            /> */}
            <WithinRectangleViewButton
              text="Сохранить цену"
              onPress={() => {
                if (this.state.newPrice.price <= 0) return;
                this.state.newPrice.save().then(() =>
                  this.setState({
                    newPrice: new ServicePrice(
                      new Service({model: this.props.service}),
                      {},
                    ),
                  }),
                );
              }}
            />
            {/* <RowActionButton
              text="Добавить"
              onPress={() => {
                if (this.state.newPrice.price <= 0) return;
                this.state.newPrice.save().then(() =>
                  this.setState({
                    newPrice: new ServicePrice(
                      new Service({model: this.props.service}),
                      {},
                    ),
                  }),
                );
              }}
            /> */}
          </Div>
        </BasicRectangleView>
        <Title text="История операций" mt={24} />
        <FlatList
          data={prices}
          renderItem={(item: ListRenderItemInfo<ServicePriceModel>) => {
            const hasChanged = item.index < prices.length - 1;
            let difference: number | undefined;
            let previousPrice: ServicePriceModel;
            if (hasChanged) {
              previousPrice = prices[item.index + 1];
              difference = item.item.price - previousPrice.price;
            }

            return (
              <ServicePriceChangePanelNexecutionList
                servicePrice={item.item}
                difference={difference}
              />
              // <BasicRectangleView mb={12}>
              //   <Div>
              //     <Div row justifyContent="space-between">
              //       <Text
              //         fontSize={18}
              //         fontFamily="Inter-SemiBold"
              //         color="#444D56">
              //         Изменение цены
              //       </Text>
              //       <Text
              //         fontSize={14}
              //         fontFamily="Inter-SemiBold"
              //         color="#000000">
              //         {item.item.price}₽
              //       </Text>
              //     </Div>
              //     <Text fontSize={10} fontFamily="Inter" color="#444D56" mt={4}>
              //       {Calendar.for(item.item.createdAt as Date).readableName(
              //         Precision.Day,
              //       )}
              //     </Text>
              //   </Div>
              //   <Div row mt={12} justifyContent="space-between">
              //     {/* // TODO: make it work */}
              //     <Div>
              //       <Text fontSize={14} fontFamily="Inter" color="#444D56">
              //         Цена до:
              //       </Text>
              //       <Text fontSize={14} fontFamily="Inter" color="#444D56">
              //         Изменение цены:
              //       </Text>
              //     </Div>
              //     <BasicRectangleRow text="" onPress={item.item.delete}>
              //       {binBig({})}
              //     </BasicRectangleRow>
              //   </Div>
              //   {/* <Div
              //     row
              //     mx="lg"
              //     my="sm"
              //     justifyContent="space-between"
              //     borderColor="black"
              //     borderWidth={1}
              //     rounded={6}
              //     p="md">
              //     <Button
              //       p="none"
              //       bg="transparent"
              //       onPress={() => item.item.delete()}>
              //       <Icon
              //         color="red"
              //         name="ios-trash-bin"
              //         fontFamily="Ionicons"
              //       />
              //     </Button>
              //     <Text>{(item.item.createdAt as Date).toLocaleString()}</Text>
              //     {hasChanged && difference! != 0 && (
              //       <Text color={difference! > 0 ? 'green' : 'red'}>
              //         {difference! > 0 ? '+' : ''}
              //         {((difference! / previousPrice!.price) * 100).toFixed(2)}%
              //       </Text>
              //     )}
              //     <Text>{item.item.price}₽</Text>
              //   </Div> */}
              // </BasicRectangleView>
            );
          }}
        />
      </BasicModal>
    );
  }
}

const enhanceWithService = withObservables(
  ['route', 'service'],
  ({route, service}: {route: any; service: ServiceModel}) => {
    if (!route && !service)
      return {service: rxjs.of(undefined), project: rxjs.of(undefined)};
    return {
      service: route?.params?.service ?? service ?? rxjs.of(undefined),
      project:
        route?.params?.service?.project ??
        service?.project ??
        rxjs.of(undefined),
      prices:
        route?.params?.service?.prices ?? service?.prices ?? rxjs.of(undefined),
      // executions: prices[].executions,
      // sale: execution.sale
      // sales: (route?.params?.service?.prices ?? service?.prices).pipe(
      //   rxjs.map((prices: ServicePriceModel[]) => {
      //     return prices.map((price) => {
      //       return {
      //         price: price,
      //         executions: price.executions.observe().pipe(
      //           rxjs.map((execution: ServiceExecutionModel) => {
      //             return {execution: execution, sale: execution.sale};
      //           }),
      //         ),
      //       };
      //     });
      //   }),
      // ),
      // executions: (service?.prices.observe() as rxjs.Observable<
      //   ServicePriceModel[]
      // >).pipe(
      //   rxjs.switchMap((prices) =>
      //     prices.map((price) => {
      //       return {
      //         price: price,
      //         executions: (price.executions.observe() as rxjs.Observable<
      //           ServiceExecutionModel[]
      //         >).pipe(
      //           rxjs.switchMap((executions) =>
      //             executions.map((execution) => {
      //               return {
      //                 execution: execution.observe(),
      //                 sale: execution.sale,
      //               };
      //             }),
      //           ),
      //         ),
      //       };
      //     }),
      //   ),
      // ),
    };
  },
);

export default enhanceWithService(ServiceDetail);
