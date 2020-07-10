import shortId from 'shortid';
import Vector2 from './Vector2';

class Player {
    id: string;
    name: string;
    position: Vector2;

    constructor() {
        this.name = '';
        this.id = shortId.generate();
        this.position = new Vector2();
    }
}

export default Player;