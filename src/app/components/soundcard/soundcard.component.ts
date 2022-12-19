import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-soundcard',
  templateUrl: './soundcard.component.html',
  styleUrls: ['./soundcard.component.css']
})
export class SoundcardComponent implements OnInit {

  count:number = 0
  
  constructor() { }

  ngOnInit(): void {
  }

  playPauseSound(sound:HTMLAudioElement, playButton:HTMLButtonElement){
    console.log(sound)
    if (this.count == 0){
      this.count = 1
      sound.play()
      playButton.innerHTML= 'Pause'
    }
    else {
      this.count = 0
      sound.pause()
      playButton.innerHTML= 'Play'
    }
  }

  stopSound(sound:HTMLAudioElement, playButton:HTMLButtonElement){
    this.count = 0
    sound.pause()
    sound.currentTime = 0
    playButton.innerHTML= 'Play'
  }

}
