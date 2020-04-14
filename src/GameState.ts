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

import Game, { GameEvents } from './Game';
import { Speeds, SpeedUtil } from './Speed';
import TravelTrip from './TravelTrip';

export enum GameStateEvents {
    MoneyChanged = 'game-state.money',
    TimeChanged = 'game-state.time',
    SpeedChanged = 'game-state.speed',
}

/**
 * Represents the properties of the game as they exist right now.
 * When deciding what belongs here, consider that this should represent what would go into a hypothetical "save file".
 */
export default class GameState {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly STARTING_MONEY = 1000000;
    public static readonly GAME_DAYS_IN_MILLISECONDS = 2000;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _game: Game;
    private _money: number;
    // The real-life milliseconds that have elapsed in the game, as scaled by the speed
    private _time: number;
    private _speed: number;
    private _lastSimulationTickTime: number;
    private _travelTrips: Set<TravelTrip>;

    constructor(game: Game) {
        this._game = game;
        this._money = GameState.STARTING_MONEY;
        this._time = 0;
        this._speed = Speeds.Paused;
        this._lastSimulationTickTime = 0;
        this._travelTrips = new Set<TravelTrip>();

        // Listen for events that should update the state
        this._game.eventEmitter.on(GameEvents.MoneyDeducted, (args) => this.onMoneyUpdated(args));
        this._game.eventEmitter.on(GameEvents.TimeIncreased, (args) => this.onTimeIncreased(args));
        this._game.eventEmitter.on(GameEvents.SpeedSet, (args) => this.onSpeedSet(args));
    }

    onMoneyUpdated(amount: number): void {
        this._money += amount;
        this._game.eventEmitter.emit(GameStateEvents.MoneyChanged, this._money);
    }

    onTimeIncreased(milliseconds: number): void {
        // We scale the real-life milliseconds based on the current game speed, then set that as the game time
        this._time += milliseconds * SpeedUtil.getMultiplier(this._speed);
        // If the game day has now increased since the last increase
        // FIXME: What happens if more than 1 game day passed in between ticks?
        if (this._time - this._lastSimulationTickTime > GameState.GAME_DAYS_IN_MILLISECONDS) {
            // Set the "last simulation tick time" to now
            this._lastSimulationTickTime = this._time;
            // Run the simulator
            this._game.simulator.simulate();
        }
        this._game.eventEmitter.emit(GameStateEvents.TimeChanged, this._time);
    }

    onSpeedSet(speed: number): void {
        this._speed = speed;
        this._game.eventEmitter.emit(GameStateEvents.SpeedChanged, this._speed);
    }

    /**
     * Converts the game time from milliseconds to days.
     *
     * @param gameTimeInMilliseconds
     */
    static calculateGameTimeInDays(gameTimeInMilliseconds): number {
        return gameTimeInMilliseconds / GameState.GAME_DAYS_IN_MILLISECONDS;
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get money(): number {
        return this._money;
    }

    set money(value) {
        this._money = value;
    }

    get time(): number {
        return this._time;
    }

    set time(value) {
        this._time = value;
    }

    get speed(): number {
        return this._speed;
    }

    set speed(value: number) {
        this._speed = value;
    }

    get travelTrips(): Set<TravelTrip> {
        return this._travelTrips;
    }

    set travelTrips(value: Set<TravelTrip>) {
        this._travelTrips = value;
    }
}
