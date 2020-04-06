import ViewableObject from '../viewable-object';
import {Text} from "pixi.js";

export default class HUDItem extends ViewableObject {

  // Constants
  public static readonly WIDTH = 100;
  public static readonly TEXT_COLOR = 0xf5f5f5;

  // CLass properties
  private _label: string;
  private _value: number;

  constructor(label: string, value: number) {
    super();

    this._label = label;
    this._value = value;

    this.generateGraphics();
  }

  generateGraphics(): void{
    // Text
    const text = new Text(this._label + ': ' + this._value, {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: HUDItem.TEXT_COLOR,
      align: 'center',
    });
    this.graphics = [text];
  }

  changeX(value): void{
    this.graphics[0].x = value;
  }

  changeY(value): void{
    this.graphics[0].y = value;
  }

  // Getters and setters -------------------------------------------------------

  get label(): string {
    return this._label;
  }

  get value(): number{
    return this._value;
  }

  set value(value){
    this._value = value;
  }
}