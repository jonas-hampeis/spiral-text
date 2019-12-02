import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { sanitizeIdentifier } from '@angular/compiler';

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
  
    let roti = -0.25;
    //this.drawSpiral();
    this.drawText();
  }

  private drawText() {

    let ctx = this.context; 

    const x = (this.canvasEl.nativeElement as HTMLCanvasElement).width / 2;
    const y = (this.canvasEl.nativeElement as HTMLCanvasElement).height / 2;

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

    var rText = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Mauris elementum mauris vitae tortor. In laoreet, magna id viverra tincidunt, sem odio bibendum justo, vel imperdiet sapien wisi sed libero. Aliquam ornare wisi eu metus. Fusce tellus. Phasellus rhoncus.';

    let text: Letter[] = [];

    let angle = -Math.PI
    text[0] = new Letter(rText[0], -rIter, 0, angle, false);

    for(var i = 1; i < rText.length; ++i){
      
      let cWidth = ctx.measureText(rText[i]).width;
      angle += 2 * (Math.asin(cWidth/(2*rIter)));
      angle += cor;
      cor = 0;

      // let angset = 0;
      // if(rText[i] === "f" || rText[i] === "r" || rText[i] === "ř"){
      //   angset = 1.5;
      // } else if(rText[i] === "i" || rText[i] === "j" || rText[i] === "l" || rText[i] === "t" || rText[i] === "I" || rText[i] === "í"){
      //   angset = 0;
      // } else if( rText[i] === "w" || rText[i] === "M"){
      //   angset = -2.5
      // } else if(rText[i] === "." || rText[i] === "," || rText[i] === "y"){
      //   angset = 0.5
      // } else if(rText[i] === "m" || rText[i] === "H"){
      //   angset = 0;
      // }
      // angle += Math.PI/(rIter/angset);

      // let corset = 0;
      // if(rText[i] === "f" || rText[i] === "i" || rText[i] === "j" || rText[i] === "I" || rText[i] === "í"){
      //   corset = 0;
      // } else if(rText[i] === "m" || rText[i] === "w"){
      //   corset = +2;
      // } else if(rText[i] === "l"){
      //   corset = 0;
      // } else if(rText[i] === "r" || rText[i] === "t" || rText[i] === "ř"){
      //   corset = 0;
      // } else if(rText[i] === "M" || rText[i] === "H"){
      //   corset = +1.1;
      // }
      // cor = Math.PI/(rIter/corset);
      
      let cy = rIter * Math.sin(angle) - Math.PI/2;

      if(cy > 0 && text[i-1].y < 0) {
        rIter = rIter + inc;
        move = true;
      }else if (cy < 0 && text[i-1].y > 0){
        rIter = rIter + inc;
        move = false;
      }

      let cx = rIter * Math.cos(angle) - Math.PI/2;

      text.push(new Letter(rText[i], cx, cy, angle, move));
      
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
  }

  private drawSpiral() {

    let ctx = this.context; 

    const x = (this.canvasEl.nativeElement as HTMLCanvasElement).width / 2;
    const y = (this.canvasEl.nativeElement as HTMLCanvasElement).height / 2 - 8;

    //setup
    let r = 50;
    let inc = r / 2;
    let size = 8;
    let st;
    let end;
    let move = 0;

    for(let i = 0; i < size; ++i){
      ctx.beginPath();

      let radius = r + (i * inc);
      
      if (i % 2 == 0){
        st = Math.PI;
        end = 2*Math.PI;
      }else{
        st = 0;
        end = Math.PI;
        move = inc;
      }
      
      ctx.arc(x - move, y, radius, st, end);

      ctx.stroke();
      move = 0;
    }


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
