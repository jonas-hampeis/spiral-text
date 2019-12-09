import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {Letter} from './letter'

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
  ngOnInit() {
    this.initVarValues();
  }
  ngAfterViewInit() {
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    
    this.drawText(this.rText, this.fontFa, this.screenSize());
  }

  rText = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Mauris elementum mauris vitae tortor. In laoreet, magna id viverra tincidunt, sem odio bibendum justo, vel imperdiet sapien wisi sed libero. Aliquam ornare wisi eu metus. Fusce tellus. Phasellus rhoncus.';
  fontSz: number;
  fontFa = "Courier New";
  ctxSize: number;

  initVarValues(){
    if(window.screen.height < window.screen.width){
      //Computer screen
      this.ctxSize = window.screen.height -120;
      this.fontSz = 35;
    } else{
      //phone screen
      this.ctxSize = window.screen.width -20;
      this.fontSz = 20;
    }
  }

  screenSize(){
    if(window.screen.height < window.screen.width){
      var ctxSize = window.screen.height -120;
    } else{
      var ctxSize = window.screen.width -20;
    }

    return ctxSize;
  }

  dataChanged($event: any) {
    this.drawText(this.rText, this.fontFa, this.ctxSize);
  }

  public drawText(tex: string, fontFam: string, canvasSz: number) {

    if(tex == "") {
      tex = "Please write something.";
    }
    if(this.fontFa == "") {
     fontFam = "Courier New";
    }

    let ctx = this.context; 
    ctx.canvas.width  = canvasSz;
    ctx.canvas.height = canvasSz;
    ctx.save();

    const x = (this.canvasEl.nativeElement as HTMLCanvasElement).width / 2;
    const y = (this.canvasEl.nativeElement as HTMLCanvasElement).height / 2;

    ctx.clearRect(0, 0, 2*x, 2*y);

    ctx.translate(x,y);

    let rIter = this.fontSz;

    ctx.font = rIter + 'px ' + fontFam;
    ctx.lineWidth = 2;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    let inc = rIter / 2;
    let move = false;
    let r = rIter;


    let text: Letter[] = [];

    let angle = -Math.PI - (Math.asin(rIter/(2*rIter)));

    for(var i = 0; i < tex.length; ++i){
      
      if(tex[i-1]) {
        var cWidth = ( ctx.measureText(tex[i]).width / 2 ) + ( ctx.measureText(tex[i-1]).width / 2 );
      } else {
        var cWidth = ctx.measureText(tex[i]).width; 
      }

      angle += 2 * (Math.asin(cWidth/(2*rIter)));
      
      let cy = rIter * Math.sin(angle) - Math.PI/2;

      if(text[i-1]) {
        if(cy >= 0 && text[i-1].y <= 0) {
          rIter = rIter + inc;
          move = true;
        }else if (cy < 0 && text[i-1].y > 0){
          rIter = rIter + inc;
          move = false;
        }
      }

      let cx = rIter * Math.cos(angle) - Math.PI/2;

      text.push(new Letter(tex[i], cx, cy, angle, move));
      
      //console log for viewing the positions of the letters
      // console.log(text[i].name + ": \n" + 
      //             "Width: " + cWidth + 
      //             "\nx: " + text[i].x  +
      //             "\ny: " + text[i].y  +
      //             "\nangle: " + text[i].angle);



      if(text[i].move){
        text[i].x -= r/2;
      }

    }


    //drawing function
    text.forEach(function(i){
      ctx.save();
      
      ctx.translate(i.x, i.y )
      ctx.rotate(i.angle + Math.PI/2);
      ctx.fillText(i.name, 0, 0 );

      ctx.restore();
    });

    //restores the canvas so it doesn't get offset after redrawing
    ctx.restore();
  }
}