export enum Speeds {
    Paused,
    Normal,
    Fast,
}

export class SpeedUtil {
    static getMultiplier(speed: Speeds): Speeds {
        switch (speed) {
            case Speeds.Fast:
                return 5;
            default:
                return speed;
        }
    }
}
