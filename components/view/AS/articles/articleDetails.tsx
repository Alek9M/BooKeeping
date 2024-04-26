import React, {Component} from 'react';
//
import withObservables from '@nozbe/with-observables';
import {FlatList} from 'react-native-gesture-handler';
import {Button, Div, Text} from 'react-native-magnus';
import {StackScreenProps} from '@react-navigation/stack';
import ArticleModel from '../../../../data/articleModel';
import ArticleInModel from '../../../../data/articleInModel';
import {RootStackParamList} from '../../../main/navigation';
import {Service, ServicePrice} from '../../../../model/service';
import ArticleOutModel from '../../../../data/articleOutModel';
import {ASRootStackParamList} from '../asNavigator';
import AIModelToTask from '../details/converters/AIModelToTask';
import AOModelToTask from '../details/converters/AOModelToTask';
import {ListRenderItemInfo} from 'react-native';
import {Q} from '@nozbe/watermelondb';
import BasicModal from '../../../markeloView/basicViews/basicModal';
import * as rxjs from 'rxjs';
import BasicRectangleView from '../../../markeloView/elements/basicRectangleView';
import {MarkelovTheme} from '../../../../App';
import CalendarPickerRow from '../../fab/calendarPickerRow';
import Calendar from '../../../../model/calendar';
import Title from '../../../markeloView/elements/title';
import BasicSeparator from '../../../markeloView/basicViews/basicSeparator';
import BasicRectangleRow from '../../../markeloView/elements/basicRectangleRow';
import {barCode} from '../../../markeloView/icons/fab/svg';
import {cross} from '../../../markeloView/icons/as/svg';
import PostfixInput from '../../../markeloView/elements/postfixInput';
import WithinRectangleViewButton from '../../../markeloView/elements/withinRectangleViewButton';
import RectangleToggleRow from '../../../markeloView/elements/rectangleToggleRow';
import NumberTextInput from '../../../markeloView/elements/numberTextInput';
//
// import ServiceModel from '../../data/serviceModel';
// import ServicePriceModel from '../../data/servicePriceModel';
// import {Service, ServicePrice} from '../../model/service';
// import TextInput from '../fab/customComponents/TextInput';
// import {RootStackParamList} from './navigation';

type Props =
  // | StackScreenProps<RootStackParamList, 'ArticleDetail'>
  StackScreenProps<ASRootStackParamList, 'ArticleDetail'>;

interface EProps extends Props {
  article: ArticleModel;
  incoming: ArticleInModel[];
  outcoming: ArticleOutModel[];
  onHide?: () => void;
}

interface IState {}

class ArticleDetail extends Component<EProps, IState> {
  models: (ArticleInModel | ArticleOutModel)[];

  constructor(props: EProps) {
    super(props);
    if (!props.article) return;
    // props.navigation.setOptions({title: props.article.title});
    this.models = props.incoming
      .concat(props.outcoming)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  render() {
    if (!this.props.article) return <></>;
    return (
      <>
        <BasicModal
          isVisible={!!this.props.article}
          title="Продукт"
          left="Назад"
          onPressLeft={this.props.onHide}>
          {/* <Div>
            <FlatList
              data={this.props.incoming}
              keyExtractor={(item) => item.uuid}
              renderItem={(item: ListRenderItemInfo<ArticleInModel>) => (
                <Div
                  m="md"
                  borderWidth={1}
                  borderColor="black"
                  rounded={8}
                  p="sm">
                  <Text>{item.item.createdAt.toLocaleString()}</Text>
                  <Text>Партия {item.item.quantity}</Text>
                  <Text>Закупочная цена {item.item.priceIn}₽</Text>
                </Div>
              )}
            />
          </Div> */}
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
            <Title text={this.props.article.title} mt={24} mb={24} />
            <Text
              fontFamily={MarkelovTheme.fontFamily.SemiBold600}
              fontSize={MarkelovTheme.fontSize.XL}
              color="#92969C">
              {this.props.incoming[0]?.suggestedPriceOut}₽
            </Text>
          </Div>
          <BasicSeparator vertical={12}>
            <BasicRectangleView>
              <Text color="Red" mb={6}>
                Продано больше, чем было
              </Text>
              <Text color="Red">Докупите продукт</Text>
            </BasicRectangleView>
            <BasicRectangleView>
              <Text>Осталось:</Text>
              <Text>Зарезервировано:</Text>
              <BasicRectangleView mt={6}>
                <Text fontFamily={MarkelovTheme.fontFamily.SemiBold600}>
                  Ирина Ивановна
                </Text>
                <Text mt={8}>10шт * 40₽ = 400₽</Text>
              </BasicRectangleView>
            </BasicRectangleView>
            <BasicRectangleView>
              <Div row justifyContent="space-between" alignItems="center">
                <Text fontFamily={MarkelovTheme.fontFamily.SemiBold600}>
                  Добавить штрих-код
                </Text>
                {barCode({})}
              </Div>
            </BasicRectangleView>
            <BasicRectangleView>
              <Text fontFamily={MarkelovTheme.fontFamily.SemiBold600} mb={12}>
                Штрих-коды
              </Text>
              <Div row alignItems="center">
                {cross({})}
                <Text ml={6}>2 347164 936194</Text>
              </Div>
            </BasicRectangleView>
            <BasicRectangleView>
              <Div row justifyContent="space-between">
                <Text>Списать:</Text>
                {/* <PostfixInput
                  postfix="шт"
                  placeholder="0"
                  value=""
                  onChange={undefined}
                /> */}
                <NumberTextInput
                  postfix="шт"
                  placeholder="0"
                  value=""
                  onChange={undefined}
                />
              </Div>
              <WithinRectangleViewButton text="Списать" />
            </BasicRectangleView>
            <RectangleToggleRow
              text="Напомнить об окончании"
              isOn={true}
              onSwitch={undefined}>
              <Div row justifyContent="space-between" mt={16}>
                <Text>Если товара меньше, чем:</Text>
                <PostfixInput
                  postfix="шт"
                  placeholder="0"
                  value=""
                  onChange={undefined}
                />
                <NumberTextInput
                  postfix="шт"
                  placeholder="0"
                  value=""
                  onChange={undefined}
                />
              </Div>
            </RectangleToggleRow>
            <FlatList
              data={this.models}
              keyExtractor={(model: ArticleInModel | ArticleOutModel) =>
                model.uuid
              }
              renderItem={(item) =>
                item.item instanceof ArticleInModel ? (
                  <AIModelToTask articleIn={item.item} />
                ) : (
                  <AOModelToTask articleOut={item.item} />
                )
              }
            />
            <Div h={150} />
          </BasicSeparator>
        </BasicModal>
      </>
    );
  }
}

const enhanceWithService = withObservables(
  ['route', 'article'],
  ({route, article}) => {
    if (!route && !article) return {article: rxjs.of(undefined)};
    const leArticle = route?.params?.article ?? article;
    return {
      article: leArticle,
      incoming: leArticle.ins.extend(
        Q.experimentalJoinTables(['purchases']),
        Q.on('purchases', 'is_done', true),
      ),
      outcoming: leArticle.outs.extend(
        Q.experimentalJoinTables(['sales']),
        Q.on('sales', 'is_done', true),
      ),
    };
  },
);

export default enhanceWithService(ArticleDetail);
