import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {Button, Div, Icon, Text} from 'react-native-magnus';
import {EntryContext} from '../../../../App';
import ArticleInModel from '../../../../data/articleInModel';
import ArticleModel from '../../../../data/articleModel';
import ArticleOutModel from '../../../../data/articleOutModel';
import ProjectModel from '../../../../data/projectModel';
import PurchaseModel from '../../../../data/purchaseModel';
import SaleModel from '../../../../data/saleModel';
import ServiceExecutionModel from '../../../../data/serviceExecutionModel';
import Project from '../../../../model/project';
import Purchase from '../../../../model/purchase';
import Sale from '../../../../model/sale';
import PurchaseList from './purchaseList';

interface IProps {
  sale: SaleModel;
  project: ProjectModel;
  articles: ArticleOutModel[];
  services: ServiceExecutionModel[];
}

interface IState {}

class SaleDetail extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <EntryContext.Consumer>
        {(value) => (
          <Div
            row
            alignSelf="center"
            justifyContent="space-between"
            w="80%"
            alignItems="center">
            <Button
              bg="gray100"
              m="sm"
              onPress={() => {
                const project = new Project({model: this.props.project});
                const purchase = new Sale(project, {
                  model: this.props.sale,
                });
                purchase.load().then(() => value.onChangeEntry(purchase));
              }}>
              <Div flex={1}>
                <Text fontSize="xl">{this.props.sale.title}</Text>
                <Text>{this.props.sale.date}</Text>
                {/* //!! */}
                {/* <FlatList
                  data={this.props.articles}
                  renderItem={(item) => <PurchaseList articleIn={item.item} />}
                /> */}
              </Div>
              <Text color="green" fontSize="xl">
                {this.props.sale.amount}₽
              </Text>
              <Icon name="arrow-right" fontFamily="SimpleLineIcons" pl="sm" />
            </Button>
          </Div>
        )}
      </EntryContext.Consumer>
    );
  }
}

const enhanceWithContact = withObservables(
  ['sale'],
  ({sale}: {sale: SaleModel}) => ({
    sale: sale,
    project: sale.project,
    articles: sale.articles,
    services: sale.services,
  }),
);

export default enhanceWithContact(SaleDetail);
