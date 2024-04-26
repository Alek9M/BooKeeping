import React, {Component} from 'react';
import {NativeSyntheticEvent, TextInputFocusEventData} from 'react-native';
//
import {Button, Div, Icon, Input, Modal, Text} from 'react-native-magnus';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HeaderContext, HeaderContextValue} from '../../../App';
import SettingsModal from './settingsModal';

interface IProps {
  onSearchChange: (text: string) => void;
  isSettingsButtonVisible: boolean;
}

interface IState {
  search: string;
  isSettingsButtonVisible: boolean;
}

export default class SearchSettingsRow extends Component<IProps, IState> {
  public static defaultProps = {
    isSettingsButtonVisible: false,
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      search: '',
      isSettingsButtonVisible: true,
    };
  }

  render() {
    return (
      <HeaderContext.Consumer>
        {(value: HeaderContextValue) => (
          <>
            <Div row alignItems="center">
              <Input
                placeholder="Поиск"
                p={10}
                m="lg"
                mr={value.isSettingVisible ? 'none' : 'lg'}
                flex={8}
                value={this.state.search}
                onFocus={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                  const isIt = e.currentTarget.isFocused();
                  this.setState({isSettingsButtonVisible: !isIt});
                }}
                onSubmitEditing={(_e) =>
                  this.setState({isSettingsButtonVisible: true})
                }
                onChangeText={(text) => {
                  this.props.onSearchChange(text);
                  this.setState({search: text});
                }}
                suffix={
                  <Icon name="search" color="gray900" fontFamily="Feather" />
                }
              />
              {this.props.isSettingsButtonVisible &&
                this.state.isSettingsButtonVisible &&
                this.state.search.length == 0 && (
                  <Button
                    alignSelf="center"
                    bg="transparent"
                    flex={0.5}
                    onPress={(_) => value.showSettings(true)}>
                    <Icon name="gear" fontFamily="Octicons" fontSize="2xl" />
                  </Button>
                )}
            </Div>
            {/* <SettingsModal
              isVisible={value.isSettingVisible}
              onSwipeComplete={() => value.showSettings(false)}
            /> */}
          </>
        )}
      </HeaderContext.Consumer>
    );
  }
}
