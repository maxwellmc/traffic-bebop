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

import ViewableObject from './ViewableObject';
import Grid from './Grid';
import Cell, { StructureTypes, TerrainTypes, ZoneTypes } from './Cell';
import { Container, LoaderResource, Sprite, Text } from 'pixi.js';
import Game from './Game';
import { TileGraphicLayer } from './TileGraphic';

export enum TerrainSpriteFiles {
    Grass = 'grass.png',
}

export enum ZoneSpriteFiles {
    Residential = 'zone-r.png',
    Commercial = 'zone-c.png',
}

export enum StructureSpriteFiles {
    HouseStyle1 = 'house1.png',
    BusinessStyle1 = 'business1.png',
    RoadMiddle = 'road-m.png',
    RoadX = 'road-x.png',
    RoadXLeft = 'road-xl.png',
    RoadXRight = 'road-xr.png',
    RoadY = 'road-y.png',
    RoadYBottom = 'road-yb.png',
    RoadYTop = 'road-yt.png',
    RoadBottomLeft = 'road-bl.png',
    RoadBottomRight = 'road-br.png',
    RoadTopLeft = 'road-tl.png',
    RoadTopRight = 'road-tr.png',
    RoadIntersectLeft = 'road-il.png',
    RoadIntersectRight = 'road-ir.png',
    RoadIntersectBottom = 'road-ib.png',
    RoadIntersectTop = 'road-it.png',
    RoadIntersectMiddle = 'road-im.png',
}

export enum MiscSpriteFiles {
    Blank = '',
    Grid = 'grid.png',
    Drag = 'drag.png',
    Vehicle = 'vehicle.png',
}

/**
 * A cell within the world.
 */
export default class Tile extends ViewableObject {
    /* Constants ---------------------------------------------------------------------------------------------------- */

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

        // Initialize the layers of Sprites in the Container to graphically represent the Tile
        this._container.addChild(new Sprite());
        this._container.addChild(new Sprite());
        this._container.addChild(new Sprite());
        this._container.addChild(new Sprite());
        this._container.addChild(new Sprite());
        // Initialize the layers, which keep track of which Sprite is currently present in each layer
        this._layers
            .set(TileGraphicLayer.Terrain, MiscSpriteFiles.Blank)
            .set(TileGraphicLayer.Zone, MiscSpriteFiles.Blank)
            .set(TileGraphicLayer.Structure, MiscSpriteFiles.Blank)
            .set(TileGraphicLayer.Grid, MiscSpriteFiles.Blank)
            .set(TileGraphicLayer.Highlight, MiscSpriteFiles.Blank);

        // Initialize the Container
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
        // Set the "Terrain" layer
        if (this._cell.terrainType === TerrainTypes.Grass) {
            if (this._layers.get(TileGraphicLayer.Terrain) !== TerrainSpriteFiles.Grass) {
                this.setLayerSprite(TileGraphicLayer.Terrain, TerrainSpriteFiles.Grass);
            }
        }

        // Set the "Zone" layer
        if (this._cell.structureType === StructureTypes.Empty) {
            if (this._cell.zoneType === ZoneTypes.Residential) {
                if (this._layers.get(TileGraphicLayer.Zone) !== ZoneSpriteFiles.Residential) {
                    this.setLayerSprite(TileGraphicLayer.Zone, ZoneSpriteFiles.Residential);
                }
            } else if (this._cell.zoneType === ZoneTypes.Commercial) {
                if (this._layers.get(TileGraphicLayer.Zone) !== ZoneSpriteFiles.Commercial) {
                    this.setLayerSprite(TileGraphicLayer.Zone, ZoneSpriteFiles.Commercial);
                }
            }
        }

        // Set the "Structure" layer
        if (this._cell.structureType === StructureTypes.Road) {
            const roadFilename = this.determineRoadOrientation();
            if (this._layers.get(TileGraphicLayer.Structure) !== roadFilename) {
                this.setLayerSprite(TileGraphicLayer.Structure, roadFilename);
            }
        } else if (this._cell.structureType === StructureTypes.House) {
            if (this._layers.get(TileGraphicLayer.Structure) !== StructureSpriteFiles.HouseStyle1) {
                this.setLayerSprite(TileGraphicLayer.Structure, StructureSpriteFiles.HouseStyle1);
            }
        } else if (this._cell.structureType === StructureTypes.Business) {
            if (this._layers.get(TileGraphicLayer.Structure) !== StructureSpriteFiles.BusinessStyle1) {
                this.setLayerSprite(TileGraphicLayer.Structure, StructureSpriteFiles.BusinessStyle1);
            }
        } else {
            if (this._layers.get(TileGraphicLayer.Structure) !== MiscSpriteFiles.Blank) {
                this.setLayerSprite(TileGraphicLayer.Structure, MiscSpriteFiles.Blank);
            }
        }

        // Set the "Grid" layer
        if (this._layers.get(TileGraphicLayer.Grid) !== MiscSpriteFiles.Grid) {
            this.setLayerSprite(TileGraphicLayer.Grid, MiscSpriteFiles.Grid);
        }

        // Set the "Highlight" layer
        // If this tile is currently part of a cursor-drag event, then add an overlay to the "Highlight" layer
        if (this._grid.isTileInDrag(this)) {
            if (this._layers.get(TileGraphicLayer.Highlight) !== MiscSpriteFiles.Drag) {
                this.setLayerSprite(TileGraphicLayer.Highlight, MiscSpriteFiles.Drag);
            }
        }else if(this._cell.vehicle){
            // This Cell has a vehicle on it
            if (this._layers.get(TileGraphicLayer.Highlight) !== MiscSpriteFiles.Vehicle) {
                this.setLayerSprite(TileGraphicLayer.Highlight, MiscSpriteFiles.Vehicle);
            }
        } else {
            if (this._layers.get(TileGraphicLayer.Highlight) !== MiscSpriteFiles.Blank) {
                this.setLayerSprite(TileGraphicLayer.Highlight, MiscSpriteFiles.Blank);
            }
        }

        const debugText = this._debugContainer.getChildAt(0) as Text;
        // If the debug flag is set, then show the Cell's ID
        if (this._grid.game.debug) {
            debugText.text = String(this._cell.id);
        } else {
            debugText.text = '';
        }
    }

    /**
     * Convenience function for changing both the texture of the Sprite in a layer, and the actual layer Map for future reference.
     *
     * @param layer
     * @param spriteFile
     */
    setLayerSprite(layer: TileGraphicLayer, spriteFile: string): void {
        const sprite = this._container.getChildAt(layer) as Sprite;
        sprite.texture = this._spritesheet.textures[spriteFile];
        this._layers.set(layer, spriteFile);
    }

    /**
     * Determines which road Sprite should be used, based on how many of the underlying Cell's neighbors are also roads.
     */
    determineRoadOrientation(): string {
        const bottomIsRoad = this._cell.doesBottomNeighborHaveStructure(StructureTypes.Road),
            topIsRoad = this._cell.doesTopNeighborHaveStructure(StructureTypes.Road),
            leftIsRoad = this._cell.doesLeftNeighborHaveStructure(StructureTypes.Road),
            rightIsRoad = this._cell.doesRightNeighborHaveStructure(StructureTypes.Road);

        // If the cell to the left of us is a road
        if (leftIsRoad) {
            // If the cells to the left and top are roads
            if (topIsRoad) {
                // If the cells to the left, top, and bottom are roads
                if (bottomIsRoad) {
                    // If the cells to the left, top, bottom, and right are roads
                    if (rightIsRoad) {
                        // We need the "intersection-middle" sprite
                        return StructureSpriteFiles.RoadIntersectMiddle;
                    }
                    // We need the "intersection-right" sprite
                    return StructureSpriteFiles.RoadIntersectRight;
                }
                // If the cells to the left, top, and right are roads
                if (rightIsRoad) {
                    // We need the "intersection-bottom" sprite
                    return StructureSpriteFiles.RoadIntersectBottom;
                }
                // We need the "bottom-right" sprite
                return StructureSpriteFiles.RoadBottomRight;
            }
            // If the cells to the left and bottom are roads
            if (bottomIsRoad) {
                // If the cells to the left, bottom, and right are roads
                if (rightIsRoad) {
                    // We need the "intersection-top" sprite
                    return StructureSpriteFiles.RoadIntersectTop;
                }
                // We need the "top-right" sprite
                return StructureSpriteFiles.RoadTopRight;
            }
            // If the cells to the left and right are roads
            if (rightIsRoad) {
                // We just need the horizontal sprite
                return StructureSpriteFiles.RoadX;
            }
            // We need the "horizontal right" sprite
            return StructureSpriteFiles.RoadXRight;
        }

        // If the cell to the right of us is a road
        if (rightIsRoad) {
            // If the cells to the right and top are roads
            if (topIsRoad) {
                // If the cells to the right, top, and bottom are roads
                if (bottomIsRoad) {
                    // We need the "intersection-left" sprite
                    return StructureSpriteFiles.RoadIntersectLeft;
                }
                // We need the "bottom-left" sprite
                return StructureSpriteFiles.RoadBottomLeft;
            }
            // If the cells to the right and bottom are roads
            if (bottomIsRoad) {
                // We need the "top-right" sprite
                return StructureSpriteFiles.RoadTopLeft;
            }
            // We need the "horizontal left" sprite
            return StructureSpriteFiles.RoadXLeft;
        }

        if (topIsRoad) {
            if (bottomIsRoad) {
                // We just need the vertical sprite
                return StructureSpriteFiles.RoadY;
            }
            // We need the "vertical bottom" sprite
            return StructureSpriteFiles.RoadYBottom;
        }
        if (bottomIsRoad) {
            // We need the "vertical top" sprite
            return StructureSpriteFiles.RoadYTop;
        }

        // No neighboring roads
        return StructureSpriteFiles.RoadMiddle;
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
