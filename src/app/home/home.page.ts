import { Component } from '@angular/core';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { DeviceFeedback } from '@ionic-native/device-feedback/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  {

  percent = 0;
  radius = 100;
  fullTime: any = '00:01:30';
  timer: any = false;
  progress: any = 0;
  minutes = 1;
  seconds: any = 30;

  elapsed: any = {
    h: '00', m: '00', s: '00'
  };

  overallTimer: any = false;

  // tslint:disable-next-line: max-line-length
  constructor(private insomnia: Insomnia, private dialogs: Dialogs, private localNotifications: LocalNotifications, private nativeAudio: NativeAudio, private deviceFeedback: DeviceFeedback) { }

  // click on svg graphic starts this timer function
  startTimer() {
    // preload music
    this.nativeAudio.preloadSimple('click', 'assets/music/old-fashioned-school-bell-daniel_simon.mp3');

    // enable haptic feedback
    this.deviceFeedback.haptic(1);

    // clear interval everytime it is clicked preventing the app going crazy on multiple clicks hehe!
    if (this.timer) {
      clearInterval(this.timer);
    }

        // overall timer display function
    if (!this.overallTimer) {
      this.progressTimer();

      // enable insomnia
      this.insomnia.keepAwake()
        .then(
          () => console.log('success'),
          () => console.log('error')
        );
    }

    // resets timer on each click
    this.timer = false;
    this.percent = 0;
    this.progress = 0;

    const timeSplit = this.fullTime.split(':');
    this.minutes = timeSplit[1];
    this.seconds = timeSplit[2];

    // parseInt allows to be seen as an integer
    // tslint:disable-next-line: radix
    const totalSeconds = Math.floor(this.minutes * 60) + parseInt(this.seconds);

    this.timer = setInterval(() => {

      if (this.percent === this.radius) {
        clearInterval(this.timer);
        this.dialogs.alert('Rest Complete')
          .then(() => console.log('Dialog dismissed'))
          .catch(e => console.log('Error displaying dialog', e));
        // this.dialogs.beep(1);
        // Schedule a single notification
        this.localNotifications.schedule({
          id: 1,
          title: 'Rest Complete',
          icon: 'assets/icon/clock',
          // sound: isAndroid ? 'file://sound.mp3' : 'file://beep.caf',
          text:  'you have completed your rest',
          foreground: true,
          actions: [
            { id: 'yes', title: 'Okay' }
        ]
        });
         // start music
        this.nativeAudio.play('click');
        console.log('Rest complete');
      } else if (this.percent === 50) {
        this.dialogs.alert('Half way there')
          .then(() => console.log('Dialog dismissed'))
          .catch(e => console.log('Error displaying dialog', e));
        this.dialogs.beep(1);
        // Schedule a single notification
       /* this.localNotifications.schedule({
          id: 1,
          title: 'Half way there',
          // sound: isAndroid ? 'file://sound.mp3' : 'file://beep.caf',
          text:  'you have completed half your rest',
          foreground: true,
          actions: [
            { id: 'yes', title: 'Okay' }
        ]
        });*/
        console.log('Half way there');
      }

      this.percent = Math.floor((this.progress / totalSeconds) * 100);
      this.progress++;
    }, 1000);
  }

  progressTimer() {
    const countDownDate = new Date();

    this.overallTimer = setInterval(() => {
      const now = new Date().getTime();
      const distance = now - countDownDate.getTime();

      this.elapsed.h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.elapsed.m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.elapsed.s = Math.floor((distance % (1000 * 60)) / 1000);

      this.elapsed.h = this.pad(this.elapsed.h, 2);
      this.elapsed.m = this.pad(this.elapsed.m, 2);
      this.elapsed.s = this.pad(this.elapsed.s, 2);
    }, 1000);
  }

  pad(num, size) {
    let s = num + '';
    while (s.length < size) { s = '0' + s; }
    return s;
  }

  stopTimer() {
    clearInterval(this.timer);
    clearInterval(this.overallTimer);
    this.overallTimer = false;
    this.timer = false;
    this.percent = 0;
    this.progress = 0;
    this.elapsed = {
      h: '00', m: '00', s: '00'
    };

    // disable insomnia
    this.insomnia.allowSleepAgain()
      .then(
        () => console.log('success'),
        () => console.log('error')
      );

      // enable haptic feedback
    this.deviceFeedback.haptic(0);

      // stop music
    this.nativeAudio.stop('click');
    this.nativeAudio.unload('click');
  }

}
