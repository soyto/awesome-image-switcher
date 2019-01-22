/**
 * Base plugin
 */
class BaseEffectPlugin {

  /**
   * Empty constructor
   */
  constructor () {}

  /**
   * Abstract method, should be replaced on all instances
   * @param imageSwitcherInstance
   */
  async doTransition(imageSwitcherInstance) {
    throw new Error('Child methods should implement this method');
  }
}

export default BaseEffectPlugin;