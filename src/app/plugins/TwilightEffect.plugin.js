import BaseEffectPlugin from './BaseEffect.plugin';
import is from 'is_js';

/**
 * Like Zelda Twilight princess transition
 */
class TwilightEffectPlugin extends BaseEffectPlugin {

  /**
   * Base constructor
   */
  constructor(maxTime) {
    super();

    this.maxTime = !is.number(maxTime) ? 1000 : maxTime;
  }

  /**
   * Do transition
   * @param imageSwitcherInstance
   * @returns {Promise<any[]>}
   */
  async doTransition(imageSwitcherInstance) {
    let elements = [];

    for(let $$node of imageSwitcherInstance._container.children) {
      $$node.classList.add('twilight');
      elements.push($$node);
    }

    //Shuffle Elements
    elements.sort(() => .5 -  Math.random());

    let promises = [];

    //Set up wich should be the time increment, we want that all slices start to transition in less than a second
    let timeIncrement = this.maxTime / elements.length;

    for(let i = 0; i < elements.length; i++) {
      let $$node = elements[i];
      $$node.style.transitionDelay = '{0}ms'.formatUnicorn(i * timeIncrement);

      promises.push(new Promise(done => {
        $$node.addEventListener('transitionend', function(args) {
          if(args.propertyName == 'opacity' && $$node.parentElement) {
            imageSwitcherInstance._container.removeChild($$node);
            done();
          }
        });
      }));
    }

    setTimeout(() => {
      for(let $$node of elements) {
        $$node.style.transform = 'translateY(-{0}px) rotateY(720deg)'.formatUnicorn(Math.random() * imageSwitcherInstance._container.getDimension().height);
        $$node.classList.add('animate');
      }
    });

    //Wait all promises
    return Promise.all(promises);
  }
}

//Export singleton model
export default TwilightEffectPlugin;