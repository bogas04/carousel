/* global describe, it, expect */
import { SWIPES, getNewIndex } from "./";

describe("getNewIndex()", () => {
  it("returns next index on left swipe", () => {
    const newIndex = getNewIndex({
      length: 4,
      currentIndex: 2,
      wrapAround: false,
      swipe: SWIPES.LEFT
    });

    expect(newIndex).toBe(3);
  });

  it("returns previous index on right swipe", () => {
    const newIndex = getNewIndex({
      length: 4,
      currentIndex: 2,
      wrapAround: false,
      swipe: SWIPES.RIGHT
    });

    expect(newIndex).toBe(1);
  });

  it("wraps around correctly on left swipe", () => {
    const newIndex = getNewIndex({
      length: 4,
      currentIndex: 3,
      wrapAround: true,
      swipe: SWIPES.LEFT
    });

    expect(newIndex).toBe(0);
  });

  it("wraps around correctly on right swipe", () => {
    const newIndex = getNewIndex({
      length: 4,
      currentIndex: 0,
      wrapAround: true,
      swipe: SWIPES.RIGHT
    });

    expect(newIndex).toBe(3);
  });

  it(`doesn't wrap around when wrapAround is false on right swipe`, () => {
    const newIndex = getNewIndex({
      length: 4,
      currentIndex: 0,
      wrapAround: false,
      swipe: SWIPES.RIGHT
    });

    expect(newIndex).toBe(0);
  });

  it(`doesn't wrap around when wrapAround is false on left swipe`, () => {
    const newIndex = getNewIndex({
      length: 4,
      currentIndex: 3,
      wrapAround: false,
      swipe: SWIPES.LEFT
    });

    expect(newIndex).toBe(3);
  });
});
