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
import MenuItem from './MenuItem';
import Menubar from './Menubar';
import GameState from '../../GameState';
import Game from '../../Game';
import { Speeds } from '../../Speed';

export default class SpeedMenu extends Menu {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly PAUSED_ITEM = 0;
    public static readonly NORMAL_ITEM = 1;
    public static readonly FAST_ITEM = 2;

    constructor(menubar: Menubar) {
        super(menubar);
        this._label = 'Speed';

        for (let i = 0; i < Object.keys(Speeds).length / 2; i++) {
            const y = Menu.HEIGHT + i * MenuItem.HEIGHT;
            this._items.push(new MenuItem(this, i, Speeds[i], 0, y));
        }
    }

    onMenuItemClick(menuItem: MenuItem): void {
        console.log('onMenuItemClick');
        switch (menuItem.id) {
            case SpeedMenu.PAUSED_ITEM:
                this._menubar.game.eventEmitter.emit(Game.EVENT_SPEED_SET, Speeds.Paused);
                break;
            case SpeedMenu.NORMAL_ITEM:
                this._menubar.game.eventEmitter.emit(Game.EVENT_SPEED_SET, Speeds.Normal);
                break;
            case SpeedMenu.FAST_ITEM:
                this._menubar.game.eventEmitter.emit(Game.EVENT_SPEED_SET, Speeds.Fast);
                break;
        }
    }
}
