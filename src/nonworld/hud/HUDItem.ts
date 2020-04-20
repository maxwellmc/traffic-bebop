/*
 * Traffic Bebop - A traffic management web game
 * Copyright (C) 2020  Max McMahon
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Text } from 'pixi.js';
import Game from '../../Game';
import AbstractSingleGraphicObject from '../../AbstractSingleGraphicObject';

/**
 * An item within the HUD, displaying both the label and the value.
 */
export default class HUDItem extends AbstractSingleGraphicObject {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly WIDTH = 200;
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
        this._graphic = new Text(this.generateFullText(), {
            fontFamily: Game.FONT_FAMILY,
            fontSize: 28,
            fill: HUDItem.TEXT_COLOR,
            align: 'center',
        });
    }

    updateGraphics(): void {
        const graphic = this._graphic as Text;
        graphic.text = this.generateFullText();
    }

    generateFullText(): string {
        return this._label + ': ' + this._value;
    }

    changeX(value): void {
        this._graphic.x = value;
    }

    changeY(value): void {
        this._graphic.y = value;
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
