import Dimension from "../geometry/Dimension";

/**
 * Modifies Image prototye to get the rectangle associated
 * @returns {Dimension}
 */
Image.prototype.getDimension = function() {
  if(!this.complete || this.naturalWidth === 0 || this.naturalHeight === 0) {
    throw new Error('Image wasn\'t loaded yet');
  }

  return new Dimension(this.naturalWidth, this.naturalHeight);
};

/**
 * Modifies HTMLElement prototype to get the rectangle associated
 * @returns {Dimension}
 */
HTMLElement.prototype.getDimension = function() {
  return new Dimension(this.offsetWidth, this.offsetHeight);
};

export {};