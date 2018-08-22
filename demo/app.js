import React from "react";
import PropTypes from "prop-types";
import { render } from "react-dom";
import styles from "./style.css";
import Carousel from "../src";
import { css } from "emotion";

class Item extends React.PureComponent {
  static defaultProps = {
    className: ""
  };

  static propTypes = {
    src: PropTypes.string,
    innerRef: PropTypes.func,
    className: PropTypes.string
  };

  render() {
    const { src, innerRef, className, ...props } = this.props;
    return (
      <img
        src={src}
        ref={innerRef}
        className={`${styles.item} ${className}`}
        {...props}
      />
    );
  }
}

const items = [
  {
    imageUrl:
      "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_640,h_640/zoxvmc4ldxfuadhoa5jz",
    caption: "Order from a wide range of restaurants"
  },
  {
    imageUrl:
      "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_640,h_640/ld6fh1uuepm9zedqymde",
    caption: "with a wide collection of cuisins"
  },
  {
    imageUrl:
      "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_640,h_640/cq5jtfabl5zc0avgnxc9",
    caption: "delivered quickly to your doorstep"
  }
];

class Dot extends React.PureComponent {
  render() {
    const { active, ...props } = this.props;
    return (
      <div
        className={`${styles.dot} ${active ? styles.dotActive : ""}`}
        {...props}
      />
    );
  }
}

const Controls = ({ length, scrollToIndex, currentIndex }) => (
  <div className={styles.controls}>
    {Array(length)
      .fill("")
      .map((a, i) => (
        <Dot
          active={currentIndex === i}
          key={i}
          onClick={() => scrollToIndex(i)}
        />
      ))}
  </div>
);

const colors = [
  "#AAAAAA",
  "#2ECC40",
  "#0074D9",
  "#FF851B",
  "#BADA55",
  "#F012BE",
  "#B10DC9",
  "#FF4136",
  "#85144b",
  "#39CCCC",
  "#001f3f",
  "#7FDBFF",
  "#3D9970",
  "#DDDDDD",
  "#01FF70"
];

const App = () => (
  <div className={styles.container}>
    <h1>Showcase</h1>
    <Carousel length={colors.length} autoPlay={false}>
      {({ setItemRef, getWrapperProps, currentIndex, scrollToIndex }) => (
        <React.Fragment>
          <div
            className={css`
              width: 100%;
              justify-content: center;
              display: flex;
            `}
          >
            {Array(colors.length)
              .fill(0)
              .map((_, index) => (
                <div
                  onClick={() => scrollToIndex(index)}
                  className={css`
                    margin: 10px;
                    cursor: pointer;
                    border-radius: 20px;
                    width: 25px;
                    height: 5px;
                    background-color: ${`rgba(0, 0, 0, ${
                      currentIndex === index ? 1 : 0.4
                    })`};
                  `}
                />
              ))}
          </div>

          <div
            className={css`
              display: flex;
              align-items: center;
            `}
          >
            <div
              className={css`
                cursor: pointer;
              `}
              onClick={() => scrollToIndex(Math.max(currentIndex - 1, 0))}
            >
              ⬅️
            </div>
            <div
              className={css`
                width: 100%;
                overflow: hidden;
              `}
            >
              <div
                {...getWrapperProps()}
                className={css`
                  transition: transform ease-in-out 0.5s;
                  display: flex;
                `}
              >
                {Array(colors.length + 1) /* + 1 for a rogue item */
                  .fill(0)
                  .map(
                    (_, index) =>
                      index === 0 ? (
                        <div
                          key={index}
                          className={css`
                          height: 500px;
                          margin: 40px;
                          width: 300px;
                          min-width: 300px;
                          max-width: 300px;
                          background-color: transparent
                          transition: transform ease-in-out 0.25s;
                          transform-origin: left;
                          transform: ${
                            currentIndex + 1 === index
                              ? `scale(1.1)`
                              : `scale(1)`
                          };
                        `}
                          ref={setItemRef(index)}
                        />
                      ) : (
                        <div
                          key={index}
                          className={css`
                            height: 500px;
                            width: 300px;
                            min-width: 300px;
                            max-width: 300px;
                            text-align: center;
                            transition: transform ease-in-out 0.25s;
                            font-size: 25px;
                            background-color: ${colors[index]};
                            opacity: ${currentIndex + 1 === index
                              ? "1"
                              : "0.5"};
                            margin: ${currentIndex + 1 === index
                              ? "48px"
                              : "40px"};
                            transform: ${currentIndex + 1 === index
                              ? `scale(1.2)`
                              : `scale(1)`};
                          `}
                          ref={setItemRef(index)}
                        >
                          Lorem ipsum
                          <h2>{index}</h2>
                        </div>
                      )
                  )}
              </div>
            </div>
            <div
              className={css`
                cursor: pointer;
              `}
              onClick={() =>
                scrollToIndex(Math.min(currentIndex + 1, colors.length - 1))
              }
            >
              ➡️
            </div>
          </div>
        </React.Fragment>
      )}
    </Carousel>

    <h1>Image Carousel</h1>
    <Carousel wrapAround={true} length={items.length}>
      {({ getWrapperProps, setItemRef, currentIndex, scrollToIndex }) => (
        <React.Fragment>
          <div className={styles.carouselContainer}>
            <div {...getWrapperProps()} className={styles.wrapper}>
              {items.map(({ imageUrl, caption }, key) => (
                <Item
                  key={key}
                  alt={caption}
                  src={imageUrl}
                  caption={caption}
                  innerRef={setItemRef(key)}
                />
              ))}
            </div>
          </div>
          <Controls
            length={items.length}
            scrollToIndex={scrollToIndex}
            currentIndex={currentIndex}
          />
          <h3 key={items[currentIndex].caption} className={styles.caption}>
            {items[currentIndex].caption}
          </h3>
        </React.Fragment>
      )}
    </Carousel>
  </div>
);

render(<App />, document.getElementById("root"));
