import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import { getWindowDimensions } from "../utils/dom";

export const AppContext = createContext({});

class AppProvider extends Component {
  state = {
    cursorCenterDeltaX: 0, // 0 at center, -0.5/0.5 at edges
    cursorCenterDeltaY: 0, // 0 at center, -0.5/0.5 at edges
    cursorPositionX: 0,
    cursorPositionY: 0,
    documentHeight: 0,
    scrollTop: 0,
    windowWidth: 0,
    windowHeight: 0
  };

  //
  // React lifecycle

  componentDidMount() {
    this.updateWindowDimensions();

    document.removeEventListener(`mousemove`, this.updateCursorPosition, false);
    document.removeEventListener(`resize`, this.updateWindowDimensions, false);
    document.removeEventListener(`scroll`, this.updateScrollTop, false);

    document.addEventListener(`mousemove`, this.updateCursorPosition, false);
    document.addEventListener(`resize`, this.updateWindowDimensions, false);
    document.addEventListener(`scroll`, this.updateScrollTop, false);

    //
    // touch

    window.addEventListener(`touchstart`, this.touchStart);
    window.addEventListener(`touchmove`, this.preventTouch, { passive: false });
  }

  componentWillUnmount() {
    document.removeEventListener(`mousemove`, this.updateCursorPosition, false);
    document.removeEventListener(`resize`, this.updateWindowDimensions, false);
    document.removeEventListener(`scroll`, this.updateScrollTop, false);

    //
    // touch

    window.removeEventListener(`touchstart`, this.touchStart);
    window.removeEventListener(`touchmove`, this.preventTouch, {
      passive: false
    });
  }

  //
  // listeners

  updateCursorPosition = event => {
    this.setState(prevState => ({
      cursorCenterDeltaX: -(0.5 - event.pageX / prevState.windowWidth),
      cursorPositionX: event.pageX,
      cursorCenterDeltaY: -(
        0.5 -
        (event.pageY - window.pageYOffset) / prevState.windowHeight
      ),
      cursorPositionY: event.pageY - window.pageYOffset
    }));
  };

  updateWindowDimensions = () => {
    this.setState({
      documentHeight: document.documentElement.offsetHeight,
      windowWidth: getWindowDimensions().width,
      windowHeight: getWindowDimensions().height
    });
  };

  updateScrollTop = e => {
    if (!e.target.scrollingElement || e.target.scrollingElement.scrollTop) {
      return;
    }

    this.setState({
      scrollTop: e.target.scrollingElement.scrollTop
    });
  };

  touchStart(e) {
    this.firstClientX = e.touches[0].clientX;
    this.firstClientY = e.touches[0].clientY;
  }

  // eslint-disable-next-line consistent-return
  preventTouch(e) {
    const minValue = 5;

    this.clientX = e.touches[0].clientX - this.firstClientX;
    this.clientY = e.touches[0].clientY - this.firstClientY;

    if (Math.abs(this.clientX) > minValue) {
      e.preventDefault();
      e.returnValue = false;

      return false;
    }
  }

  //

  render() {
    return (
      <AppContext.Provider
        value={{
          cursorCenterDeltaX: this.state.cursorCenterDeltaX,
          cursorCenterDeltaY: this.state.cursorCenterDeltaY,
          cursorPositionX: this.state.cursorPositionX,
          cursorPositionY: this.state.cursorPositionY,
          documentHeight: this.state.documentHeight,
          scrollTop: this.state.scrollTop,
          windowWidth: this.state.windowWidth,
          windowHeight: this.state.windowHeight
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

AppProvider.propTypes = {
  children: PropTypes.shape({}).isRequired
};

export default AppProvider;
