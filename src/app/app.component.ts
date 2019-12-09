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
    //initialize size of canvas and font
    this.initVarValues();
  }
  ngAfterViewInit() {
    //first draw of spiral
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    this.drawText(this.rText, this.fontFa, this.screenSize());
  }

  //init the basic variables which can be modified
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

  //this could be probably merged with the above function
  screenSize(){
    if(window.screen.height < window.screen.width){
      var ctxSize = window.screen.height -120;
    } else{
      var ctxSize = window.screen.width -20;
    }
    return ctxSize;
  }

  //redraw the spiral each time settings are modified
  dataChanged($event: any) {
    this.drawText(this.rText, this.fontFa, this.ctxSize);
  }

  public drawText(tex: string, fontFam: string, canvasSz: number) {

    //edge cases
    if(tex == "") {
      tex = "Please write something.";
    }
    if(this.fontFa == "") {
     fontFam = "Courier New";
    }

    //preparation of the canvas
    let ctx = this.context; 
    ctx.canvas.width  = canvasSz;
    ctx.canvas.height = canvasSz;
    ctx.save();

    const x = (this.canvasEl.nativeElement as HTMLCanvasElement).width / 2;
    const y = (this.canvasEl.nativeElement as HTMLCanvasElement).height / 2;

    ctx.clearRect(0, 0, 2*x, 2*y);

    ctx.translate(x,y);

    //the iterative radius has the same value as the font
    let rIter = this.fontSz;

    //settings of the text
    ctx.font = rIter + 'px ' + fontFam;
    ctx.lineWidth = 2;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    //the text gets written on an archimedean spiral
    //so it is basically two sets of half circles
    //one of which is offset
    //the ofsetting is done with the move var
    let inc = rIter / 2;
    let move = false;
    let r = rIter;

    //init the array of letters
    let text: Letter[] = [];

    //calculate the angle, which is used both for the position and the
    //rotation of the letter and is iterated for each letter
    let angle = -Math.PI - (Math.asin(rIter/(2*rIter)));

    //cycle goes through the letters of the given text
    //and calculates their position and rotation
    for(var i = 0; i < tex.length; ++i){
      
      //calculates how far the letter should be from the previous letter
      //if there is one
      if(tex[i-1]) {
        var cWidth = ( ctx.measureText(tex[i]).width / 2 ) + ( ctx.measureText(tex[i-1]).width / 2 );
      } else {
        var cWidth = ctx.measureText(tex[i]).width; 
      }

      //iterates the angle
      angle += 2 * (Math.asin(cWidth/(2*rIter)));
      
      //calculates the y coordinate of the letter
      //using the iterative radius and angle
      let cy = rIter * Math.sin(angle) - Math.PI/2;

      //checks if the letter is on the edge of a half circle
      //and if it is, then it switches to a different circle
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

  //function for downloading picture
  downloadCanvas(){
    let img = (this.canvasEl.nativeElement as HTMLCanvasElement).toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "spiral-text.png";
    link.href = img;
    link.click();
  }
}