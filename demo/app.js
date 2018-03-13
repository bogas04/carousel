import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import styles from './style.css';
import Carousel from '../src';

class Item extends React.PureComponent {
  static defaultProps = {
    className: '',
  };

  static propTypes = {
    src: PropTypes.string,
    innerRef: PropTypes.func,
    className: PropTypes.string,
  };

  render() {
    const { src, innerRef, className, ...props } = this.props;
    return <img src={src} ref={innerRef} className={`${styles.item} ${className}`} {...props} />;
  }
}

const items = [
  {
    imageUrl: 'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_640,h_640/zoxvmc4ldxfuadhoa5jz',
    caption: 'Order from a wide range of restaurants',
  },
  {
    imageUrl: 'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_640,h_640/ld6fh1uuepm9zedqymde',
    caption: 'with a wide collection of cuisins',
  },
  {
    imageUrl: 'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_640,h_640/cq5jtfabl5zc0avgnxc9',
    caption: 'delivered quickly to your doorstep'
  },
];

class Dot extends React.PureComponent {
  render () {
    const { active, ...props } = this.props;
    return <div className={`${styles.dot} ${active ? styles.dotActive : ''}`} {...props} />;
  }
}

const Controls = ({ length, scrollToIndex, currentIndex }) => (
  <div className={styles.controls}>
    {Array(length)
      .fill('')
      .map((a, i) => (
        <Dot active={currentIndex === i} key={i} onClick={() => scrollToIndex(i)}/>
      ))}
  </div>
);

const App = () => (
  <div className={styles.container}>
    <Carousel
      wrapAround={true}
      length={items.length}
    >
      {({
        setWrapperRef,
        setItemRef,
        handleTouchStart,
        handleTouchMove,
        currentIndex,
        scrollToIndex,
      }) => (
        <React.Fragment>
          <div className={styles.carouselContainer}>
            <div
              ref={setWrapperRef}
              className={styles.wrapper}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}>
              {items.map(({ imageUrl, caption }, key) => (
                <Item key={key} alt={caption} src={imageUrl} caption={caption} innerRef={setItemRef(key)} />
              ))}
            </div>
          </div>
          <Controls length={items.length} scrollToIndex={scrollToIndex} currentIndex={currentIndex} />
          <h3 key={items[currentIndex].caption} className={styles.caption}>{items[currentIndex].caption}</h3>
        </React.Fragment>
      )}
    </Carousel>
  </div>
);

render(<App />, document.getElementById('root'));
