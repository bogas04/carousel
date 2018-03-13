import React from 'react';
import PropTypes from 'prop-types';

export const SWIPES = {
  LEFT: 0,
  RIGHT: 1,
};

export const getNewIndex = ({ wrapAround, length, currentIndex, swipe }) => {
  switch (swipe) {
    case SWIPES.LEFT: return wrapAround
        ? (currentIndex + 1) % length
        : Math.min(currentIndex + 1, length - 1);
    case SWIPES.RIGHT: 
      return wrapAround
        ? currentIndex - 1 < 0 ? length - 1 : currentIndex - 1
        : Math.max(0, currentIndex - 1);
    default:
      return currentIndex;
  }
};

export default class Carousel extends React.PureComponent {
  static defaultProps = {
    offset: 50,
    startWithIndex: 0,
    wrapAround: true,
    autoPlay: true,
    autoPlayDuration: 2500,
    renderControls: null,
  };

  static propTypes = {
    // Amount (pixels) of touchMove to wait before triggering a swipe
    offset: PropTypes.number,
    // Index to start with.
    startWithIndex: PropTypes.number,
    // Boolean to toggle wrapping around.
    wrapAround: PropTypes.bool,
    // AutoPlay the slides
    autoPlay: PropTypes.bool,
    // AutoPlay duration (milliseconds)
    autoPlayDuration: PropTypes.number,
    /* Render prop that accepts  {
      `setItemRef`, curry fn that accepts `index` and returns a fn that is required to bind to each item's `ref`.
      `setWrapperRef`, fn user needs to bind to `ref` of items' wrapper.
      `handleTouchStart`, fn user needs to bind to `onTouchStart` of item's wrapper.
      `handleTouchMove`, fn user needs to bind to `onTouchMove` of item's wrapper.
      `currentIndex`, index of currently selected item.
      `scrollToIndex`, fn to scroll to the passed `index`.
    } */
    children: PropTypes.func.isRequired,
  };

  touchStartPosition = null;

  scrollInProgress = false;

  autoPlayTimer = null;

  state = {
    currentIndex: this.props.startWithIndex,
  };

  componentDidMount() {
    this.jumpToIndex(this.state.currentIndex);
    this.$wrapper.addEventListener('transitionend', this._onTransitionEnd);
  }

  componentWillUnmount() {
    this.$wrapper.removeEventListener('transitionend', this._onTransitionEnd);
  }

  render() {
    const {
      state: { currentIndex },
      props: { children },
      scrollToIndex,
      setItemRef,
      setWrapperRef,
      handleTouchStart,
      handleTouchMove,
    } = this;

    return children({
      setItemRef,
      setWrapperRef,
      currentIndex,
      handleTouchStart,
      handleTouchMove,
      scrollToIndex,
    });
  }

  _onTransitionEnd = () => {
    const { autoPlay, autoPlayDuration } = this.props;

    this.scrollInProgress = false;

    if (autoPlay) {
      if (this.autoPlayTimer !== null) {
        clearInterval(this.autoPlayTimer)
        this.autoPlayTimer = null;
      }

      this.autoPlayTimer = setTimeout(() => {
        this.handleSwipe(SWIPES.LEFT);
      }, autoPlayDuration);
    }
  }

  setWrapperRef = node => (this.$wrapper = node);

  setItemRef = index => node => (this[`$item${index}`] = node);

  handleTouchStart = ({ touches: [{ screenX: x, screenY: y }] }) => this.touchStartPosition = { x, y };

  handleTouchMove = e => {
    if (!this.scrollInProgress) {
      const { touchStartPosition, props: { offset } } = this;
      const [{ screenX: x, screenY: y }] = e.changedTouches;

      if (x - touchStartPosition.x < -offset) {
        this.handleSwipe(SWIPES.LEFT);
      }

      if (x - touchStartPosition.x > offset) {
        this.handleSwipe(SWIPES.RIGHT);
      }
    }
  };

  handleSwipe = swipe => {
    const { wrapAround, length } = this.props;
    const newIndex = getNewIndex({
      swipe,
      wrapAround,
      currentIndex: this.state.currentIndex,
      length,
    });
    this.scrollToIndex(newIndex);
  };

  jumpToIndex = index => {
    const $item = this[`$item${index}`];
    if ($item) {
      this.translateYTo(-$item.offsetLeft + this.$wrapper.offsetLeft);
    }
  };

  translateYTo = pixels => this.$wrapper.style.transform = `translateX(${pixels}px)`;

  scrollToIndex = index => {
    if (index === this.state.currentIndex) {
      return;
    }

    this.scrollInProgress = true;

    this.setState(
      { currentIndex: index },
      () => this.translateYTo(-this[`$item${index}`].offsetLeft)
    );
  };
}
