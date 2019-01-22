/**
 * SplitStrategy object
 */
class SplitStrategy {

  /**
   * Constructor
   * @param strategy
   * @param x
   * @param y
   */
  constructor(strategy, x, y) {
    this.stategy = strategy;
    this.x = x;
    this.y = y;
  }


}

SplitStrategy.strategies = {
  'colsAndRows': 'colsAndRows',
  'widthAndHeight': 'widthAndHeight'
};

export default SplitStrategy;