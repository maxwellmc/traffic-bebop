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

import Menu from './Menu';
import SpeedMenu from './SpeedMenu';
import Game from '../../Game';
import { Graphics } from 'pixi.js';
import AbstractSingleGraphicObject from '../../AbstractSingleGraphicObject';
import ViewMenu from './ViewMenu';
import { MenubarEvents } from '../../Events';
import ViewableInterface from '../../ViewableInterface';
import PositionableInterface from '../../PositionableInterface';

/**
 * A non-world container for Menus.
 *
 * Inside a Menubar is many Menus. Each Menu has many MenuItems. The Menubar and its Menus are always visible, but a
 * Menu's MenuItems are only visible and interactive when that Menu is open.
 */
export default class Menubar extends AbstractSingleGraphicObject implements ViewableInterface, PositionableInterface {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly STARTING_X = 0;
    public static readonly STARTING_Y = 0;
    public static readonly HEIGHT = 40;
    public static readonly FILL_COLOR = 0xcccacb;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _game: Game;
    private _menus: Menu[];

    constructor(game: Game) {
        super();

        this._game = game;
        this._menus = [new SpeedMenu(this), new ViewMenu(this)];
    }

    generateGraphics(): void {
        const rectangle = new Graphics();
        rectangle.beginFill(Menubar.FILL_COLOR);
        rectangle.drawRect(Menubar.STARTING_X, Menubar.STARTING_Y, this._game.renderer.screen.width, Menubar.HEIGHT);
        rectangle.endFill();

        rectangle.interactive = true;
        rectangle.on('mousedown', () => this.onMenubarClick());
        rectangle.on('touchstart', () => this.onMenubarClick());

        this.graphic = rectangle;
    }

    setGraphicsPositioning(): void {
        const x = Menubar.STARTING_X;

        for (let i = 0; i < this._menus.length; i++) {
            const menu = this._menus[i];
            menu.x = x + Menu.WIDTH * i;
            menu.y = Menubar.STARTING_Y;
            menu.setGraphicsPositioning();
        }
    }

    onMenubarClick(): void {
        this._game.eventEmitter.emit(MenubarEvents.Clicked);
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get game(): Game {
        return this._game;
    }

    set game(value) {
        this._game = value;
    }

    get menus(): Menu[] {
        return this._menus;
    }

    set menus(value) {
        this._menus = value;
    }
}
