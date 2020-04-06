import {Graphics, Text} from 'pixi.js';

export default class ViewableObject {

  /** @type {PIXI.DisplayObject[]} */
  #graphics;

  constructor() {
    this.#graphics = [];
  }

  generateGraphics(){
    throw new Error('Implementation required');
  }

  /**
   *
   * @param {PIXI.DisplayObject} graphic
   */
  removeGraphic(graphic){

    // Actually remove the item from the array
    const index = this.#graphics.indexOf(graphic);
    if (index > -1) {
      this.#graphics = this.#graphics.splice(index, 1);
    }

    // Destroy the DisplayObject in Pixi
    graphic.destroy();
  }

  removeAllGraphics(){

    // Get a reference to the graphics
    /** @type {PIXI.DisplayObject[]} */
    const graphics = this.#graphics;

    // Clear the array
    this.#graphics = [];

    // Destroy the DisplayObjects in Pixi
    for(const graphic of graphics){
      graphic.destroy();
    }
  }

  static generateRectangle(lineWidth, lineColor, lineAlpha, fillColor, width, height, x, y){
    const rectangle = new Graphics();
    rectangle.lineStyle(lineWidth, lineColor, lineAlpha);
    rectangle.beginFill(fillColor);
    rectangle.drawRect(0, 0, width, height);
    rectangle.endFill();
    rectangle.x = x;
    rectangle.y = y;
    rectangle.interactive = true;
    return rectangle;
  }

  static generateText(actualText, fontSize, fillColor, x, y){
    const text = new Text(actualText, {
      fontFamily: 'Arial',
      fontSize: fontSize,
      fill: fillColor,
      align: 'center',
    });
    text.x = x;
    text.y = y;
    return text;
  }

  // Getters and setters -------------------------------------------------------

  get graphics() {
    return this.#graphics;
  }

  set graphics(value) {
    this.#graphics = value;
  }
}
