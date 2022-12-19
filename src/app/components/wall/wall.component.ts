import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UseService } from 'src/app/service';

interface Song{
  _id: string,
  title:string,
  imgUrl:string,
  songPath: string,
  contacts: string,
  genre: string,
}

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.css']
})

export class WallComponent implements OnInit {

  count:number = 0
  songs!:[Song]
  serverErrors: any;
  filteredSongs!:[Song]
  isUserLog: string|null = window.localStorage.getItem('user')
  
  constructor(
    private useService: UseService, 
    private fb:FormBuilder, 
    private route: Router,
  ) { }

  ngOnInit(): void {

    this.useService.getData("/songs", {'x-authorization': window.localStorage['user']}).subscribe(
      {
        next:(res) => {
          console.log(res)
          this.songs = res
        }, 
        error: (err) => {
          console.log(err.error.msg)
          this.serverErrors = err.error.msg.split(',')
        }, 
      }
    )
  }
  ngDoCheck(): void {
    this.songs = this.filteredSongs?this.filteredSongs:this.songs
    this.isUserLog = window.localStorage.getItem('user')
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

  takeSelecValue(selectIn:HTMLSelectElement){
    const value = selectIn.value
    console.log(value)

    this.useService.getData(`/songs/filter?genre=${value}`, {'x-authorization': window.localStorage['user']}).subscribe(
      {
        next:(res) => {
          console.log(res)
          this.filteredSongs = res
        }, 
        error: (err) => {
          console.log(err.error.msg)
          this.serverErrors = err.error.msg.split(',')
        }, 
      }
    )

  }

}
