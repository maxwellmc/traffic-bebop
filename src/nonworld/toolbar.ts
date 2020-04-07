import Tool from './tool';
import Game from '../game';

/**
 * A non-world container for Tools.
 */
export default class Toolbar {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly TOOLBAR_STARTING_X = 20;
    public static readonly TOOLBAR_STARTING_Y = 80;
    public static readonly TOOL_WIDTH = 110;
    public static readonly TOOL_HEIGHT = 40;

    public static readonly SELECT_TOOL = 0;
    public static readonly ROAD_TOOL = 1;
    public static readonly BULLDOZE_TOOL = 2;
    public static readonly RESIDENTIAL_ZONE_TOOL = 3;
    public static readonly TOOLS = [
        {
            id: Toolbar.SELECT_TOOL,
            label: 'Select',
        },
        {
            id: Toolbar.ROAD_TOOL,
            label: 'Road',
        },
        {
            id: Toolbar.BULLDOZE_TOOL,
            label: 'Bulldoze',
        },
        {
            id: Toolbar.RESIDENTIAL_ZONE_TOOL,
            label: 'Residential',
        },
    ];

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _game: Game;
    private _tools: Tool[];

    constructor(game: Game) {
        this._game = game;
        this._tools = [];

        this.generateGraphics();
    }

    generateGraphics(): void {
        const x = Toolbar.TOOLBAR_STARTING_X;
        let y = Toolbar.TOOLBAR_STARTING_Y;

        for (let i = 0; i < Toolbar.TOOLS.length; i++) {
            const tool = Toolbar.TOOLS[i];
            this.addTool(new Tool(this, tool.id, tool.label, x, y));
            y += Toolbar.TOOL_HEIGHT;
        }
    }

    addTool(tool): void {
        this._tools.push(tool);
    }

    onToolClick(e, tool): void {
        this._game.toolInUse = tool;
        console.log('onToolClick: ' + this.game.toolInUse.label);
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get game(): Game {
        return this._game;
    }

    set game(value) {
        this._game = value;
    }

    get tools(): Tool[] {
        return this._tools;
    }

    set tools(value) {
        this._tools = value;
    }
}
