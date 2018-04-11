/* eslint-disable jsx-a11y/no-autofocus */

import React from 'react';
import { func, string, shape } from 'prop-types';
import { remote } from 'electron';

import Icon from '../../Icon';
import styles from './AddressBar.scss';

const RETURN_KEY = 13;

window.bw = remote.BrowserWindow;

class AddressBar extends React.Component {
  state = {
    isMaximized: false
  };

  componentDidMount() {
    this.updateIsMax();
    window.addEventListener('resize', this.updateIsMax);
  }

  componentDidUpdate(prevProps, _prevState) {
    if (this.props.target !== prevProps.target) {
      this.props.history.push('/dapp');
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateIsMax);
  }

  render() {
    const showWindowIcons = process.platform !== 'darwin';
    return (
      <div className={styles.addressBar}>
        <input
          type="text"
          placeholder="Search or enter address"
          onKeyUp={this.handleKeyUp}
          ref={this.searchInput}
          autoFocus
        />
        <div className={styles.buttonBar}>
          <button>
            <Icon name="notifications" />
          </button>
          <button>
            <Icon name="settings" />
          </button>
          {showWindowIcons && [
            <button onClick={this.handleMinimizeWindow} key="min">
              <Icon name="windowMin" />
            </button>,
            <button onClick={this.handleResizeWindow} key="max">
              <Icon name={this.state.isMaximized ? 'windowRestore' : 'windowMax'} />
            </button>,
            <button onClick={this.handleCloseWindow} key="close">
              <Icon name="windowClose" />
            </button>
          ]}
        </div>
      </div>
    );
  }

  handleKeyUp = (event) => {
    const { doQuery } = this.props;
    if (event.which === RETURN_KEY && doQuery) {
      doQuery(this.searchInput.current.value);
    }
  };

  handleMinimizeWindow = () => {
    remote.BrowserWindow.getFocusedWindow().minimize();
  };

  handleResizeWindow = () => {
    const win = remote.BrowserWindow.getFocusedWindow();
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  };

  handleCloseWindow = () => {
    remote.BrowserWindow.getFocusedWindow().close();
  };

  updateIsMax = () => {
    const win = remote.BrowserWindow.getFocusedWindow();
    if (win) {
      this.setState({ isMaximized: win.isMaximized() });
    }
  };

  searchInput = React.createRef();
}

AddressBar.defaultProps = {
  target: 'https://google.com'
};

AddressBar.propTypes = {
  doQuery: func.isRequired,
  target: string,
  history: shape({
    push: func
  }).isRequired
};

export default AddressBar;
