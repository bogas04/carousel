import React from "react";
import PropTypes from "prop-types";

export const SWIPES = {
    LEFT: 0,
    RIGHT: 1,
};

export const getNewIndex = ({
    updateIndexBy: offset,
    wrapAround,
    length,
    currentIndex,
    swipe,
}) => {
    switch (swipe) {
        case SWIPES.LEFT:
            return wrapAround
                ? (currentIndex + offset) % length
                : Math.min(currentIndex + offset, length - offset);
        case SWIPES.RIGHT:
            return wrapAround
                ? currentIndex - offset < 0
                    ? length - offset
                    : currentIndex - offset
                : Math.max(0, currentIndex - offset);
        default:
            return currentIndex;
    }
};

/**
 *
 *
 * @export
 * @class Carousel
 * @augments {React.PureComponent<CarouselProps>}
 */
export default class Carousel extends React.PureComponent {
    static wrapAroundTypes = {
        ALWAYS: 0,
        AUTO_PLAY: 1,
        NEVER: 2,
    };

    static defaultProps = {
        offset: 20,
        startWithIndex: 0,
        wrapAround: Carousel.wrapAroundTypes.ALWAYS,
        autoPlay: true,
        autoPlayDuration: 2500,
        updateIndexBy: 1,
    };

    /**
     *
     * @type {CarouselProps}
     * @static
     * @memberof Carousel
     */
    static propTypes = {
        /** Amount (pixels) of touchMove to wait before triggering a swipe */
        offset: PropTypes.number,
        /** Index to start with. */
        startWithIndex: PropTypes.number,
        /** Number by which currentIndex should update on swipes (default = 1) */
        updateIndexBy: PropTypes.number,
        /** 'always' or on 'autoplay' */
        wrapAround: PropTypes.oneOf(
            Object.keys(Carousel.wrapAroundTypes).map(
                k => Carousel.wrapAroundTypes[k]
            )
        ),
        /** AutoPlay the slides */
        autoPlay: PropTypes.bool,
        /** Total number of items */
        length: PropTypes.number.isRequired,
        /** AutoPlay duration (milliseconds) */
        autoPlayDuration: PropTypes.number,
        /** Render prop that accepts  {
            `setItemRef`, curry fn that accepts `index` and returns a fn that is required to bind to each item's `ref`.
            `currentIndex`, index of currently selected item.
            `scrollToIndex`, fn to scroll to the passed `index`.
            `getWrapperProps`, fn that returns props with follow props set.
                `setWrapperRef`, fn user needs to bind to `ref` of items' wrapper.
                `handleTouchStart`, fn user needs to bind to `onTouchStart` of item's wrapper.
                `handleTouchMove`, fn user needs to bind to `onTouchMove` of item's wrapper.
        } 
        */
        children: PropTypes.func.isRequired,
    };

    _touchStartPosition = null;

    _scrollInProgress = false;

    _autoPlay = this.props.autoPlay;

    _autoPlayTimer = null;

    state = {
        currentIndex: this.props.startWithIndex,
    };

    render() {
        const {
            state: { currentIndex },
            props: {
                /** @type {CarouselChildProps} */
                children,
            },
            scrollToIndex,
            setItemRef,
            setWrapperRef,
            getWrapperProps,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
        } = this;

        return children({
            setItemRef,
            setWrapperRef,
            currentIndex,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            getWrapperProps,
            scrollToIndex,
        });
    }

    static blockScrolling = (shouldBlock = true) =>
        (document.documentElement.style.overflow = shouldBlock
            ? "hidden"
            : "auto");

    /**
     * Cleanup function on end of transition
     * @private
     * @memberof Carousel
     */
    _onTransitionEnd = () => {
        // Let's unblock scrolling now that swipe animation has finished
        Carousel.blockScrolling(false);

        const { props: { autoPlayDuration }, _autoPlay } = this;

        this._scrollInProgress = false;

        if (_autoPlay) {
            if (this._autoPlayTimer !== null) {
                clearInterval(this._autoPlayTimer);
                this._autoPlayTimer = null;
            }

            this._autoPlayTimer = setTimeout(() => {
                this._handleSwipe(SWIPES.LEFT);
            }, autoPlayDuration);
        }
    };

    /**
     * Wrapper Ref setter
     *
     * @param {Element} node Wrapper node
     * @memberof Carousel
     */
    setWrapperRef = node => (this.$wrapper = node);

    /**
     * Item Ref setter (Curry function)
     * @param {number} index
     * @returns {(node: Element) => void} function that sets the ref
     * @memberof Carousel
     */
    setItemRef = index => node => (this[`$item${index}`] = node);

    /**
     * TouchStart event listener
     * @param {TouchEvent} e
     * @memberof Carousel
     */
    handleTouchStart = e => {
        const { touches: [{ pageX: x, pageY: y }] } = e;
        this._autoPlay = false;
        clearTimeout(this._autoPlayTimer);
        this._touchStartPosition = { x, y };
    };

    /**
     * TouchMove event listener
     * @param {TouchEvent} e
     * @memberof Carousel
     */
    handleTouchMove = e => {
        if (e.touches.length > 1 || (e.scale && e.scale !== 1)) {
            return;
        }

        if (!this._scrollInProgress) {
            const { _touchStartPosition, props: { offset } } = this;
            const [{ pageX: x }] = e.touches;
            const deltaX = x - _touchStartPosition.x;

            if (deltaX < -offset) {
                this._handleSwipe(SWIPES.LEFT);
            } else if (deltaX > offset) {
                this._handleSwipe(SWIPES.RIGHT);
            }
        }
    };

    /**
     * Swipe handler. Scrolls the wrapper based on swipe type
     *
     * @param {0 | 1} swipe refer to SWIPES
     * @memberof Carousel
     */
    _handleSwipe = swipe => {
        if (this._isBeingSwiped === true) {
            Carousel.blockScrolling(false);
            return;
        }

        this._isBeingSwiped = true;

        const {
            props: { updateIndexBy, wrapAround, length },
            _autoPlay,
        } = this;

        if (_autoPlay === false) {
            // Let's block scrolling until we are done with swipe
            Carousel.blockScrolling(true);
        }

        const shouldWrapAround = (() => {
            switch (wrapAround) {
                case Carousel.wrapAroundTypes.ALWAYS:
                    return true;
                case Carousel.wrapAroundTypes.NEVER:
                    return false;
                case Carousel.wrapAroundTypes.AUTO_PLAY:
                    return _autoPlay;
            }
        })();

        const newIndex = getNewIndex({
            swipe,
            wrapAround: shouldWrapAround,
            currentIndex: this.state.currentIndex,
            updateIndexBy,
            length,
        });

        this.scrollToIndex(newIndex);
    };

    /**
     *
     * @param {number} index to jump
     * @memberof Carousel
     */
    _jumpToIndex = index => {
        const $item = this[`$item${index}`];
        if ($item) {
            this._translateXTo(-$item.offsetLeft + this.$wrapper.offsetLeft);
        }
    };

    /**
     *
     * @param {pixels} pixels to translateX the wrapper with
     * @memberof Carousel
     */
    _translateXTo = pixels =>
        (this.$wrapper.style.transform = `translateX(${pixels}px)`);

    /**
     *
     * @param {number} index to scroll to
     * @memberof Carousel
     */
    scrollToIndex = index => {
        const $element = this[`$item${index}`];
        if (index === this.state.currentIndex || $element === undefined) {
            return;
        }

        this._scrollInProgress = true;

        this.setState({ currentIndex: index }, () =>
            this._translateXTo(-$element.offsetLeft)
        );
    };

    /**
     * Handle TouchEnd
     * @param {}
     * @memberof Carousel
     */
    handleTouchEnd = () => {
        // Let's unblock scrolling now that swipe animation has finished
        Carousel.blockScrolling(false);
        this._isBeingSwiped = false;
    };

    /**
     * Helper function to gather all props required for Wrapper element
     *
     * @memberof Carousel
     */
    getWrapperProps = () => ({
        ref: this.setWrapperRef,
        onTouchStart: this.handleTouchStart,
        onTouchEnd: this.handleTouchEnd,
        onTouchCancel: this.handleTouchEnd,
        onTouchMove: this.handleTouchMove,
    });

    componentDidMount() {
        this._jumpToIndex(this.state.currentIndex);
        this.$wrapper.addEventListener("transitionend", this._onTransitionEnd);
    }

    componentWillUnmount() {
        // Let's unblock scrolling when we unmount
        Carousel.blockScrolling(false);

        this.$wrapper.removeEventListener(
            "transitionend",
            this._onTransitionEnd
        );
    }
}
