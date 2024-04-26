import React, {Component} from 'react';
//
import {ShareMenuReactView} from 'react-native-share-menu';
//
import {Button, Div, Text} from 'react-native-magnus';

type SharedItem = {
  mimeType: string;
  data: string;
  extraData: any;
};

interface IProps {}

interface IState {
  mimeType?: string;
  data?: string;
  isAcceptable: boolean;
}

export default class ShareView extends Component<IProps, IState> {
  acceptableMIMEtypes = ['text/plain', 'application/pdf'];
  acceptableExtension = '.pdf';
  acceptablePath = `file:///`;

  get isLocalFile(): boolean {
    return this.state.data?.startsWith(this.acceptablePath) ?? false;
  }

  get isPDF(): boolean {
    return (
      this.state.data?.toLowerCase().endsWith(this.acceptableExtension) ?? false
    );
  }

  get isAcceptable(): boolean {
    if (!this.state.mimeType || !this.state.data) return false;
    return (
      this.acceptableMIMEtypes.includes(this.state.mimeType.toLowerCase()) &&
      this.isPDF &&
      this.isLocalFile
    );
  }

  get dataFileExtension(): string | undefined {
    if (!this.state.data) return undefined;
    const split = this.state.data.split('.');
    if (split.length < 2) return undefined;
    const last = split[split.length - 1];
    if (last.length > 5) return undefined;
    return last.toUpperCase();
  }

  get dataFileName(): string | undefined {
    if (!this.isLocalFile) return undefined;
    const split = this.state.data!.split('/');
    const fullFileName = split[split.length - 1];
    return fullFileName.split('.')[0];
  }

  constructor(props: IProps) {
    super(props);

    this.state = {
      isAcceptable: false,
    };
  }

  componentDidMount() {
    ShareMenuReactView.data().then(({mimeType, data}: SharedItem) => {
      this.setState({mimeType: mimeType, data: data});
    });
  }

  button(text: string, onPress: () => void) {
    return (
      <Button bg="blue500" onPress={onPress} flex={1} m="md">
        <Text color="white" fontSize="2xl" fontWeight="700">
          {text}
        </Text>
      </Button>
    );
  }

  render() {
    return (
      <Div p="lg" justifyContent="space-between" flex={1}>
        <Div></Div>
        {/* {this.isAcceptable && <Text>{JSON.stringify(this.state)}</Text>} */}
        {this.isAcceptable && (
          <Text textAlign="center" fontWeight="600" fontSize="5xl">
            {this.dataFileName}
          </Text>
        )}
        {!this.isAcceptable && (
          <Div>
            <Text textAlign="center" fontWeight="600" fontSize="5xl" m="md">
              Wrong format
            </Text>
            <Text textAlign="center">
              {this.dataFileExtension} files are not supported
            </Text>
            <Text textAlign="center">Please use local PDF document</Text>
          </Div>
        )}
        <Div row mb="2xl">
          {this.button('Cancel', () => ShareMenuReactView.dismissExtension())}
          {this.isAcceptable &&
            this.button('Continue', () => ShareMenuReactView.continueInApp())}
        </Div>
      </Div>
    );
  }
}
