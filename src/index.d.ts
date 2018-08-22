type CarouselWrapAroundTypes = 0 | 1 | 2;

type CarouselChildPropArguments = {
    setItemRef: (index: number) => (node: Element) => void;
    setWrapperRef: (index: number) => void;
    handleTouchStart: (e: TouchEvent) => void;
    handleTouchMove: (e: TouchEvent) => void;
    currentIndex: number;
    scrollToIndex: (index: number) => void;
};

type CarouselChildProp = (
    props: CarouselChildPropArguments
) => React.ReactElement;

type CarouselProps = {
    offset?: number;
    startWithIndex?: number;
    updateIndexBy?: number;
    wrapAround?: CarouselWrapAroundTypes;
    autoPlay?: boolean;
    length: number;
    autoPlayDuration?: number;
    children: CarouselChildProp;
};
