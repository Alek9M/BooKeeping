import {StackScreenProps} from '@react-navigation/stack';
import React, {Component, useContext} from 'react';
import {Alert, FlatList, ListRenderItemInfo, TextInput} from 'react-native';
//
import {Button, Div, Text} from 'react-native-magnus';

//
import {FabModalRootStackParamList} from './entryModalNavigator';
import {EntryContext, MarkelovTheme} from '../../../App';
import HeaderButton from '../../../components/fab/customComponents/headerButton';
// import TextInput from '../../fab/customComponents/TextInput';
import Entry from '../../../model/entry';
import Project from '../../../model/project';

import Note from '../../../model/note';
import Payment, {PaymentType} from '../../../model/payment';
import Task from '../../../model/task';
import BudgetTag from '../../../model/budgetTag';
import Purchase from '../../../model/purchase';

import Sale from '../../../model/sale';

import IContact, {Contact} from '../../../model/contact';

import Calendar from '../../../model/calendar';
import PurchaseButtonRow from '../../fab/customComponents/purchaseItemRow';
import Article, {ArticleIn} from '../../../model/article';
import SaleContactRow from '../../fab/customComponents/saleContactRow';
import {Service} from '../../../model/service';
import ProjectModel from '../../../data/projectModel';
import BudgetTagChooser from './BudgetTagChooser';
import BudgetTagModel from '../../../data/budgetTagModel';
import CalendarPickerRow from './calendarPickerRow';
import QRScan, {BillQR} from './forms/qrScan';
import BasicModalView from '../../markeloView/basicViews/basicModalView';
import ProjectsRow from '../../markeloView/projectsRow';
import TextInputRow from '../../markeloView/elements/textInputRow';
import TextInputPanel from '../../markeloView/elements/textInputPanel';
import ProjectBadge from '../../markeloView/elements/projectBadge';
import BasicRectangleRow from '../../markeloView/elements/basicRectangleRow';
import BasicRectangleView from '../../markeloView/elements/basicRectangleView';
import {note, plus, plusThin, qr} from '../../markeloView/icons/fab/svg';
import RectangleToggleRow from '../../markeloView/elements/rectangleToggleRow';
import RoundSelector from '../../markeloView/elements/roundSelector';
import Checkbox from '../../markeloView/elements/checkbox';
import RectangleSwitchCalendar from '../../markeloView/rectangleSwitchCalendar';
import SquareSelector from '../../markeloView/elements/squareSelector';
import BasicSeparator from '../../markeloView/basicViews/basicSeparator';
import RectangleList from '../../markeloView/RectangleList';
import SaleButtonRow from '../../fab/customComponents/saleItemRow';
import NumberTextInput from '../../markeloView/elements/numberTextInput';
import NoteListItemModel from '../../../data/noteListItemModel';

type EntryContextValue = {
  entry?: Entry;
  onChangeEntry: (object: Entry | undefined) => void;
  project?: Project | undefined;
  onChangeProject: (object: Project | undefined) => void;
};

type Props = StackScreenProps<FabModalRootStackParamList, 'Entry'>;

interface IProps {}

interface IState {
  repeatTill?: Calendar;
  repeatEvery?: number;
  warn: boolean;
}

export default class EntryModal extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      warn: false,
      repeatEvery: undefined,
      repeatTill: undefined,
    };
  }

  get isRepeating(): boolean {
    return !!this.state.repeatTill;
  }

  set isRepeating(v: boolean) {
    if (v) {
      this.setState({repeatEvery: 7, repeatTill: new Calendar()});
    } else {
      this.setState({repeatEvery: undefined, repeatTill: undefined});
    }
  }

  setNavigationOptions() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <EntryContext.Consumer>
          {(value: EntryContextValue) => (
            <HeaderButton
              title="Сохранить"
              onPress={() => {
                if (!value.entry?.isValid() ?? false) {
                  this.setState({warn: true});
                } else {
                  if (value.entry?.sum && value.entry.totalAmount == 0) {
                    this.changeEntry(value, 'totalAmount', value.entry.sum);
                  }
                  this.save(value);
                  // value.entry?.save().then(() => value.onChangeEntry(undefined));
                }
              }}
              // disabled={!value.entry?.isValid() ?? false}
            />
          )}
        </EntryContext.Consumer>
      ),
    });
  }

  async save(value: EntryContextValue) {
    if (
      this.isRepeating &&
      value.entry?.date &&
      this.state.repeatEvery &&
      this.state.repeatTill
    ) {
      let next = value.entry.date.copy;
      next.add(this.state.repeatEvery);
      while (next.isBeforeInc(this.state.repeatTill)) {
        let entry = (value.entry.copy as typeof value.entry)!;
        entry.date = next;
        await entry.save();
        next.add(this.state.repeatEvery);
      }
    }
    await value.entry?.save();
    value.onChangeEntry(undefined);
  }

  componentDidUpdate() {
    // this.setNavigationOptions();
    const entry = this.context.value?.entry;
    if (entry && entry instanceof Payment && this.props.route.params.qr)
      this.onPaymentQRFound(this.props.route.params.qr, this.context.value);
  }

  onPaymentQRFound(qr: BillQR, value) {
    var entry = value.entry;
    if (!entry || !(entry instanceof Payment)) return;
    entry.done = true;
    entry.date = Calendar.qr(qr);
    entry.type = PaymentType.Outcome;
    entry.totalAmount = qr.sum;
    value.onChangeEntry(entry);
  }

  componentDidMount() {
    // this.setNavigationOptions();
  }

  changeEntry(value: EntryContextValue, property: string, data: any) {
    if (value.entry) {
      const entry = value.entry;
      entry[property] = data;
      value.onChangeEntry(entry);
    }
  }

  budgetType(entry: Entry) {
    if (entry instanceof Payment) return entry.type;
    if (entry instanceof Sale) return PaymentType.Income;
    if (entry instanceof Purchase) return PaymentType.Outcome;
  }

  qrButton(value: EntryContextValue) {
    if (!(value.entry instanceof Payment) && !(value.entry instanceof Purchase))
      return;
    return (
      <BasicRectangleView
        px={9}
        py={0}
        h={40}
        w={40}
        ml={10}
        onPress={() => {
          this.props.navigation.navigate('QR', {
            onQRFound: (qr) => {
              var entry = value.entry;
              if (!entry || !(entry instanceof Payment)) return;
              entry.done = true;
              entry.date = Calendar.qr(qr);
              entry.type = PaymentType.Outcome;
              entry.totalAmount = qr.sum;
              value.onChangeEntry(entry);
            },
          });
        }}>
        {qr({})}
      </BasicRectangleView>
    );
  }

  shared_Title(value: EntryContextValue) {
    return (
      <Div row alignItems="center">
        {/* // TODO: doesn't display placeholder */}
        <TextInputRow
          mb={0}
          value={value.entry!.title}
          placeholder="Название"
          onChangeText={(text) => this.changeEntry(value, 'title', text)}
          autoGrow
        />

        {this.qrButton(value)}
      </Div>
    );
  }

  shared_Date(value: EntryContextValue) {
    if (!(!(value.entry instanceof Payment) || value.entry.sale == undefined))
      return;
    return (
      <CalendarPickerRow
        title="Дата"
        day={value.entry!.date}
        onDayChange={(day) => this.changeEntry(value, 'date', day)}
      />
    );
  }

  note_Project(value: EntryContextValue) {
    if (!(value.entry instanceof Note)) return;
    return (
      <ProjectsRow
        hasSelectAll={false}
        selected={
          value.entry.project?._model ? [value.entry.project!._model] : []
        }
        onPress={(projects: ProjectModel[]) => {
          if (projects.length != 1) return;
          this.changeEntry(
            value,
            'project',
            value.entry?.project?._model?.uuid == projects[0].uuid
              ? undefined
              : new Project({model: projects[0]}),
          );
        }}
      />
    );
  }

  note_Note(value: EntryContextValue) {
    if (!(value.entry instanceof Note)) return;
    return (
      <>
        <TextInputPanel
          // FIXME: whyyy?
          mb={-12}
          placeholder="Комментарий"
          value={value.entry.note}
          onChangeText={(text) => this.changeEntry(value, 'note', text)}
        />
      </>
    );
  }

  notNote_Project(value: EntryContextValue) {
    if (value.entry instanceof Note) return;
    return (
      <>
        {!(value.entry instanceof Note) && (
          <ProjectBadge project={value.entry?.project?._model} isOn />
        )}
      </>
    );
  }

  everything_DoneToggle(value: EntryContextValue) {
    if (this.state.repeatTill) return;
    return (
      <RectangleToggleRow
        text="Сделано"
        isOn={!!value.entry.done}
        onSwitch={(checked) => {
          this.changeEntry(value, 'done', checked);
        }}
      />
    );
  }

  payment_TypeSelector(value: EntryContextValue) {
    if (!(value.entry instanceof Payment && value.entry.purchase == undefined))
      return;
    return (
      <>
        <SquareSelector
          values={['Приход', 'Расход']}
          selectedIndex={value.entry.type}
          onChange={(index) => {
            if (index == value.entry?.type) return;
            this.changeEntry(value, 'type', index);
            this.changeEntry(value, 'tag', undefined);
          }}
        />
      </>
    );
  }

  noteAndPaymentAndPurchase_SingleContact(value: EntryContextValue) {
    if (
      !(
        value.entry &&
        ((value.entry instanceof Payment &&
          value.entry.purchase == undefined) ||
          value.entry instanceof Purchase ||
          value.entry instanceof Note)
      )
    )
      return;
    return (
      <>
        <BasicRectangleRow
          text="Контакт:"
          justifyContent="flex-start"
          onPress={() => {
            this.props.navigation.navigate('Contacts', {
              onPress: (contact: IContact) => {
                this.changeEntry(value, 'contact', contact),
                  this.props.navigation.popToTop();
              },
              isModal: true,
              onPressInfo: (contact: IContact) =>
                this.props.navigation.navigate('Contact', {
                  contact: contact,
                  onPress: (contact: IContact) => {
                    this.changeEntry(value, 'contact', contact),
                      this.props.navigation.popToTop();
                  },
                }),
            });
          }}>
          <Text
            fontSize={MarkelovTheme.fontSize.M}
            fontFamily={MarkelovTheme.fontFamily.Bold700}
            lineHeight={14}
            color="#444D56">
            {value.entry.contact
              ? Contact.displayedName(value.entry.contact)
              : 'Выбрать'}
          </Text>
        </BasicRectangleRow>
      </>
    );
  }

  purchaseAndSale_DelayedDate(value: EntryContextValue) {
    if (
      !(
        value.entry &&
        (value.entry instanceof Purchase || value.entry instanceof Sale)
      )
    )
      return;
    return (
      <>
        <RectangleSwitchCalendar
          text="Отложенный платёж"
          day={value.entry.payment?.date ?? value.entry.delayedDate}
          onSwitch={(checked) => {
            checked ? value.entry?.delay?.() : value.entry?.undelay?.();
            this.forceUpdate();
          }}
          onDayChange={(day) => {
            if (!value.entry || !day) return;

            if (value.entry instanceof Purchase) {
              const entry = value.entry;
              entry.payment.date = day;
              value.onChangeEntry(entry);
            } else if (value.entry instanceof Sale) {
              const entry = value.entry;
              entry.delayedDate = day;
              value.onChangeEntry(entry);
            }
          }}
        />
      </>
    );
  }

  task_budget(value: EntryContextValue) {
    if (!(value.entry instanceof Task && value.entry.purchase == undefined))
      return;
    return (
      <BudgetTagChooser
        month={value.entry.date.month}
        year={value.entry.date.year}
        type={this.budgetType(value.entry)}
        chosen={value.entry.tag}
        project={value.entry.project._model}
        onChoose={(tag?: BudgetTagModel) =>
          this.changeEntry(
            value,
            'tag',
            tag ? new BudgetTag({model: tag}) : undefined,
          )
        }
      />
    );
  }

  task_Amount(value: EntryContextValue) {
    if (!(value.entry instanceof Task)) return;
    return (
      <BasicRectangleRow text="Сумма:">
        <Div row>
          <NumberTextInput
            placeholder={(value.entry.totalAmount > 0
              ? value.entry.totalAmount
              : value.entry.sum
            )?.toString()}
            value={
              value.entry.totalAmount > 0 ? value.entry.totalAmount : undefined
            }
            onChange={(amount: number) => {
              this.changeEntry(value, 'totalAmount', amount);
            }}
            postfix="₽"
          />
        </Div>
      </BasicRectangleRow>
    );
  }

  onAddSaleItem(value: EntryContextValue, contact?: IContact) {
    this.props.navigation.navigate('Prices', {
      selectedProjects: [value.entry?.project?.model],
      onPress: (article: Article | Service) => {
        article.load().then(() => {
          const onProceed = () => {
            this.props.navigation.navigate('SaleItemForm', {
              item: article,
              onAdd: (article: Article | Service) => {
                const current = value;
                if (article instanceof Article) {
                  (current.entry as Sale).articles.push(article);
                } else {
                  (current.entry as Sale).services.push(article);
                }
                value.onChangeEntry(current.entry);
              },
              contacts: value.entry?.contacts,
              contact: contact,
            });
          };
          if (
            article instanceof Article &&
            article.incoming.reduce((acc, inc) => (acc += inc.left), 0) <= 0
          )
            Alert.alert(
              'Этот товар закончился',
              'Докупите товар прежде чем его продавать',
              [{text: 'Отмена'}, {text: 'Продолжить', onPress: onProceed}],
            );
          else onProceed();
        });
      },
      isSettingsVisible: false,
      hideSelect: true,
    });
  }

  sale_MultiContact(value: EntryContextValue) {
    if (!(value.entry instanceof Sale)) return;
    return (
      <>
        <RectangleList
          title="Контакты"
          data={value.entry.contacts}
          renderItem={(item: ListRenderItemInfo<IContact>) => (
            <SaleContactRow
              onDeleteContact={() => {
                (value.entry as Sale).removeContact(item.item);
                this.forceUpdate();
              }}
              contact={item.item}
              items={(value.entry as Sale).articles.concat(
                (value.entry as Sale).services,
              )}
              contacts={(value.entry as Sale).contacts}
              sale={value.entry as Sale}
              onAddToContact={() => {
                this.onAddSaleItem(value, item.item);
              }}
              onDeleteItem={(item) => {
                value.entry.remove(item);
                this.forceUpdate();
              }}
              onPressItem={(item) => {
                item.load().then(() =>
                  this.props.navigation.navigate('SaleItemForm', {
                    item: item,
                    onAdd: (article: Article | Service) => {
                      const current = value;
                      if (article instanceof Article) {
                        (current.entry as Sale).articles = (current.entry as Sale).articles.filter(
                          (art) => art.uuid != article.uuid,
                        );
                        (current.entry as Sale).articles.push(article);
                      } else {
                        (current.entry as Sale).services = (current.entry as Sale).services.filter(
                          (art) => art.uuid != article.uuid,
                        );
                        (current.entry as Sale).services.push(article);
                      }
                      value.onChangeEntry(current.entry);
                    },
                    contacts: value.entry?.contacts,
                  }),
                );
              }}
            />
          )}
          onAdd={() => {
            this.props.navigation.navigate('Contacts', {
              onPress: (contact: IContact) => {
                const sale = value.entry as Sale;
                sale.addContact(contact);
                value.onChangeEntry(sale);
                this.props.navigation.popToTop();
              },
              filter: (contact: IContact) =>
                value.entry?.contacts.every(
                  (client) => contact.recordID != client.recordID,
                ),
              isSettingsButtonVisible: false,
              isModal: true,
              onPressInfo: (contact: IContact) => {
                this.props.navigation.navigate('Contact', {
                  //   // model: this.props.contactModel,
                  contact: contact,
                  onPress: (contact: IContact) => {
                    const sale = value.entry as Sale;
                    sale.addContact(contact);
                    value.onChangeEntry(sale);
                    this.props.navigation.popToTop();
                  },
                });
              },
            });
          }}
        />
      </>
    );
  }

  purchaseAndSale_Articles(value: EntryContextValue) {
    if (
      !(
        value.entry instanceof Purchase ||
        (value.entry instanceof Sale && value.entry.contacts.length > 0)
      )
    )
      return;

    let onAdd: undefined | (() => void) = undefined;
    let onAddNew: undefined | (() => void) = undefined;
    let data: (Article | ArticleIn | Service)[] = [];
    let render: undefined | ((item: any) => JSX.Element) = undefined;

    if (value.entry instanceof Purchase) {
      data = value.entry.articles.reduce(
        (accum, current) => accum.concat(current.incoming),
        [],
      );
      render = (item: ListRenderItemInfo<ArticleIn>) => (
        <PurchaseButtonRow
          item={item.item}
          onDelete={() => {
            value.entry.remove(item.item.article);
            this.forceUpdate();
          }}
          onPress={() => {
            this.props.navigation.navigate('AddItemForm', {
              onAdd: (item: Article) => {
                const entry = value.entry as Purchase;
                entry.addArticle(item);
                value.onChangeEntry(entry);
              },
              item: item.item.article,
            });
          }}
        />
      );
      onAddNew = () => {
        this.props.navigation.navigate('AddItemForm', {
          onAdd: (item: Article) => {
            const entry = value.entry as Purchase;
            entry.addArticle(item);
            value.onChangeEntry(entry);
          },
        });
      };
      onAdd = () => {
        this.props.navigation.navigate('Prices', {
          onPress: (article: Article | Service) => {
            if (article instanceof Article)
              article.incoming.push(new ArticleIn(article, {}));
            this.props.navigation.navigate('AddItemForm', {
              onAdd: (item: Article) => {
                const entry = value.entry as Purchase;
                entry.addArticle(item);
                value.onChangeEntry(entry);
              },
              item: article,
            });
          },
          onAdd: onAddNew,
          isSettingsVisible: false,
          isServicesVisible: false,
          hideSelect: true,
        });
      };
    }

    if (value.entry instanceof Sale) {
      data = value.entry.articles.concat(value.entry.services);
      render = (item: ListRenderItemInfo<any>) => (
        <SaleButtonRow
          item={item.item}
          onDelete={() => {
            value.entry.remove(item.item);
            this.forceUpdate();
          }}
          onPress={() =>
            item.item.load().then(() =>
              this.props.navigation.navigate('SaleItemForm', {
                item: item.item,
                onAdd: (article: Article | Service) => {
                  const current = value;
                  if (article instanceof Article) {
                    (current.entry as Sale).articles = (current.entry as Sale).articles.filter(
                      (art) => art.uuid != article.uuid,
                    );
                    (current.entry as Sale).articles.push(article);
                  } else {
                    (current.entry as Sale).services = (current.entry as Sale).services.filter(
                      (art) => art.uuid != article.uuid,
                    );
                    (current.entry as Sale).services.push(article);
                  }
                  value.onChangeEntry(current.entry);
                },
                contacts: value.entry?.contacts,
              }),
            )
          }
        />
      );
      onAdd = () => {
        this.onAddSaleItem(value);
      };
    }

    return (
      <>
        <RectangleList
          title="Позиции"
          onAdd={onAdd!}
          data={data}
          renderItem={render ?? (() => <Text>None</Text>)}
        />
      </>
    );
  }

  notDelayed_repeat(value: EntryContextValue) {
    if (value.entry?._model) return;

    const roundSelector = (
      values: string[],
      index: number,
      onChange: (index: number) => void,
    ) => (
      <RoundSelector
        values={values}
        selectedIndex={index}
        onChange={onChange}
        mx={27.5 + 15}
        my={16}
        color={undefined}
      />
    );

    const regularly = ['После выполнения', 'Регулярно'];
    const regularity = ['День', 'Неделя', 'Месяц', 'Год'];
    const regularityIndex = 0;
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const weekDay = 0;

    return (
      <>
        <RectangleToggleRow
          text="Повтор"
          isOn={this.isRepeating}
          onSwitch={(checked) => {
            if (checked) {
              if (value.entry) value.entry.done = false;
              value.entry?.undelay?.();
            }
            this.isRepeating = checked;
          }}>
          {this.isRepeating && (
            <Div>
              {roundSelector(regularly, 0, undefined)}

              <Div row justifyContent="space-between" alignItems="center">
                <Text
                  fontSize={MarkelovTheme.fontSize.M}
                  lineHeight={14}
                  fontFamily={MarkelovTheme.fontFamily.Regular400}
                  color="#444D56">
                  Каждые:
                </Text>
                <Div row alignItems="center">
                  <TextInput
                    placeholder="1"
                    style={{
                      marginRight: 4,
                      fontSize: MarkelovTheme.fontSize.M,
                      lineHeight: 16,
                      fontFamily: MarkelovTheme.fontFamily.Regular400,
                      color: '#444D56',
                    }}
                  />
                  <Text
                    fontSize={MarkelovTheme.fontSize.M}
                    lineHeight={14}
                    fontFamily={MarkelovTheme.fontFamily.SemiBold600}
                    color="#444D56">
                    {regularity[regularityIndex]}
                  </Text>
                </Div>
              </Div>
              {roundSelector(regularity, regularityIndex, undefined)}
              <Text
                mb={16}
                fontSize={MarkelovTheme.fontSize.M}
                fontFamily={MarkelovTheme.fontFamily.Regular400}
                color="#444D56">
                Повтор по:
              </Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={weekDays}
                renderItem={(info) => (
                  <Div
                    style={{
                      shadowColor: '#000000',
                      shadowOpacity: 0.31,
                      shadowRadius: 2,
                      shadowOffset: {height: 0, width: 0},
                    }}>
                    <Button
                      mr={12}
                      bg={
                        info.item == weekDays[weekDay] ? '#F9F9FA' : '#F1F2F5'
                      }
                      py={11}
                      px={15}
                      rounded={36}>
                      <Text
                        fontFamily={MarkelovTheme.fontFamily.Regular400}
                        fontSize={MarkelovTheme.fontSize.M}
                        color="#444D56">
                        {info.item}
                      </Text>
                    </Button>
                  </Div>
                )}
              />
              <Text
                my={16}
                fontSize={MarkelovTheme.fontSize.M}
                fontFamily={MarkelovTheme.fontFamily.Regular400}
                color="#444D56">
                Повтор до:
              </Text>
              <CalendarPickerRow
                title="Дата окончания повтора"
                day={this.state.repeatTill!}
                onDayChange={(day) => {
                  this.setState({repeatTill: new Calendar(day)});
                }}
              />
            </Div>
          )}
        </RectangleToggleRow>
      </>
    );
  }

  payment_quickScan(value: EntryContextValue) {
    return (
      <Button
        onPress={() => {
          this.props.navigation.navigate('QR', {
            onQRFound: (qr) => {
              var entry = value.entry;
              if (!entry || !(entry instanceof Payment)) return;
              entry.done = true;
              entry.date = Calendar.qr(qr);
              entry.type = PaymentType.Outcome;
              entry.totalAmount = qr.sum;
              value.onChangeEntry(entry);
            },
          });
        }}>
        <Text>Быстрый скан</Text>
      </Button>
    );
  }

  note_List(value: EntryContextValue) {
    // TODO: yes.
    if (!(value.entry instanceof Note)) return;
    return (
      <RectangleList
        title="Список"
        data={value.entry.items}
        onAdd={() => {
          value.entry.addItem();
          this.forceUpdate();
        }}
        renderItem={(info: ListRenderItemInfo<NoteListItemModel>) => (
          <Div row alignItems="center">
            <Checkbox
              checked={info.item.isDone}
              onCheck={(checked: boolean) => {
                info.item.isDone = checked;
                this.forceUpdate();
              }}
            />
            <TextInput
              value={info.item.item}
              onChangeText={(text) => {
                info.item.item = text;
                this.forceUpdate();
              }}
              style={{
                marginLeft: 10,
                marginVertical: 14.5,
                fontFamily: MarkelovTheme.fontFamily.Regular400,
                fontSize: MarkelovTheme.fontSize.M,
                lineHeight: 19.6,
              }}
              onEndEditing={(_) => {
                value.entry.cleanItems();
                this.forceUpdate();
              }}
            />
          </Div>
        )}
      />
    );
  }

  render() {
    // TODO: строка напомнить это о чём?
    return (
      <EntryContext.Consumer>
        {(value: EntryContextValue) => {
          return (
            value.entry && (
              <BasicModalView
                title={value.entry.constructor.rusName}
                left="Отмена"
                onPressLeft={() => {
                  value.onChangeProject(undefined);
                  value.onChangeEntry(undefined);
                }}
                right="Сохранить"
                onPressRight={() => this.save(value)}>
                <BasicSeparator vertical={12}>
                  {this.shared_Title(value)}
                  {this.notNote_Project(value)}
                  {this.note_Project(value)}
                  {this.shared_Date(value)}
                  {this.note_Note(value)}
                  {this.noteAndPaymentAndPurchase_SingleContact(value)}
                  {this.purchaseAndSale_DelayedDate(value)}
                  {this.notDelayed_repeat(value)}
                  {this.sale_MultiContact(value)}
                  {this.purchaseAndSale_Articles(value)}
                  {this.task_Amount(value)}
                  {this.everything_DoneToggle(value)}
                  {this.payment_TypeSelector(value)}
                  {this.task_budget(value)}
                  {this.note_List(value)}
                  {/* {this.payment_quickScan(value)} */}
                </BasicSeparator>
                <Div h={100} />
              </BasicModalView>
            )
          );
        }}
      </EntryContext.Consumer>
    );
  }
}

// EntryModal.contextType = EntryContext;
