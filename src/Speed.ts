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

export enum Speeds {
    Paused,
    Normal,
    Fast,
}

/**
 * Houses static utility classes for dealing with game speed.
 */
export class SpeedUtil {
    /**
     * Determines how much real-world time should be multiplied based on the given Speed.
     *
     * @param speed
     */
    static getMultiplier(speed: Speeds): Speeds {
        switch (speed) {
            // "Fast" Speed means 5x real-world speed
            case Speeds.Fast:
                return 5;
            // Normal means 1x, and Paused means 0 (i.e. multiply by 0 for no advancement)
            default:
                return speed;
        }
    }
}
