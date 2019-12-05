import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.less' ]
})
export class AppComponent implements AfterViewInit {
  title = 'Spiral text';
  @ViewChild('canvasEl', {static: false}) canvasEl: ElementRef;
  private context: CanvasRenderingContext2D;
  constructor() {}
  ngAfterViewInit() {
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    this.drawText(this.rText);
  }

  rText = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Mauris elementum mauris vitae tortor. In laoreet, magna id viverra tincidunt, sem odio bibendum justo, vel imperdiet sapien wisi sed libero. Aliquam ornare wisi eu metus. Fusce tellus. Phasellus rhoncus.';

   getCurrentModel() { 
    //this.drawText(this.rText);
    return JSON.stringify(this.rText); 
   }

  dataChanged($event: any) {
    this.drawText(this.rText);
  }

  public drawText(tex: string) {

    let ctx = this.context; 
    ctx.canvas.width  = window.innerHeight -20;
    ctx.canvas.height = window.innerHeight -20;
    ctx.save();

    const x = (this.canvasEl.nativeElement as HTMLCanvasElement).width / 2;
    const y = (this.canvasEl.nativeElement as HTMLCanvasElement).height / 2;

    ctx.clearRect(0, 0, 2*x, 2*y);

    ctx.translate(x,y);

    let rIter = 35;

    ctx.font = rIter + 'px ' + 'Courier New';
    ctx.lineWidth = 2;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    let inc = rIter / 2;
    let move = false;
    let r = rIter;
    let cor = 0;


    let text: Letter[] = [];

    let angle = -Math.PI
    text[0] = new Letter(tex[0], -rIter, 0, angle, false);

    for(var i = 1; i < tex.length; ++i){
      
      let cWidth = ctx.measureText(tex[i]).width;
      angle += 2 * (Math.asin(cWidth/(2*rIter)));
      angle += cor;
      cor = 0;
      
      let cy = rIter * Math.sin(angle) - Math.PI/2;

      if(cy > 0 && text[i-1].y < 0) {
        rIter = rIter + inc;
        move = true;
      }else if (cy < 0 && text[i-1].y > 0){
        rIter = rIter + inc;
        move = false;
      }

      let cx = rIter * Math.cos(angle) - Math.PI/2;

      text.push(new Letter(tex[i], cx, cy, angle, move));
      
      console.log(text[i].name + ": \n" + 
                  "Width: " + cWidth + 
                  "\nx: " + text[i].x  +
                  "\ny: " + text[i].y  +
                  "\nangle: " + text[i].angle);



      if(text[i].move){
        text[i].x -= r/2;
      }

    }


    for(let i = 0; i < text.length; ++i){
      ctx.save();
      
      ctx.translate(text[i].x, text[i].y )
      ctx.rotate(text[i].angle + Math.PI/2);
      ctx.fillText(text[i].name, 0, 0 );

      ctx.restore();
    }
    ctx.restore();
  }
}

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
