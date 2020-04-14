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
