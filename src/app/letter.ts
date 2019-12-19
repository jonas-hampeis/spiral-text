export class Letter {
        name: string;
        x: number;
        y: number;
        angle: number;
        move: boolean;
        public constructor(name: string, x: number, y: number, angle:number, move: boolean) {
          this.x = x;
          this.y = y;
          this.name = name;
          this.angle = angle;
          this.move = move;
        } 
}
