import Menu from './menu';
import MenuItem from './menu-item';
import Menubar from './menubar';
import GameState from '../../game-state';
import Game from '../../game';
import { Speeds } from '../speed';

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
