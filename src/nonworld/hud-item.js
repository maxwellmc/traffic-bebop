import ViewableObject from '../viewable-object';
import {Text} from "pixi.js";

export default class HUDItem extends ViewableObject {

  // Constants
  static WIDTH = 100;
  static TEXT_COLOR = 0xf5f5f5;

  // CLass properties
  #label;
  #value;

  constructor(label, value) {
    super();

    this.#label = label;
    this.#value = value;

    this.generateGraphics();
  }

  generateGraphics(){
    // Text
    const text = new Text(this.#label + ': ' + this.#value, {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: HUDItem.TEXT_COLOR,
      align: 'center',
    });
    this.graphics = [text];
  }

  changeX(value){
    this.graphics[0].x = value;
  }

  changeY(value){
    this.graphics[0].y = value;
  }

  // Getters and setters -------------------------------------------------------

  get label(){
    return this.#label;
  }

  get value(){
    return this.#value;
  }

  set value(value){
    this.#value = value;
  }
}
