import './extensions/Dimension.extensions';
import 'format-unicorn';
import extend from 'extend';
import is from 'is_js';

import SplitStrategy from './SplitStrategy';
import BaseEffectPlugin from './plugins/BaseEffect.plugin';
import TwilightEffectPlugin from "./plugins/TwilightEffect.plugin";

/**
 * Default options
 * @type {{}}
 */
let defaultOptions = {
  'splitStrategy': new SplitStrategy(SplitStrategy.strategies.widthAndHeight, 50, 50),
  'effectPlugin': new TwilightEffectPlugin()
};

/**
 * Image switcher class
 */
class ImageSwitcher {

  /**
   *
   * @param element
   * @param backgroundImage
   * @param options
   */
  constructor(element, backgroundImage, options) {

    //If there is no image option, throw an error
    if(!is.string(backgroundImage) || is.empty(backgroundImage)) { throw new Error('you should set up a background Image to the element'); }

    //Store where is the element stored
    this._element = element;

    //Extend and store options
    this.options = extend(defaultOptions, options);

    //SplitStrategy isn't a SplitStrategy
    if(is.null(this.options.splitStrategy) || !this.options.splitStrategy instanceof SplitStrategy) {
      throw new Error('Please set up the correct split strategy');
    }

    //Effect isn't a base EffectPlugin
    if(is.null(this.options.effectPlugin) || !this.options.effectPlugin instanceof BaseEffectPlugin) {
      throw new Error('Please set up the correct plugin');
    }

    //Store which is the current image
    this._currentImage = backgroundImage;

    //Set up the container
    this._container = _createContainer.apply(this);

    //Append container to the element and set it up on position relative
    this._element.append(this._container);
    this._element.style.position = 'relative';

    //Set up state
    this._$$state = {
      'onTransition': false,
    };
  }

  /**
   * Does the specified transition with the splitstrategy requested
   * @param newImageSource
   * @param effectPlugin Optional
   * @param splitStrategy Optional
   * @returns {Promise<void>}
   */
  async doTransition(newImageSource, effectPlugin, splitStrategy) {

    //If we are on a transition, omit
    if(this._$$state.onTransition) { return; }

    if(is.null(splitStrategy) || !splitStrategy instanceof SplitStrategy) { splitStrategy = this.options.splitStrategy; }
    if(is.null(effectPlugin) || ! effectPlugin instanceof BaseEffectPlugin) { effectPlugin = this.options.effectPlugin; }

    //Split the container and wait
    await _splitContainer.apply(this, [splitStrategy]);

    //Change container background (before starting the transition
    this._container.style.backgroundImage = 'url(\'{0}\')'.formatUnicorn(newImageSource);

    //Set up that we are on a transition (To prevent making another)
    this._$$state.onTransition = true;

    //Call to plugin transition
    await effectPlugin.doTransition(this);

    //Change the currentImage
    this._currentImage = newImageSource;

    //Indicate that transition is over
    this._$$state.onTransition = false;
  }
}

/**
 * Image switcher split strategies
 * @type {{widthAndHeight: string, colsAndRows: string}}
 */
ImageSwitcher.splitStrategies = {
  'colsAndRows': 'colsAndRows',
  'widthAndHeight': 'widthAndHeight'
};

/**
 * Sets up the container
 * @returns {HTMLElement}
 * @private
 */
function _createContainer() {
  let container = document.createElement('div');

  container.classList.add('is-bg-container');
  container.style.backgroundImage = 'url(\'{0}\')'.formatUnicorn(this._currentImage);
  container.style.backgroundRepeat = 'no-repeat';


  return container;
}

/**
 *
 * @param imageSrc
 * @returns {Promise<Image>}
 * @private
 */
function _getImageElementPromise(imageSrc) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      resolve(img);
    };
  });
}

/**
 * Splits the container
 * @param splitStrategy
 * @returns {Promise<void>}
 * @private
 */
async function _splitContainer(splitStrategy) {

  //If container has elements, remove em all
  while(this._container.firstChild) { this._container.removeChild(this._container.firstChild); };

  //Load the image and wait till is loaded
  //NOTE: Image should be on cache, that must be handled fast
  let image = await _getImageElementPromise(this._currentImage);

  //Calculate what it's the image final dimension
  let resultImageDimension = image.getDimension().resize(this._container.getDimension());

  //Set up the rectangles
  let rectangles = null;

  //Split container
  switch(splitStrategy.stategy) {
    case SplitStrategy.strategies.colsAndRows:
      rectangles = this._container.getDimension().splitByColsAndRows(splitStrategy.x, splitStrategy.y);
      break;

    case SplitStrategy.strategies.widthAndHeight:
      rectangles = this._container.getDimension().splitByWidthAndHeight(splitStrategy.x, splitStrategy.y);
      break;
  }

  //If there are no rectangles, resolve
  if(is.null(rectangles) || is.empty(rectangles)) {
    return Promise.resolve();
  }

  //Add the rectangles
  for(let j = 0; j < rectangles.length; j++) {
    for(let i = 0; i < rectangles[j].length; i++) {

      let $$rectangle = rectangles[j][i];

      //Generate new div element
      let newElement = document.createElement('div');

      //Add is-bg-item class
      newElement.classList.add('is-bg-item');

      //Set it's position
      newElement.dataset.x = i;
      newElement.dataset.y = j;

      //Position element
      newElement.style.top = '{0}px'.formatUnicorn($$rectangle.y);
      newElement.style.left = '{0}px'.formatUnicorn($$rectangle.x);
      newElement.style.width = '{0}px'.formatUnicorn($$rectangle.width);
      newElement.style.height = '{0}px'.formatUnicorn($$rectangle.height);

      //Set up background image
      newElement.style.backgroundImage = 'url(\'{0}\')'.formatUnicorn(this._currentImage);
      newElement.style.backgroundSize = '{0}px {1}px'.formatUnicorn(resultImageDimension.width, resultImageDimension.height);
      newElement.style.backgroundPosition = '-{0}px -{1}px'.formatUnicorn($$rectangle.x, $$rectangle.y);


      this._container.append(newElement);
    }
  }
}

export default ImageSwitcher;