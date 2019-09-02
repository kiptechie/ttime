import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  percent:number = 0;
  radius:number = 100;
  fullTime:any = '00:01:30';
  timer:any = false;
  progress:any = 0;
  minutes:number = 1;
  seconds:any = 30;

  constructor() {}

  startTimer() {

    // resets timer on each click
    this.timer = false;
    this.percent = 0;
    this.progress = 0;

    let timeSplit = this.fullTime.split(':');
    this.minutes = timeSplit[1];
    this.seconds = timeSplit[2];

    // parseInt allows to be seen as an integer
    let totalSeconds = Math.floor(this.minutes * 60) + parseInt(this.seconds);

    this.timer = setInterval(() => {

      if (this.percent == this.radius)
        clearInterval(this.timer);

      this.percent = Math.floor((this.progress / totalSeconds) * 100);
      this.progress++; 
    }, 1000)
    
  }

}
