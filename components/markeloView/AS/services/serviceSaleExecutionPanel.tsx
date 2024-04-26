import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {Div, Text, ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../../../App';
import ProjectModel from '../../../../data/projectModel';
import SaleModel from '../../../../data/saleModel';
import ServiceExecutionModel from '../../../../data/serviceExecutionModel';
import ServicePriceModel from '../../../../data/servicePriceModel';
import Calendar, {Precision} from '../../../../model/calendar';
import BasicRectangleView from '../../elements/basicRectangleView';
import ProjectBadge from '../../elements/projectBadge';

interface IProps {
  execution: ServiceExecutionModel;
  sale: SaleModel;
  price: ServicePriceModel;
  project: ProjectModel;
}

interface IState {}

class ServiceSaleExecution extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  text(text: string) {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <Text mt={6} fontSize="M" color="#444D56" mr={6}>
          {text}
        </Text>
      </ThemeProvider>
    );
  }

  render() {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <BasicRectangleView mb={12}>
          <Div row justifyContent="space-between" mb={6}>
            <Div>
              <Text
                fontSize="XL"
                fontFamily={MarkelovTheme.fontFamily.SemiBold600}
                color="#444D56">
                {this.props.sale.title}
              </Text>
              <Text fontSize="XXS" color="#444D56" mt={4}>
                {Calendar.derive(this.props.sale.date).readableName(
                  Precision.Day,
                )}
              </Text>
            </Div>
            <ProjectBadge project={this.props.project} isOn />
          </Div>
          {this.text(`Количество: ${this.props.execution.quantity}шт`)}
          {this.text(`Цена продажи: ${this.props.price.price}₽`)}
          {this.text(
            `Сумма: ${this.props.execution.quantity * this.props.price.price}₽`,
          )}
        </BasicRectangleView>
      </ThemeProvider>
    );
  }
}

const enhanceWithService = withObservables(
  ['execution'],
  ({execution}: {execution: ServiceExecutionModel}) => {
    return {
      execution: execution,
      sale: execution.sale,
      price: execution.price,
    };
  },
);

const enhanceWithProject = withObservables(
  ['sale'],
  ({sale}: {sale: SaleModel}) => {
    return {
      project: sale.project,
    };
  },
);

export default enhanceWithService(enhanceWithProject(ServiceSaleExecution));
