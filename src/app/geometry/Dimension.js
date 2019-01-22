import is from 'is_js';
import Rectangle from './Rectangle';

/**
 * Basic Rectangle class
 */
class Dimension {

  constructor(width, height) {

    if(!is.number(width)) { throw new Error('{width} must be a number'); }
    if(!is.number(height)) { throw new Error('{height} must be a number'); }

    this.width = width;
    this.height = height;
  }

  /**
   * Retrieves rectangle aspect ratio
   * @returns {number}
   */
  getAspectRatio() {
    return this.width / this.height;
  }

  /**
   * Given another Dimension, calculates new dimensions of the current rect maintaining aspect ratio
   * @param otherRect
   * @returns {Dimension}
   */
  resize(otherRect) {

    //Other rect isn't an instance of rect?
    if (!otherRect instanceof Dimension) {
      throw new Error('{otherRect} parameter should be instance of {Rect}');
    }

    if(this.getAspectRatio() > otherRect.getAspectRatio()) {
      return new Dimension(otherRect.height * this.getAspectRatio(), otherRect.height);
    }
    else {
      return new Dimension(otherRect.width, otherRect.width / this.getAspectRatio());
    }
  }

  /**
   * Split that dimension by num of columns and num of rows
   * @param numCols
   * @param numRows
   * @returns {Array}
   */
  splitByColsAndRows(numCols, numRows) {

    if(!is.integer(numCols) || numCols <= 0) { throw new Error('given num of columns is not a valid value'); }
    if(!is.integer(numRows) || numRows <= 0) { throw new Error('given num of rows is not a valid values'); }

    let itemDimension = new Dimension(Math.floor(this.width / numCols), Math.floor(this.height / numRows));

    let remainingWidth = Math.floor(this.width - (itemDimension.width * numCols));
    let remainingHeight = Math.floor(this.height - (itemDimension.height * numRows));

    let result = [];

    for(let j = 0; j < numRows; j++) {

      let rowArray = [];
      result.push(rowArray);

      for(let i = 0; i < numCols; i++) {
        let x = i * itemDimension.width;
        let y = j * itemDimension.height;
        let width = itemDimension.width;
        let height = itemDimension.height;

        //If we are on last column must add remaining width
        if(i === numCols - 1) {
          width += remainingWidth;
        }

        //If we are on last row must add remaining height
        if(j === numRows - 1) {
          height += remainingHeight;
        }

        rowArray.push(new Rectangle(x, y, width, height));
      }
    }

    return result;
  }

  /**
   * Splits given dimension in rectangles with given rectangle width and height
   * @param width
   * @param height
   * @returns {Array}
   */
  splitByWidthAndHeight(width, height) {

    if(!is.integer(width) || width <= 0) { throw new Error('given width is not a valid value'); }
    if(!is.integer(height) || height <= 0) { throw new Error('given height is not a valid value'); }

    let itemDimension = new Dimension(width, height);

    let numCols = parseInt(this.width / width) + (this.width % width === 0 ? 0 : 1);
    let numRows = parseInt(this.height / height) + (this.height % height === 0 ? 0 : 1);

    let remainingWidth = Math.floor(this.width - (itemDimension.width * numCols));
    let remainingHeight = Math.floor(this.height - (itemDimension.height * numRows));

    let result = [];

    for(let j = 0; j < numRows; j++) {

      let rowArray = [];
      result.push(rowArray);

      for(let i = 0; i < numCols; i++) {
        let x = i * itemDimension.width;
        let y = j * itemDimension.height;
        let width = itemDimension.width;
        let height = itemDimension.height;

        //If we are on last column must add remaining width
        if(i === numCols - 1) {
          width -= remainingWidth;
        }

        //If we are on last row must add remaining height
        if(j === numRows - 1) {
          height -= remainingHeight;
        }

        //Add item to row Array
        rowArray.push(new Rectangle(x, y, width, height));
      }
    }

    return result;
  }

}

export default Dimension;