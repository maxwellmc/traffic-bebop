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

import ViewableObject from '../../ViewableObject';
import Menu from './Menu';

/**
 * An individual choice in a Menu, only shown when the Menu is in the open state.
 */
export default class MenuItem extends ViewableObject {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly FILL_COLOR = 0xeeeeee;
    public static readonly LINE_COLOR = 0xdedede;
    public static readonly TEXT_COLOR = 0xc10000;
    public static readonly WIDTH = 70;
    public static readonly HEIGHT = 30;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _menu: Menu;
    private _id: number;
    private _label: string;
    private _x: number;
    private _y: number;

    constructor(menu: Menu, id: number, label: string, x: number, y: number) {
        super();
        this._menu = menu;
        this._id = id;
        this._label = label;
        this._x = x;
        this._y = y;
    }

    generateGraphics(): void {
        // Rectangle
        const rectangle = ViewableObject.generateRectangle(
            4,
            MenuItem.LINE_COLOR,
            1,
            MenuItem.FILL_COLOR,
            MenuItem.WIDTH,
            MenuItem.HEIGHT,
            this._x,
            this._y,
        );

        rectangle.on('mousedown', () => this._menu.onMenuItemClick(this));
        rectangle.on('touchstart', () => this._menu.onMenuItemClick(this));

        this._graphics = [rectangle];

        // Text
        const text = ViewableObject.generateText(this._label, 12, MenuItem.TEXT_COLOR, this._x + 5, this._y + 5);

        this._graphics = this.graphics.concat(text);
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get id(): number {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get label(): string {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }
}
