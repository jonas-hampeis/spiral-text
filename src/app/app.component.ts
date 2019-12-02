import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { sanitizeIdentifier } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.less' ]
})
export class AppComponent implements AfterViewInit {
  title = 'Spiral text';
  /** Template reference to the canvas element */
  @ViewChild('canvasEl', {static: false}) canvasEl: ElementRef;
  
  /** Canvas 2d context */
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
    ctx.font = 50 + 'px ' + 'Arial';
    ctx.lineWidth = 2;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const x = (this.canvasEl.nativeElement as HTMLCanvasElement).width / 2;
    const y = (this.canvasEl.nativeElement as HTMLCanvasElement).height / 2;

    let rIter = 50;
    let iter = 1;
    let inc = rIter / 2;
    let move = false;

    var rText = 'Rotation goes around and around and around';

    let text: Letter[] = [];

    let cWidth = ctx.measureText(rText[i]).width;
    let angle = -Math.PI
    text[0] = new Letter(rText[0], -50, 0, angle, 0, cWidth, false);

    for(var i = 1; i < rText.length; ++i){
      
      let cWidth = ctx.measureText(rText[i]).width;

      angle += 2 * (Math.asin(cWidth/(2*rIter)));

      
      let cy = rIter * Math.sin(angle) - Math.PI/2;

      if(cy > 0 && text[i-1].y < 0) {
        rIter = rIter + (iter * inc);
        move = true;
      }else if (cy < 0 && text[i-1].y > 0){
        rIter = rIter + (iter * inc);
        move = false;
      }

      let cx = rIter * Math.cos(angle) - Math.PI/2;

      console.log("iter: " + iter);

      text.push(new Letter(rText[i], cx, cy, angle, 0, cWidth, move));
      
      console.log(text[i].name + ": \n" + 
                  "Width: " + text[i].width + 
                  "\nx: " + text[i].x  +
                  "\ny: " + text[i].y  +
                  "\nangle: " + text[i].angle  +
                  "\nrotation: " + text[i].rot );

    }

    //var piCounter = rotation*Math.PI;
    
    ctx.translate(x,y);

    ctx.fillRect(0,0,3,3);

    let r = 50;
    iter = 1;

    for(let i = 0; i < text.length; ++i){
    ctx.save();

    if(text[i].move){
      text[i].x -= r/2;
    }
    ctx.fillText(text[i].name, text[i].x, text[i].y );

    ctx.restore();
    }

    // for(let i = 1; i < rText.length; ++i){
      
    //   ctx.translate(-10,-40);
    //   ctx.save();

      
    //   if (piCounter >= 0.5*Math.PI) {
    //     rotDim += 0.060;
    //     piCounter = -0.5*Math.PI;
    //   }
    //   piCounter += 0.2*Math.PI;
    //   ctx.rotate( (0.2 - rotDim) * Math.PI);
    //   ctx.fillText(rText[i], 0, 0 );
    //   console.log("pic:" + piCounter);
    //   console.log("rot:" + rotDim);
    //   console.log(rText[i] + " : " + "rotation fin:" + (0.2 - rotDim) * Math.PI);
    //   ctx.restore();
    // }

  }

  private drawSpiral() {
    // this.context.font = "30px Arial";
    // this.context.textBaseline = 'middle';
    // this.context.textAlign = 'center';
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
    this.rot = rot;
    this.name = name;
    this.width = width;
    this.angle = angle;
    this.move = move;
  } 
}
