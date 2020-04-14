import Menu from './Menu';
import SpeedMenu from './SpeedMenu';
import Game from '../../Game';

/**
 * A non-world container for Menus.
 */
export default class Menubar {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly STARTING_X = 0;
    public static readonly STARTING_Y = 0;
    public static readonly HEIGHT = 40;
    public static readonly SPEED_MENU = 0;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _game: Game;
    private _menus: Menu[];

    constructor(game: Game) {
        this._game = game;
        this._menus = [new SpeedMenu(this)];

        this.generateGraphics();
    }

    generateGraphics(): void {
        const x = Menubar.STARTING_X;
        let y = Menubar.STARTING_Y;

        for (let i = 0; i < this._menus.length; i++) {
            const menu = this._menus[i];
            menu.x = x;
            menu.y = y;
            y += Menubar.HEIGHT;
        }
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
