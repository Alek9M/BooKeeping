import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Platform,
} from 'react-native';

import FingerprintScanner from 'react-native-fingerprint-scanner';
// import styles from './FingerprintPopup.component.styles';
// import ShakingText from './ShakingText.component';

// - this example component supports both the
//   legacy device-specific (Android < v23) and
//   current (Android >= 23) biometric APIs
// - your lib and implementation may not need both
class BiometricPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessageLegacy: undefined,
      biometricLegacy: undefined,
    };

    this.description = null;
  }

  componentDidMount() {
    this.authCurrent();
  }

  componentWillUnmount = () => {
    FingerprintScanner.release();
  };

  authCurrent() {
    FingerprintScanner.authenticate({title: 'Log in with Biometrics'}).then(
      () => {
        this.props.onAuthenticate();
      },
    );
  }

  render = () => {
    // current API UI provided by native BiometricPrompt
    return null;
  };
}

BiometricPopup.propTypes = {
  onAuthenticate: PropTypes.func.isRequired,
  handlePopupDismissedLegacy: PropTypes.func,
  style: ViewPropTypes.style,
};

export default BiometricPopup;
