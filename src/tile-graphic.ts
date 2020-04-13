import { DisplayObject } from 'pixi.js';

export enum TileGraphicLayer {
    'Terrain',
    'Zone',
    'Structure',
    'Grid',
    'Highlight',
}

export default class TileGraphic extends DisplayObject {
    private _layer: TileGraphicLayer;

    constructor(layer) {
        super();
        this._layer = layer;
    }

    get layer(): TileGraphicLayer {
        return this._layer;
    }

    set layer(value) {
        this._layer = value;
    }
}
