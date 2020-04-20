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

import HUDItem from './HUDItem';
import { Graphics } from 'pixi.js';
import Game from '../../Game';
import GameState, { GameStateEvents } from '../../GameState';
import { Speeds } from '../../Speed';
import AbstractSingleGraphicObject from '../../AbstractSingleGraphicObject';

/**
 * The heads-up display to show the game state to the user.
 */
export default class HUD extends AbstractSingleGraphicObject {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly HEIGHT = 48;
    public static readonly FILL_COLOR = 0x2f89fc;
    public static readonly Y_OFFSET = 8;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _game: Game;
    private _items: HUDItem[];
    private _gameState: GameState;
    private _startingX: number;
    private _startingY: number;

    constructor(game: Game, gameState: GameState) {
        super();

        this._game = game;
        this._gameState = gameState;
        this._startingX = 0;
        this._startingY = 0;

        // Initialize the list of HUDItems
        this._items = [new HUDItem('Money', ''), new HUDItem('Days', ''), new HUDItem('Speed', '')];

        // Initialize the HUDItem values
        this.setMoney(this._gameState.money);
        this.setTime(this._gameState.time);
        this.setSpeed(this._gameState.speed);

        this.generateGraphics();

        this.setGraphicsPositioning();

        // Update the money graphic when it changes
        this._game.eventEmitter.on(GameStateEvents.MoneyChanged, (args) => this.onMoneyChanged(args));

        // Update the game time graphic when it changes
        this._game.eventEmitter.on(GameStateEvents.TimeChanged, (args) => this.onTimeChanged(args));

        // Update the speed graphic when it changes
        this._game.eventEmitter.on(GameStateEvents.SpeedChanged, (args) => this.onSpeedChanged(args));
    }

    generateGraphics(): void {

        this._startingY = this._game.renderer.screen.height - HUD.HEIGHT + HUD.Y_OFFSET;

        // Rectangle
        const rectangle = new Graphics();
        rectangle.beginFill(HUD.FILL_COLOR);
        rectangle.drawRect(this._startingX, this._startingY, this._game.renderer.screen.width, HUD.HEIGHT);
        rectangle.endFill();

        this.graphic = rectangle;
    }

    setGraphicsPositioning(): void {
        let x = this._startingX + 30;
        const y = this._startingY + 10;

        for (let i = 0; i < this._items.length; i++) {
            const hudItem = this._items[i];
            hudItem.changeX(x + 70 * i);
            hudItem.changeY(y);
            x += HUDItem.WIDTH;
        }
    }

    onMoneyChanged(amount: number): void {
        this.setMoney(amount);
    }

    onTimeChanged(milliseconds: number): void {
        this.setTime(milliseconds);
    }

    onSpeedChanged(speed): void {
        this.setSpeed(speed);
    }

    /**
     * Formats money from a number to a currency-formatted string, and sets it in the HUDItem.
     *
     * @param amount
     */
    setMoney(amount: number): void {
        // Add thousands separators
        const money = '$' + amount.toLocaleString('en-US');
        this._items[0].value = money;
    }

    /**
     * Converts the milliseconds to game days, rounds them, converts it to a string, and sets it in the HUDItem.
     *
     * @param milliseconds
     */
    setTime(milliseconds: number): void {
        this._items[1].value = String(Math.round(GameState.calculateGameTimeInDays(milliseconds)));
    }

    /**
     * Looks up the label for the speed in the enum, and sets it in the HUDItem.
     *
     * @param speed
     */
    setSpeed(speed): void {
        this._items[2].value = Speeds[speed];
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get game(): Game {
        return this._game;
    }

    get items(): HUDItem[] {
        return this._items;
    }
}
