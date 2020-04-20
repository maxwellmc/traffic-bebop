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

import Menubar from './Menubar';
import MenuItem from './MenuItem';
import { Text, Graphics } from 'pixi.js';
import AbstractTwoGraphicObject from '../../AbstractTwoGraphicObject';
import GraphicUtil from '../../GraphicUtil';

/**
 * Selected by the user to manipulate the game state.
 */
export default abstract class Menu extends AbstractTwoGraphicObject {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly HEIGHT = 40;
    public static readonly WIDTH = 100;
    public static readonly FILL_COLOR = 0xcccacb;
    public static readonly LINE_COLOR = 0xdedede;
    public static readonly TEXT_COLOR = 0x1f1f1f;
    public static readonly TEXT_SIZE = 26;
    public static readonly TEXT_X_OFFSET = 24;
    public static readonly TEXT_Y_OFFSET = 11;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    protected _menubar: Menubar;
    protected _x: number;
    protected _y: number;
    protected _open: boolean;
    protected _label: string;
    protected _items: MenuItem[];

    /**
     *
     * @param {Menubar} menubar
     */
    protected constructor(menubar: Menubar) {
        super();
        this._menubar = menubar;
        this._x = 0;
        this._y = 0;
        this._open = false;
        this._label = '';
        this._items = [];
    }

    generateGraphics(): void {
        // Rectangle
        const rectangle = GraphicUtil.generateRectangle(
            0,
            Menu.LINE_COLOR,
            1,
            Menu.FILL_COLOR,
            Menu.WIDTH,
            Menu.HEIGHT,
            0,
            0,
        );

        rectangle.on('mousedown', () => this.onMenuClick());
        rectangle.on('touchstart', () => this.onMenuClick());

        this._background = rectangle;

        // Text
        const text = GraphicUtil.generateText(
            this._label,
            Menu.TEXT_SIZE,
            Menu.TEXT_COLOR,
            this._x + Menu.TEXT_X_OFFSET,
            this._y + Menu.TEXT_Y_OFFSET,
        );

        this._foreground = text;
    }

    onMenuClick(): void {
        this.toggleOpen();
    }

    toggleOpen(): void {
        this._open = !this._open;
    }

    abstract onMenuItemClick(menuItem: MenuItem): void;

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get x(): number {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get open(): boolean {
        return this._open;
    }

    set open(value) {
        this._open = value;
    }

    get label(): string {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }

    get items(): MenuItem[] {
        return this._items;
    }

    set items(value) {
        this._items = value;
    }
}
