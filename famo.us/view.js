var FamousEngine = require('famous/core/FamousEngine');
var DOMElements = require('famous/dom-renderables/DOMElements');

function view(selector, data){
  this.context = FamousEngine.createScene(selector);

  this.root = this.context.addChild();

  this.el = new DOMElement(this.root);
  this.el.setContent('hello.famous');
  this.el.setProperty('font-size', '40px');
};

module.exports = view;