import Toolbar from './toolbar';
import { LoaderResource, Sprite } from 'pixi.js';
import Game from '../game';

/**
 * Selected by the user to manipulate individual cells in the world.
 */
export default class Tool {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly SPRITE_FILE_BACKGROUND = 'tool-bg.png';
    public static readonly SPRITE_FILE_BACKGROUND_DEPRESSED = 'tool-bg-d.png';

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _toolbar: Toolbar;
    private _id: number;
    private _label: string;
    private _x: number;
    private _y: number;
    private _spritesheet: LoaderResource;
    private _background: Sprite;
    private _foreground: Sprite;

    constructor(toolbar: Toolbar, id: number, label: string, x: number, y: number, spritesheet: LoaderResource) {
        this._toolbar = toolbar;
        this._id = id;
        this._label = label;
        this._x = x;
        this._y = y;
        this._spritesheet = spritesheet;

        this.generateGraphics();
    }

    generateGraphics(): void {
        let filename = Tool.SPRITE_FILE_BACKGROUND;
        // Show the tool as depressed if it's the one in use
        if (this._toolbar.game.toolInUse === this) {
            filename = Tool.SPRITE_FILE_BACKGROUND_DEPRESSED;
        }

        const backgroundGraphic = new Sprite(this._spritesheet.textures[filename]);
        backgroundGraphic.x = this._x;
        backgroundGraphic.y = this._y;
        backgroundGraphic.scale.set(Game.SPRITE_SCALE);
        backgroundGraphic.interactive = true;

        backgroundGraphic.on('mousedown', (e) => this._toolbar.onToolClick(e, this));

        this._background = backgroundGraphic;

        let spriteFilename;
        switch (this._id) {
            case Toolbar.SELECT_TOOL:
                spriteFilename = 'tool-select.png';
                break;
            case Toolbar.ROAD_TOOL:
                spriteFilename = 'tool-road.png';
                break;
            case Toolbar.BULLDOZE_TOOL:
                spriteFilename = 'tool-bulldoze.png';
                break;
            case Toolbar.RESIDENTIAL_ZONE_TOOL:
                spriteFilename = 'tool-residential.png';
                break;
        }

        const toolGraphic = new Sprite(this._spritesheet.textures[spriteFilename]);
        toolGraphic.x = this._x;
        toolGraphic.y = this._y;
        toolGraphic.scale.set(Game.SPRITE_SCALE);
        toolGraphic.interactive = true;

        toolGraphic.on('mousedown', (e) => this._toolbar.onToolClick(e, this));

        this._foreground = toolGraphic;
    }

    updateGraphics(): void {
        // Show the tool as depressed if it's the one in use
        if (this._toolbar.game.toolInUse === this) {
            this._background.texture = this._spritesheet.textures[Tool.SPRITE_FILE_BACKGROUND_DEPRESSED];
        } else {
            this._background.texture = this._spritesheet.textures[Tool.SPRITE_FILE_BACKGROUND];
        }
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

    get background(): PIXI.Sprite {
        return this._background;
    }

    get foreground(): PIXI.Sprite {
        return this._foreground;
    }
}
