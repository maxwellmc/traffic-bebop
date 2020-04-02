import Tool from './tool';

/**
 * A non-world container for Tools.
 */
export default class Toolbar {

  // Constants
  static TOOLBAR_STARTING_X = 20;
  static TOOLBAR_STARTING_Y = 20;
  static TOOL_WIDTH = 110;
  static TOOL_HEIGHT = 40;

  static SELECT_TOOL = 0;
  static ROAD_TOOL = 1;
  static BULLDOZE_TOOL = 2;
  static TOOLS = [
    {
      'id': Toolbar.SELECT_TOOL,
      'label': 'Select',
    },
    {
      'id': Toolbar.ROAD_TOOL,
      'label': 'Road',
    },
    {
      'id': Toolbar.BULLDOZE_TOOL,
      'label': 'Bulldoze',
    },
  ];

  // Class properties
  #game;
  /** @type array */
  #tools;

  constructor(game) {

    this.#game = game;
    this.#tools = [];

    this.generateGraphics();
  }

  generateGraphics() {
    let x = Toolbar.TOOLBAR_STARTING_X;
    let y = Toolbar.TOOLBAR_STARTING_Y;

    for (let i = 0; i < Toolbar.TOOLS.length; i++) {
      const tool = Toolbar.TOOLS[i];
      this.addTool(new Tool(this, tool.id, tool.label, x, y));
      y += Toolbar.TOOL_HEIGHT;
    }
  }

  addTool(tool) {
    this.#tools.push(tool);
  }

  onToolClick(e, tool) {

    this.#game.toolInUse = tool;
    console.log('onToolClick: ' + this.game.toolInUse.label);
  }

  findToolByGraphic(graphic) {
    for (const tool of this.#tools) {
      if (tool.graphics[0] === graphic) {
        return tool;
      }
    }
    return null;
  }

  // Getters and setters -------------------------------------------------------

  get game() {
    return this.#game;
  }

  set game(value) {
    this.#game = value;
  }

  get tools() {
    return this.#tools;
  }

  set tools(value) {
    this.#tools = value;
  }
}
