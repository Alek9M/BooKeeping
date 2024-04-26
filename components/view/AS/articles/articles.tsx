import React, {Component} from 'react';
import {ListRenderItemInfo} from 'react-native';
//
import withObservables from '@nozbe/with-observables';
import {Button, Text} from 'react-native-magnus';
import {FlatList} from 'react-native-gesture-handler';
//
import ArticleModel from '../../../../data/articleModel';
import Article from '../../../../model/article';
import {StackNavigationProp} from '@react-navigation/stack';
import {FabModalRootStackParamList} from '../../fab/entryModalNavigator';
import {database} from '../../../../data/database';
import ArticleInModel from '../../../../data/articleInModel';
import ArticleOutModel from '../../../../data/articleOutModel';
import ArticleRow from './articleRow';
import {Q} from '@nozbe/watermelondb';
import PurchaseModel from '../../../../data/purchaseModel';
import Entry from '../../../../model/entry';
import ArticleDetails from './articleDetails';

interface IProps {
  navigation: StackNavigationProp<FabModalRootStackParamList, 'Prices'>;
  articles: ArticleModel[];
  onPress?: (article: Article) => void;
  purchases: PurchaseModel[];
}

interface IState {
  article?: ArticleModel;
}

class Articles extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {article: undefined};
  }

  render() {
    return (
      <>
        <FlatList
          data={this.props.articles.filter((article) =>
            article.title.includes(this.props.searchWord),
          )}
          keyExtractor={(item: ArticleModel) => item.uuid}
          style={{height: '100%'}}
          renderItem={(item: ListRenderItemInfo<ArticleModel>) => (
            <ArticleRow
              article={item.item}
              onPress={(article: Article) => {
                this.props.onPress?.(article);
                if (this.props.onPress) return;
                this.setState({article: item.item});
              }}
              navigation={this.props.navigation}
            />
          )}
        />
        <ArticleDetails
          article={this.state.article}
          onHide={() => this.setState({article: undefined})}
        />
      </>
    );
  }
}

const enhanceWithServices = withObservables(
  ['selectedProjects'],
  ({selectedProjects}) => ({
    articles: Article.observe()
      .extend
      // Q.experimentalJoinTables(['articleIns']),
      // Q.experimentalNestedJoin('articleIns', 'purchases'),
      // Q.on(
      //   'articleIns',
      //   Q.on('purchases', Entry.filterByProjectDescription(selectedProjects)),
      // ),
      (),
    purchases: database.collections
      .get('purchases')
      .query(Q.where('is_done', true)),
    // .observeWithColumns(['is_done']),
  }),
);

export default enhanceWithServices(Articles);
