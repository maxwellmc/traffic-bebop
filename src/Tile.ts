import ViewableObject from './ViewableObject';
import Grid from './Grid';
import Cell from './Cell';
import { Container, LoaderResource, Sprite, Text } from 'pixi.js';
import Game from './Game';
import { TileGraphicLayer } from './TileGraphic';

/**
 * A cell within the world.
 */
export default class Tile extends ViewableObject {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly SPRITE_BLANK = '';
    public static readonly SPRITE_FILE_GRASS = 'grass.png';
    public static readonly SPRITE_FILE_ZONE_RESIDENTIAL = 'zone-r.png';
    public static readonly SPRITE_FILE_ZONE_COMMERCIAL = 'zone-c.png';
    public static readonly SPRITE_FILE_STRUCTURE_HOUSE_1 = 'house1.png';
    public static readonly SPRITE_FILE_STRUCTURE_BUSINESS_1 = 'business1.png';
    public static readonly SPRITE_FILE_GRID = 'grid.png';
    public static readonly SPRITE_FILE_DRAG = 'drag.png';
    public static readonly SPRITE_FILE_ROAD_MIDDLE = 'road-m.png';
    public static readonly SPRITE_FILE_ROAD_X = 'road-x.png';
    public static readonly SPRITE_FILE_ROAD_X_LEFT = 'road-xl.png';
    public static readonly SPRITE_FILE_ROAD_X_RIGHT = 'road-xr.png';
    public static readonly SPRITE_FILE_ROAD_Y = 'road-y.png';
    public static readonly SPRITE_FILE_ROAD_Y_BOTTOM = 'road-yb.png';
    public static readonly SPRITE_FILE_ROAD_Y_TOP = 'road-yt.png';
    public static readonly SPRITE_FILE_ROAD_BOTTOM_LEFT = 'road-bl.png';
    public static readonly SPRITE_FILE_ROAD_BOTTOM_RIGHT = 'road-br.png';
    public static readonly SPRITE_FILE_ROAD_TOP_LEFT = 'road-tl.png';
    public static readonly SPRITE_FILE_ROAD_TOP_RIGHT = 'road-tr.png';
    public static readonly SPRITE_FILE_ROAD_INTERSECT_LEFT = 'road-il.png';
    public static readonly SPRITE_FILE_ROAD_INTERSECT_RIGHT = 'road-ir.png';
    public static readonly SPRITE_FILE_ROAD_INTERSECT_BOTTOM = 'road-ib.png';
    public static readonly SPRITE_FILE_ROAD_INTERSECT_TOP = 'road-it.png';
    public static readonly SPRITE_FILE_ROAD_INTERSECT_MIDDLE = 'road-im.png';

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _grid: Grid;
    private _x: number;
    private _y: number;
    private _cell: Cell;
    private _spritesheet: LoaderResource;
    private _container: Container;
    private _layers: Map<TileGraphicLayer, string>;
    private _debugContainer: Container;

    constructor(grid: Grid, x: number, y: number, cell: Cell, spritesheet: LoaderResource) {
        super();

        this._grid = grid;
        this._x = x;
        this._y = y;
        this._cell = cell;
        this._spritesheet = spritesheet;
        this._container = new Container();
        this._layers = new Map<TileGraphicLayer, string>();
        this._debugContainer = new Container();
    }

    generateGraphics(): void {
        const name = `${this._x},${this._y}`;

        this._container.addChild(new Sprite());
        this._container.addChild(new Sprite());
        this._container.addChild(new Sprite());
        this._container.addChild(new Sprite());
        this._container.addChild(new Sprite());
        this._layers
            .set(TileGraphicLayer.Terrain, Tile.SPRITE_BLANK)
            .set(TileGraphicLayer.Zone, Tile.SPRITE_BLANK)
            .set(TileGraphicLayer.Structure, Tile.SPRITE_BLANK)
            .set(TileGraphicLayer.Grid, Tile.SPRITE_BLANK)
            .set(TileGraphicLayer.Highlight, Tile.SPRITE_BLANK);

        this._container.x = this._x;
        this._container.y = this._y;
        this._container.scale.set(Game.SPRITE_SCALE);
        this._container.interactive = true;
        this._container.name = name;

        // Create the debug graphic
        this._debugContainer.addChild(
            new Text('', {
                fontFamily: 'Arial',
                fontSize: 12,
                fill: 0xff0000,
                align: 'center',
            }),
        );
        this._debugContainer.x = this._x;
        this._debugContainer.y = this._y;
    }

    updateGraphics(): void {
        // Set the terrain
        if (this._cell.terrainType === Cell.TERRAIN_TYPE_GRASS) {
            if (this._layers.get(TileGraphicLayer.Terrain) !== Tile.SPRITE_FILE_GRASS) {
                this.setLayerSprite(TileGraphicLayer.Terrain, Tile.SPRITE_FILE_GRASS);
            }
        }

        // Set the zone
        if (this._cell.structureType === Cell.STRUCTURE_TYPE_EMPTY) {
            if (this._cell.zoneType === Cell.ZONE_TYPE_RESIDENTIAL) {
                if (this._layers.get(TileGraphicLayer.Zone) !== Tile.SPRITE_FILE_ZONE_RESIDENTIAL) {
                    this.setLayerSprite(TileGraphicLayer.Zone, Tile.SPRITE_FILE_ZONE_RESIDENTIAL);
                }
            } else if (this._cell.zoneType === Cell.ZONE_TYPE_COMMERCIAL){
                if (this._layers.get(TileGraphicLayer.Zone) !== Tile.SPRITE_FILE_ZONE_COMMERCIAL) {
                    this.setLayerSprite(TileGraphicLayer.Zone, Tile.SPRITE_FILE_ZONE_COMMERCIAL);
                }
            }
        }

        // Set the structure
        if (this._cell.structureType === Cell.STRUCTURE_TYPE_ROAD) {
            const roadFilename = this.determineRoadOrientation();
            if (this._layers.get(TileGraphicLayer.Structure) !== roadFilename) {
                this.setLayerSprite(TileGraphicLayer.Structure, roadFilename);
            }
        } else if (this._cell.structureType === Cell.STRUCTURE_TYPE_HOUSE) {
            if (this._layers.get(TileGraphicLayer.Structure) !== Tile.SPRITE_FILE_STRUCTURE_HOUSE_1) {
                this.setLayerSprite(TileGraphicLayer.Structure, Tile.SPRITE_FILE_STRUCTURE_HOUSE_1);
            }
        } else if (this._cell.structureType === Cell.STRUCTURE_TYPE_BUSINESS) {
            if (this._layers.get(TileGraphicLayer.Structure) !== Tile.SPRITE_FILE_STRUCTURE_BUSINESS_1) {
                this.setLayerSprite(TileGraphicLayer.Structure, Tile.SPRITE_FILE_STRUCTURE_BUSINESS_1);
            }
        }else{
            if (this._layers.get(TileGraphicLayer.Structure) !== Tile.SPRITE_BLANK) {
                this.setLayerSprite(TileGraphicLayer.Structure, Tile.SPRITE_BLANK);
            }
        }

        // Set the grid
        if (this._layers.get(TileGraphicLayer.Grid) !== Tile.SPRITE_FILE_GRID) {
            this.setLayerSprite(TileGraphicLayer.Grid, Tile.SPRITE_FILE_GRID);
        }

        // If this tile is part of a mouse-drag event, then add an overlay
        if (this._grid.isTileInDrag(this)) {
            if (this._layers.get(TileGraphicLayer.Highlight) !== Tile.SPRITE_FILE_DRAG) {
                this.setLayerSprite(TileGraphicLayer.Highlight, Tile.SPRITE_FILE_DRAG);
            }
        } else {
            if (this._layers.get(TileGraphicLayer.Highlight) !== Tile.SPRITE_BLANK) {
                this.setLayerSprite(TileGraphicLayer.Highlight, Tile.SPRITE_BLANK);
            }
        }

        const debugText = this._debugContainer.getChildAt(0) as Text;
        if (this._grid.game.debug) {
            debugText.text = String(this._cell.id);
        } else {
            debugText.text = '';
        }
    }

    setLayerSprite(layer, spriteFile): void {
        const sprite = this._container.getChildAt(layer) as Sprite;
        sprite.texture = this._spritesheet.textures[spriteFile];
        this._layers.set(layer, spriteFile);
    }

    determineRoadOrientation(): string {
        const bottomIsRoad = this._cell.doesBottomNeighborHaveStructure(Cell.STRUCTURE_TYPE_ROAD),
            topIsRoad = this._cell.doesTopNeighborHaveStructure(Cell.STRUCTURE_TYPE_ROAD),
            leftIsRoad = this._cell.doesLeftNeighborHaveStructure(Cell.STRUCTURE_TYPE_ROAD),
            rightIsRoad = this._cell.doesRightNeighborHaveStructure(Cell.STRUCTURE_TYPE_ROAD);

        // If the cell to the left of us is a road
        if (leftIsRoad) {
            // If the cells to the left and top are roads
            if (topIsRoad) {
                // If the cells to the left, top, and bottom are roads
                if (bottomIsRoad) {
                    // If the cells to the left, top, bottom, and right are roads
                    if (rightIsRoad) {
                        // We need the "intersection-middle" sprite
                        return Tile.SPRITE_FILE_ROAD_INTERSECT_MIDDLE;
                    }
                    // We need the "intersection-right" sprite
                    return Tile.SPRITE_FILE_ROAD_INTERSECT_RIGHT;
                }
                // If the cells to the left, top, and right are roads
                if (rightIsRoad) {
                    // We need the "intersection-bottom" sprite
                    return Tile.SPRITE_FILE_ROAD_INTERSECT_BOTTOM;
                }
                // We need the "bottom-right" sprite
                return Tile.SPRITE_FILE_ROAD_BOTTOM_RIGHT;
            }
            // If the cells to the left and bottom are roads
            if (bottomIsRoad) {
                // If the cells to the left, bottom, and right are roads
                if (rightIsRoad) {
                    // We need the "intersection-top" sprite
                    return Tile.SPRITE_FILE_ROAD_INTERSECT_TOP;
                }
                // We need the "top-right" sprite
                return Tile.SPRITE_FILE_ROAD_TOP_RIGHT;
            }
            // If the cells to the left and right are roads
            if (rightIsRoad) {
                // We just need the horizontal sprite
                return Tile.SPRITE_FILE_ROAD_X;
            }
            // We need the "horizontal right" sprite
            return Tile.SPRITE_FILE_ROAD_X_RIGHT;
        }

        // If the cell to the right of us is a road
        if (rightIsRoad) {
            // If the cells to the right and top are roads
            if (topIsRoad) {
                // If the cells to the right, top, and bottom are roads
                if (bottomIsRoad) {
                    // We need the "intersection-left" sprite
                    return Tile.SPRITE_FILE_ROAD_INTERSECT_LEFT;
                }
                // We need the "bottom-left" sprite
                return Tile.SPRITE_FILE_ROAD_BOTTOM_LEFT;
            }
            // If the cells to the right and bottom are roads
            if (bottomIsRoad) {
                // We need the "top-right" sprite
                return Tile.SPRITE_FILE_ROAD_TOP_LEFT;
            }
            // We need the "horizontal left" sprite
            return Tile.SPRITE_FILE_ROAD_X_LEFT;
        }

        if (topIsRoad) {
            if (bottomIsRoad) {
                // We just need the vertical sprite
                return Tile.SPRITE_FILE_ROAD_Y;
            }
            // We need the "vertical bottom" sprite
            return Tile.SPRITE_FILE_ROAD_Y_BOTTOM;
        }
        if (bottomIsRoad) {
            // We need the "vertical top" sprite
            return Tile.SPRITE_FILE_ROAD_Y_TOP;
        }

        // No neighboring roads
        return Tile.SPRITE_FILE_ROAD_MIDDLE;
    }

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

    set y(value: number) {
        this._y = value;
    }

    get cell(): Cell {
        return this._cell;
    }

    get container(): PIXI.Container {
        return this._container;
    }

    get debugContainer(): PIXI.Container {
        return this._debugContainer;
    }
}
