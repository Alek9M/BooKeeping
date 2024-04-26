import React, {Component} from 'react';
//
import {Button, Div, Modal, Text} from 'react-native-magnus';
import {MarkelovTheme} from '../../../../App';
import ProjectModel from '../../../../data/projectModel';
//
import BudgetTag from '../../../../model/budgetTag';
import {ICalendar} from '../../../../model/calendar';
import {PaymentType} from '../../../../model/payment';
import Project from '../../../../model/project';
// import BasicModal from '../../../fab/customComponents/basicModal';
import ModalHeader from '../../../fab/customComponents/modalHeader';
import TextInput from '../../../fab/customComponents/TextInput';
import BasicModal from '../../../markeloView/basicViews/basicModal';
import BasicSeparator from '../../../markeloView/basicViews/basicSeparator';
import BasicRectangleRow from '../../../markeloView/elements/basicRectangleRow';
import BasicRectangleView from '../../../markeloView/elements/basicRectangleView';
import NumberTextInput from '../../../markeloView/elements/numberTextInput';
import PostfixInput from '../../../markeloView/elements/postfixInput';
import TextInputRow from '../../../markeloView/elements/textInputRow';
import {bin} from '../../../markeloView/icons/svg';
import BudgetGraphs from '../../../markeloView/money/budgets/budgetGraphs';
import LoadingBudgetGraphs from '../../../markeloView/money/budgets/loadingBudgetGraphs';
import ProjectsRow from '../../../markeloView/projectsRow';
import CalendarPickerRow from '../../fab/calendarPickerRow';
import CalendarPicker, {
  CalendarPickerType,
} from '../../tab/tabWide/calendarPicker';
import ProjectChooser from '../../tab/tabWide/projectChooser';

interface IProps {
  budgetTag?: BudgetTag;
  onChange: (budget?: BudgetTag) => void;
  onDelete?: () => void;
  savedReturnValue?: any;
}

interface IState {}

export default class BudgetModal extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  returnValueOnClose() {
    return this.props.savedReturnValue !== undefined
      ? this.props.savedReturnValue
      : this.props.budgetTag;
  }

  deleteButton() {
    if (!this.props.budgetTag?._model) return <></>;
    if (!this.props.onDelete) return <></>;
    return (
      <>
        <BasicRectangleView
          onPress={() => {
            this.props.budgetTag?.delete().then(() => this.props.onDelete?.());
          }}>
          <Div row>
            {bin({})}
            <Text
              color={MarkelovTheme.colors.Red}
              fontFamily={MarkelovTheme.fontFamily.SemiBold600}
              lineHeight={15}
              pl={9}>
              Удалить бюджет
            </Text>
          </Div>
        </BasicRectangleView>
        {/* <Button
        onPress={() => {
          this.props.budgetTag
            ?.delete()
            .then(() => this.props.onChange(this.returnValueOnClose()));
        }}>
        <Text>Удалить бюджет</Text>
      </Button> */}
      </>
    );
  }

  render() {
    return (
      <>
        <BasicModal
          py={0}
          isVisible={Boolean(this.props.budgetTag)}
          title={
            this.props.budgetTag?.type == PaymentType.Income
              ? 'Доход'
              : 'Расход'
          }
          left="Назад"
          onPressLeft={() => this.props.onChange(undefined)}
          right="Сохранить"
          onPressRight={() => {
            this.props.budgetTag
              ?.save()
              .then(() => this.props.onChange(this.returnValueOnClose()));
          }}>
          {/* <Modal
            h="95%"
            isVisible={Boolean(this.props.budgetTag)}
            useNativeDriver
            propagateSwipe
            swipeDirection="down"
            onSwipeComplete={() =>
              this.props.onChange(this.returnValueOnClose())
            }> */}
          {/* <ModalHeader
              text="Бюджет"
              onCancel={() => this.props.onChange(undefined)}
              onSave={() => {
                this.props.budgetTag
                  ?.save()
                  .then(() => this.props.onChange(this.returnValueOnClose()));
              }}
            /> */}

          {/* <TextInput
            placeholder="Категория"
            textValue={this.props.budgetTag?.title}
            onChange={(text) => {
              const budget = this.props.budgetTag;
              if (!budget) return;
              budget.title = text;
              this.props.onChange(budget);
            }}
          /> */}
          <CalendarPicker
            type={CalendarPickerType.Month}
            day={this.props.budgetTag?.day}
            onDayChange={(day: ICalendar) => {
              const budget = this.props.budgetTag;
              if (!budget) return;
              budget.month = day.month;
              budget.year = day.year;
              this.props.onChange(budget);
            }}
          />
          <Div h={24} />
          <BasicSeparator vertical={12}>
            <TextInputRow
              mb={0}
              value={this.props.budgetTag?.title}
              placeholder="Название"
              onChangeText={(text) => {
                const budget = this.props.budgetTag;
                if (!budget) return;
                budget.title = text;
                this.props.onChange(budget);
              }}
            />
            <ProjectsRow
              hasSelectAll={false}
              selected={[this.props.budgetTag?.project?.model].filter(
                (project) => project != undefined,
              )}
              onPress={(project: ProjectModel[]) => {
                if (project.length != 1) return;
                const budget = this.props.budgetTag;
                budget!.project =
                  project[0].uuid == this.props.budgetTag?.project?.uuid
                    ? undefined
                    : new Project({model: project[0]});
                this.props.onChange(budget);
              }}
            />
            <BasicRectangleRow text="Сумма бюджета:">
              {/* <PostfixInput
                postfix="₽"
                placeholder="0"
                value={this.props.budgetTag?.amount.toString()}
                onChange={(text) => {
                  const budget = this.props.budgetTag;
                  if (!budget) return;
                  budget.amount = Number(text);
                  this.props.onChange(budget);
                }}
              /> */}
              <NumberTextInput
                postfix="₽"
                placeholder="0"
                value={this.props.budgetTag?.amount}
                onChange={(text) => {
                  const budget = this.props.budgetTag;
                  if (!budget) return;
                  budget.amount = text;
                  this.props.onChange(budget);
                }}
              />
            </BasicRectangleRow>
            {/* <TextInput
            type="money"
            placeholder="Бюджет"
            textValue={this.props.budgetTag?.amount.toString()}
            onChange={(text) => {
              const budget = this.props.budgetTag;
              if (!budget) return;
              budget.amount = Number(text);
              this.props.onChange(budget);
            }}
          /> */}
            {/* <ProjectChooser
            chosen={[this.props.budgetTag?.project?.model].filter(
              (project) => project != undefined,
            )}
            onPress={(project: ProjectModel) => {
              const budget = this.props.budgetTag;
              budget!.project =
                project.uuid == this.props.budgetTag?.project?.uuid
                  ? undefined
                  : new Project({model: project});
              this.props.onChange(budget);
            }}
          /> */}

            {this.deleteButton()}
            {/* <BudgetGraphs
              onPress={(number) => {
                const budget = this.props.budgetTag;
                if (!budget) return;
                budget.amount = number;
                this.props.onChange(budget);
              }}
              budgets={[
                {month: 'June', planned: 34000, spent: 30000},
                {month: 'July', planned: 10000, spent: 15000},
                {month: 'August', planned: 50000, spent: 1000},
                {month: 'August', planned: 50000, spent: 1000},
              ]}
            /> */}
            <LoadingBudgetGraphs
              budgetTitle={this.props.budgetTag?.title}
              monthsUpTo={this.props.budgetTag?.month}
              year={this.props.budgetTag?.year}
              type={this.props.budgetTag?.type}
              project={this.props.budgetTag?.project?.model}
              onPress={(number) => {
                const budget = this.props.budgetTag;
                if (!budget) return;
                budget.amount = number;
                this.props.onChange(budget);
              }}
            />
          </BasicSeparator>
          {/* </Modal> */}
        </BasicModal>
      </>
    );
  }
}
