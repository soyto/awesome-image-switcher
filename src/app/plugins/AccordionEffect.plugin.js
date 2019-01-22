import BaseEffectPlugin from './BaseEffect.plugin';
import is from 'is_js';

class AccordionEffectPlugin extends BaseEffectPlugin {

  /**
   * Base constructor, empty
   */
  constructor(maxTime) {
    super();

    this.maxTime = is.number(maxTime) ? maxTime : 1000;
  }

  /**
   * Do the transition
   * @param imageSwitcherInstance
   * @returns {Promise<void>}
   */
  async doTransition(imageSwitcherInstance) {

    let elements = [];

    let max_x = 0;
    let max_y = 0;

    for(let $$node of imageSwitcherInstance._container.children) {
      $$node.classList.add('accordion');
      let item = {
        'x': parseInt($$node.dataset.x),
        'y': parseInt($$node.dataset.y),
        'node': $$node
      };

      if(item.x > max_x) { max_x = item.x; }
      if(item.y > max_y) { max_y = item.y; }


      elements.push(item);
    }

    let promises = [];

    //As we want an accordion effect (right to left) we should start on the end
    let increment_y = this.maxTime / max_y;

    for(let element of elements) {
      element.node.style.transitionDelay = '{0}ms'.formatUnicorn((max_y - element.y) * increment_y + Math.abs(max_x / 2 - element.x) * 50);

      promises.push(new Promise(done => {
        element.node.addEventListener('transitionend', function(args) {
          if(args.propertyName == 'opacity' && element.node.parentElement) {
            imageSwitcherInstance._container.removeChild(element.node);
            done();
          }
        });
      }));
    }

    setTimeout(() => {
      for(let element of elements) {
        element.node.classList.add('animate');
      }
    });


    return Promise.all(promises);
  }
}

export default AccordionEffectPlugin;