import BaseEffectPlugin from './BaseEffect.plugin';
import is from 'is_js';

class GhostEffectPlugin extends BaseEffectPlugin {

  /**
   * Base constructor, empty
   */
  constructor(itemDistance) {
    super();

    this.itemDistance = is.number(itemDistance) ? itemDistance : 10;
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
      $$node.classList.add('ghost');
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



    for(let element of elements) {
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
      let middle_x = Math.ceil(max_x / 2);
      let middle_y = Math.ceil(max_y / 2);
      let distance = 10;

      for(let element of elements) {

        let diffX = (middle_x - element.x) * distance * -1;
        let diffY = (middle_y - element.y) * distance * -1;

        element.node.style.transform = 'translateX({0}px) translateY({1}px)'.formatUnicorn(diffX, diffY);


        element.node.classList.add('animate');
      }
    });


    return Promise.all(promises);
  }
}

export default GhostEffectPlugin;