import ViewableObject from '../viewable-object';
import { Text } from 'pixi.js';

export default class HUDItem extends ViewableObject {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly WIDTH = 100;
    public static readonly TEXT_COLOR = 0xf5f5f5;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _label: string;
    private _value: string;

    constructor(label: string, value: string) {
        super();

        this._label = label;
        this._value = value;

        this.generateGraphics();
    }

    generateGraphics(): void {
        // Text
        const text = new Text(this._label + ': ' + this._value, {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: HUDItem.TEXT_COLOR,
            align: 'center',
        });
        this.graphics = [text];
    }

    changeX(value): void {
        this.graphics[0].x = value;
    }

    changeY(value): void {
        this.graphics[0].y = value;
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get label(): string {
        return this._label;
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }
}
