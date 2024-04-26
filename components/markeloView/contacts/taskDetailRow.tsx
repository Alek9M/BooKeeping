import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {Div, Text} from 'react-native-magnus';
import ArticleInModel from '../../../data/articleInModel';
import ArticleModel from '../../../data/articleModel';
import ArticleOutModel from '../../../data/articleOutModel';
import ServiceExecutionModel from '../../../data/serviceExecutionModel';
import ServiceModel from '../../../data/serviceModel';
import ServicePriceModel from '../../../data/servicePriceModel';
import * as RX from 'rxjs';

interface IProps {
  product: ArticleInModel | ArticleOutModel | ServiceExecutionModel;
  servicePrice?: ServicePriceModel;
  service?: ServiceModel;
  article?: ArticleModel;
}

interface IState {}

class TaskDetailRow extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  get price(): number {
    if (this.props.product instanceof ArticleInModel)
      return this.props.product.priceIn;
    if (this.props.product instanceof ArticleOutModel)
      return this.props.product.priceOut;
    if (this.props.product instanceof ServiceExecutionModel)
      return this.props.servicePrice!.price;
    return -1;
  }

  render() {
    return (
      <Div row mt={12}>
        <Text flex={12} pr={6}>
          {this.props.service?.title ?? this.props.article?.title}
        </Text>
        <Text flex={6} pr={6} numberOfLines={1}>
          {this.price}₽
        </Text>
        <Text flex={2} pr={6} numberOfLines={1}>
          {this.props.product.quantity}
        </Text>
        <Text flex={6} numberOfLines={1}>
          {this.price * this.props.product.quantity}₽
        </Text>
      </Div>
    );
  }
}

const enhanceWithProduct = withObservables(
  ['product'],
  ({
    product,
  }: {
    product: ArticleInModel | ArticleOutModel | ServiceExecutionModel;
  }) => {
    if (product instanceof ServiceExecutionModel)
      return {
        product: product,
        servicePrice: product.price,
      };
    return {
      product: product,
      article: product.article,
    };
  },
);
const enhanceWithService = withObservables(
  ['servicePrice'],
  ({servicePrice}: {servicePrice?: ServicePriceModel}) => {
    return {
      service: servicePrice?.service ?? RX.of(undefined),
    };
  },
);

export default enhanceWithProduct(enhanceWithService(TaskDetailRow));
