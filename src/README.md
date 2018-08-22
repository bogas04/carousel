Simple swipe-able carousel

```js
const items = 3;
<Carousel
    updateIndexBy={1}
    wrapAround={Carousel.wrapAroundTypes.NEVER}
    length={items}
    autoPlay={false}
>
    {({ setItemRef, getWrapperProps, currentIndex, scrollToIndex }) => (
        <div style={{ overflow: "hidden" }}>
            <button
                style={{ border: "2px solid red" }}
                onClick={() => scrollToIndex(Math.max(0, currentIndex - 1))}
            >
                Previous
            </button>
            <button
                style={{ border: "2px solid green" }}
                onClick={() => scrollToIndex(Math.min(items, currentIndex + 1))}
            >
                Next
            </button>
            <div
                style={{ transition: "transform ease-in-out .5s" }}
                {...getWrapperProps()}
            >
                <div style={{ display: "flex" }}>
                    {["green", "magenta", "crimson"].map(
                        (background, index) => (
                            <div
                                key={index}
                                ref={setItemRef(index)}
                                style={{
                                    background,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    minWidth: "100%",
                                    maxWidth: "100%",
                                    height: "100px",
                                }}
                                children={index + 1}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    )}
</Carousel>;
```
