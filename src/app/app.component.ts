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

    ctx.fillRect(0,0,3,3);

    ctx.font = 50 + 'px ' + 'Arial';
    ctx.lineWidth = 2;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    let rIter = 50;
    let inc = rIter / 2;
    let move = false;

    var rText = 'Rotation goes around and around and around';

    let text: Letter[] = [];

    let cWidth = ctx.measureText(rText[i]).width;
    let angle = -Math.PI
    text[0] = new Letter(rText[0], -50, 0, angle, angle, cWidth, false);

    for(var i = 1; i < rText.length; ++i){
      
      let cWidth = ctx.measureText(rText[i]).width;

      angle += 2 * (Math.asin(cWidth/(2*rIter)));
      
      let cy = rIter * Math.sin(angle) - Math.PI/2;

      if(cy > 0 && text[i-1].y < 0) {
        rIter = rIter + inc;
        move = true;
      }else if (cy < 0 && text[i-1].y > 0){
        rIter = rIter + inc;
        move = false;
      }

      let cx = rIter * Math.cos(angle) - Math.PI/2;

      text.push(new Letter(rText[i], cx, cy, angle, 0, cWidth, move));
      
      console.log(text[i].name + ": \n" + 
                  "Width: " + text[i].width + 
                  "\nx: " + text[i].x  +
                  "\ny: " + text[i].y  +
                  "\nangle: " + text[i].angle  +
                  "\nrotation: " + text[i].rot );

    }
    

    let r = 50;

    for(let i = 0; i < text.length; ++i){

      if(text[i].move){
        text[i].x -= r/2;
      }
      //ctx.rotate(text[i].rot + Math.PI/2);
      ctx.fillText(text[i].name, text[i].x, text[i].y );

    }
    ctx.save();

    //ctx.rotate(text[0].rot + Math.PI/2);
    ctx.fillText(text[0].name, text[0].x, text[0].y );

    ctx.restore();
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
  rot: number;
  width: number;
  move: boolean;
  public constructor(name: string, x: number, y: number, angle:number, rot: number, width: number, move: boolean) {
    this.x = x;
    this.y = y;
    this.rot = angle;
    this.name = name;
    this.width = width;
    this.angle = angle;
    this.move = move;
  } 
}
