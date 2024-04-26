import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {Div, Text} from 'react-native-magnus';
import ArticleInModel from '../../../../data/articleInModel';
import ArticleModel from '../../../../data/articleModel';
import ArticleOutModel from '../../../../data/articleOutModel';

interface DProps {
  article: ArticleModel;
  articleIn: ArticleInModel;
}

interface DState {}

class PurchaseDetailListItem extends Component<DProps, DState> {
  constructor(props: DProps) {
    super(props);
  }

  render() {
    return (
      <Div
        rounded={8}
        w="100%"
        borderLeftWidth={1}
        py="sm"
        my="sm"
        borderLeftColor="gray">
        <Text>{this.props.article.title}</Text>
        <Text>
          {this.props.articleIn.quantity} x {this.props.articleIn.priceIn}₽
        </Text>
      </Div>
    );
  }
}

const enhanceWithPur = withObservables(
  ['articleIn'],
  ({articleIn}: {articleIn: ArticleInModel}) => ({
    articleIn: articleIn,
    article: articleIn.article,
  }),
);

export default enhanceWithPur(PurchaseDetailListItem);
