import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {Div, Text} from 'react-native-magnus';
import {MarkelovTheme} from '../../../../App';
import ProjectModel from '../../../../data/projectModel';
import ServiceModel from '../../../../data/serviceModel';
import ServicePriceModel from '../../../../data/servicePriceModel';
import ProjectBadge from '../../../markeloView/elements/projectBadge';
import ProjectIcon from '../../tab/tabWide/projectIcon';
import ASRowButton from '../asRowButton';

interface IProps {
  service: ServiceModel;
  prices: ServicePriceModel[];
  project: ProjectModel;
  onPress: () => void;
}

interface IState {}

class ServiceRow extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const latestPrice = this.props.prices.sort(
      (a, b) => b.createdAt - a.createdAt,
    )?.[0]?.price;
    return (
      <ASRowButton onPress={this.props.onPress}>
        <Div
          justifyContent="space-between"
          row
          flex={1}
          alignItems="flex-start">
          <Div flex={1}>
            <Text
              fontSize={MarkelovTheme.fontSize.XL}
              color="#444D56"
              fontFamily={MarkelovTheme.fontFamily.SemiBold600}
              mb={6}>
              {this.props.service.title}
            </Text>
            <ProjectBadge isOn project={this.props.project} />
          </Div>

          {latestPrice && (
            <Text
              ml={6}
              numberOfLines={1}
              fontSize={MarkelovTheme.fontSize.M}
              color="#000000"
              fontFamily={MarkelovTheme.fontFamily.SemiBold600}
              textAlign="right">
              {latestPrice.toFixed(2)}₽
            </Text>
          )}
        </Div>
      </ASRowButton>
    );
  }
}

const enhanceWithServices = withObservables(
  ['service'],
  ({service}: {service: ServiceModel}) => ({
    service,
    prices: service.prices,
    project: service.project,
  }),
);

export default enhanceWithServices(ServiceRow);
