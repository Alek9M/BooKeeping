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
import Project from '../../../../model/project';
import Purchase from '../../../../model/purchase';
import PurchaseList from './purchaseList';

interface IProps {
  purchase: PurchaseModel;
  project: ProjectModel;
  articles: ArticleInModel[];
}

interface IState {}

class PurchaseDetail extends Component<IProps, IState> {
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
                const purchase = new Purchase(project, {
                  model: this.props.purchase,
                });
                purchase.load().then(() => value.onChangeEntry(purchase));
              }}>
              <Div flex={1}>
                <Text fontSize="xl">{this.props.purchase.title}</Text>
                <Text>{this.props.purchase.date}</Text>
                <FlatList
                  data={this.props.articles}
                  renderItem={(item) => <PurchaseList articleIn={item.item} />}
                />
              </Div>
              <Text color="red" fontSize="xl">
                {this.props.purchase.amount}₽
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
  ['purchase'],
  ({purchase}: {purchase: PurchaseModel}) => ({
    purchase: purchase,
    project: purchase.project,
    articles: purchase.articles,
  }),
);

export default enhanceWithContact(PurchaseDetail);
