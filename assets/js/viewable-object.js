import {Graphics, Text} from 'pixi.js';

export default class ViewableObject {

  #graphics;

  constructor() {
    this.#graphics = [];
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
