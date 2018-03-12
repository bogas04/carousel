import React from 'react';
import { render } from 'react-dom';
import Carousel from '../src';

const containerStyle = {
  padding: '20px',
};

const carouselContainerStyle = {
  overflow: 'hidden',
}

const wrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  transition: 'transform .5s',
};

const itemStyle = {
  width: '100%',
};

class Item extends React.PureComponent {
  render() {
    const { src, innerRef, ...props } = this.props;
    return <img ref={innerRef} style={itemStyle} src={src} {...props} />;
  }
}

const items = [
  'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_640,h_640/zoxvmc4ldxfuadhoa5jz',
  'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_640,h_640/ld6fh1uuepm9zedqymde',
  'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_640,h_640/cq5jtfabl5zc0avgnxc9',
  'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_640,h_640/g5ubji00ko47i5you4tk',
];

const defaultDotStyle = {
  height: '8px',
  width: '8px',
  display: 'inline-block',
  margin: '6px',
  backgroundColor: 'rgba(255,255,255, 0.5)',
  borderRadius: '50%',
  boxShadow: '0 0 2px 0px black',
};

class Dot extends React.PureComponent {
  render () {
    const { active, ...props } = this.props;
    return <div
      style={
      this.props.active 
        ? {
          ...defaultDotStyle,
          backgroundColor: '#fc801a',
        }
        : defaultDotStyle
        }
        {...props}
    />;
  }
}

const controlsStyle = {
  textAlign: 'center',
  position: 'relative',
  top: '-30px',
  zIndex: 1,
};

const Controls = ({ length, scrollToIndex, currentIndex }) => (
  <div style={controlsStyle}>
    {Array(length)
      .fill('')
      .map((a, i) => (
        <Dot active={currentIndex === i} key={i} onClick={() => scrollToIndex(i)}/>
      ))}
  </div>
);

const App = () => (
  <div style={containerStyle}>
    <Carousel
      style={wrapperStyle}
      wrapAround={false}
      length={items.length}
      startWithIndex={2}>
      {({
        setWrapperRef,
        setItemRef,
        handleTouchStart,
        handleTouchMove,
        currentIndex,
        scrollToIndex,
      }) => (
        <React.Fragment>
          <div style={carouselContainerStyle}>
            <div
              ref={setWrapperRef}
              style={wrapperStyle}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}>
              {items.map((src, key) => (
                <Item key={key} src={src} innerRef={setItemRef(key)} />
              ))}
            </div>
          </div>
          <Controls length={items.length} scrollToIndex={scrollToIndex} currentIndex={currentIndex} />
        </React.Fragment>
      )}
    </Carousel>
  </div>
);

render(<App />, document.getElementById('root'));

