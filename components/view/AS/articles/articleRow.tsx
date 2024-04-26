import React, {Component} from 'react';
//
import withObservables from '@nozbe/with-observables';
import {Button, Div, Text, ThemeProvider} from 'react-native-magnus';
import {FlatList} from 'react-native-gesture-handler';
import {Q} from '@nozbe/watermelondb';
//
import ArticleInModel from '../../../../data/articleInModel';
import ArticleModel from '../../../../data/articleModel';
import ArticleOutModel from '../../../../data/articleOutModel';
import Article from '../../../../model/article';
import Entry, {EntryTable} from '../../../../model/entry';
import {database} from '../../../../data/database';
import ASRowButton from '../asRowButton';
import ProjectModel from '../../../../data/projectModel';
import ProjectIcon from '../../tab/tabWide/projectIcon';
import ProjectBadge from '../../../markeloView/elements/projectBadge';
import {MarkelovTheme} from '../../../../App';

interface IProps {
  article: ArticleModel;
  incoming: ArticleInModel[];
  incomingDone: ArticleInModel[];
  outcoming: ArticleOutModel[];
  outcomingDone: ArticleOutModel[];
  onPress?: (article: Article) => void;
  navigation: any;
  projects: ProjectModel[];
}

interface IState {
  projects: ProjectModel[];
}

class ArticleRow extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      projects: [],
    };

    // this.fillProjects()
  }

  get quantity(): number {
    const inQuantity = this.props.incomingDone.reduce(
      (acc, next) => acc + next.quantity,
      0,
    );
    const outQuantity = this.props.outcomingDone.reduce(
      (acc, next) => acc + next.quantity,
      0,
    );
    return inQuantity - outQuantity;
  }

  get oldestDoneInStock(): ArticleInModel | undefined {
    if (this.props.incomingDone.length > 0) {
      const oldestStock = this.props.incomingDone.reduce((oldest, next) => {
        if (oldest.createdAt > next.createdAt) {
          return next;
        } else {
          return oldest;
        }
      });
      return oldestStock;
    } else {
      return undefined;
    }
  }

  async fillProjects() {
    for (const articleIn of this.props.incomingDone) {
      const purchase = await articleIn.purchases.fetch();
      const project = await purchase.project.fetch();
    }
  }

  //   getCurrentSellingPrice(): number | undefined {
  //     const oldest = this.getOldestStock();
  //     return oldest?.suggestedPriceOut ?? undefined;
  //   }

  //   getCurrentPriceIn(): number | undefined {
  //     const oldest = this.getOldestStock();
  //     return oldest?.priceIn ?? undefined;
  //   }

  render() {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <ASRowButton
          onPress={() => {
            if (this.props.onPress) {
              const article = new Article({model: this.props.article});
              this.props.onPress(article);
            } else {
              this.props.navigation.navigate('ArticleDetail', {
                article: this.props.article,
              });
            }
          }}>
          <Div row justifyContent="space-between" flex={1}>
            <Div>
              <Div row alignItems="center" mb={6}>
                <Text
                  fontSize="XL"
                  color="#444D56"
                  fontFamily={MarkelovTheme.fontFamily.SemiBold600}>
                  {this.props.article.title}
                </Text>
                <Text
                  fontSize="XXS"
                  fontFamily={MarkelovTheme.fontFamily.Regular400}
                  color="#92969C"
                  ml={6}>
                  {this.quantity}шт
                </Text>
              </Div>

              <FlatList
                data={this.props.projects}
                keyExtractor={(item) => item.uuid}
                renderItem={(item) => <ProjectBadge isOn project={item.item} />}
              />
            </Div>
            {this.oldestDoneInStock && (
              <Div>
                <Text
                  fontSize="M"
                  color="#000000"
                  fontFamily={MarkelovTheme.fontFamily.SemiBold600}
                  textAlign="right"
                  mb={6}>
                  {this.oldestDoneInStock.suggestedPriceOut}₽
                </Text>
                <Div row alignItems="center">
                  <Text
                    fontSize="XXS"
                    color="#000000"
                    fontFamily={MarkelovTheme.fontFamily.Regular400}>
                    {this.oldestDoneInStock.priceIn}₽
                  </Text>
                  <Text
                    fontSize="XXS"
                    color="#92969C"
                    fontFamily={MarkelovTheme.fontFamily.Regular400}>
                    +{this.oldestDoneInStock.profit}₽
                  </Text>
                </Div>
              </Div>
            )}
          </Div>
        </ASRowButton>
      </ThemeProvider>
    );
  }
}

const enhanceWithServices = withObservables(
  ['article'],
  ({article}: {article: ArticleModel}) => ({
    article: article,
    incoming: article.ins,
    incomingDone: article.ins.extend(
      // Q.experimentalNestedJoin()
      // Q.experimentalJoinTables(['purchases']),
      Q.on('purchases', 'is_done', true),
      Q.experimentalSortBy('created_at'),
    ),
    //ArticleInModel.getDoneFor(article),
    outcoming: article.outs,

    outcomingDone: article.outs.extend(
      // Q.experimentalNestedJoin('articleOuts', 'sales'),
      Q.on('sales', 'is_done', true),
      Q.experimentalSortBy('created_at'),
    ),
    projects: database
      .get('projects')
      .query(
        Q.experimentalNestedJoin('purchases', 'articleIns'),
        Q.on('purchases', Q.on('articleIns', 'article_id', article.id)),
      ),
  }),
);

export default enhanceWithServices(ArticleRow);
