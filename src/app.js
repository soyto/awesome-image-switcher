import './sass/main.scss';

import SplitStrategy from './app/SplitStrategy';
import TwilightEffectPlugin from './app/plugins/TwilightEffect.plugin';
import GhostEffectPlugin from './app/plugins/GhostEffect.plugin';
import AccordionEffectPlugin from './app/plugins/AccordionEffect.plugin';

import ImageSwitcher from './app/ImageSwitcher';


let slides = [
  {
    'image': 'https://images.unsplash.com/photo-1547816672-0cff9a3202a6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    'effectPlugin': new TwilightEffectPlugin(),
    'splitStrategy': new SplitStrategy(SplitStrategy.strategies.widthAndHeight, 50, 50),
  },
  {
    'image': 'https://images.unsplash.com/photo-1547647496-1ef40ef62bc4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    'effectPlugin': new AccordionEffectPlugin(),
    'splitStrategy': new SplitStrategy(SplitStrategy.strategies.widthAndHeight, 100, 100),
  },
  {
    'image': 'https://images.unsplash.com/photo-1547982705-5562cc68046d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    'effectPlugin': new GhostEffectPlugin(100),
    'splitStrategy': new SplitStrategy(SplitStrategy.strategies.widthAndHeight, 100, 50),
  },
  {
    'image': 'https://images.unsplash.com/photo-1547994770-e5d8509b114d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    'effectPlugin': new TwilightEffectPlugin(),
    'splitStrategy': new SplitStrategy(SplitStrategy.strategies.colsAndRows, 5, 10),
  },
  {
    'image': 'https://images.unsplash.com/photo-1548004000-5161ed59c0a5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    'effectPlugin': new AccordionEffectPlugin(),
    'splitStrategy': new SplitStrategy(SplitStrategy.strategies.widthAndHeight, 100, 100),
  },
  {
    'image': 'https://images.unsplash.com/photo-1547997406-e915ef666ac7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    'effectPlugin': new TwilightEffectPlugin(),
    'splitStrategy': new SplitStrategy(SplitStrategy.strategies.widthAndHeight, 50, 50),
  },
  {
    'image': 'https://images.unsplash.com/photo-1547976013-2af772e8cecf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    'effectPlugin': new GhostEffectPlugin(50),
    'splitStrategy': new SplitStrategy(SplitStrategy.strategies.colsAndRows, 10, 10),
  },
];



let element = document.getElementById('image-switcher');
let imageSwitcher = new ImageSwitcher(element, slides[0].image);

let _currentImageIndex = 0;

setTimeout(async () => {
  await _loopTransitions();
}, 1000);

async function _loopTransitions() {
  await _doTransition();
  setTimeout(async () => {
    await _loopTransitions();
  }, 1000);
}

async function _doTransition() {
  _currentImageIndex++;

  if(_currentImageIndex >= slides.length) { _currentImageIndex = 0; }

  let slide = slides[_currentImageIndex];

  await imageSwitcher.doTransition(slide.image, slide.effectPlugin, slide.splitStrategy);
}