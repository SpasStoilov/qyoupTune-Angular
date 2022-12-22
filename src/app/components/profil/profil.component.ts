import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, AbstractControl, NgForm} from '@angular/forms'
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

function checkExtentionSong(){
  return (control:AbstractControl) => {

    let result = control.value ? control.value.match(/(.mp3|.wav)$/) : true
    console.log(!result ? {songExtentionError: true} : null)

    return !result ? {songExtentionError: true} : null
  }
}

function checkExtentionImg(){
  return (control:AbstractControl) => {

    let result = control.value ? control.value.match(/(.jpg|.png)$/) : true

    console.log(!result ? {imgExtentionError: true} : null)

    return !result ? {imgExtentionError: true} : null
  }
}

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})

export class ProfilComponent implements OnInit{
  serverErrors=''
  songs:[Song]|[] = []
  count = 0
  songCurentInfo!:Song
  songFileS!:File
  imageFileS!:File

  renderSongForm:boolean = false
  renderEditSongForm:boolean = false
  songIDtoUpdate!:string

  songForm:any = this.fb.group({
      title: '',
      imgUrl: '',
      genre: '',
      contacts: '',
      song: ''
    }
  )

  constructor(
    private useService: UseService, 
    private fb:FormBuilder, 
    private route: Router,
  ){}

  ngOnInit(): void {
    this.useService.getData("/user/songs", {'x-authorization': window.localStorage['user']}).subscribe(
      {
        next:(res) => {
          //console.log(res.songs)
          this.songs = res.songs
        }, 
        error: (err) => {
          //console.log(err.error.msg)
          this.serverErrors = err.error.msg.split(',')
        }, 
        complete: () => this.route.navigate(['/profile'])
      }
    )
  }

  createSongForm(){
    this.renderSongForm = true
    this.renderEditSongForm = false

    //New Validators must be seted before we setting form values!
    this.songForm.get('title').setValidators([Validators.required, Validators.maxLength(200)])
    this.songForm.get('genre').setValidators([Validators.required])
    this.songForm.get('contacts').setValidators([Validators.required, Validators.maxLength(200)])
    this.songForm.get('imgUrl').setValidators([Validators.required, checkExtentionImg()])
    this.songForm.get('song').setValidators([Validators.required, checkExtentionSong()])
    //--------------------------------------------------------------------

    // Setting a values triger validators (we must change them before setting values)!
    this.songForm.setValue({
      title: '',
      genre: '',
      contacts: '',
      imgUrl: '',
      song: ''
    })
    //-------------------------------------------------------------------

  }

  deleteSongForm(){
    this.renderSongForm = false
    this.renderEditSongForm = false
  }

  imgFile(event:any){
    this.imageFileS = <File>event.target.files[0]
  }

  songFile(event:any){
    this.songFileS = <File>event.target.files[0]
  }

  takeData(songForm:NgForm):void{
    if (songForm.valid){
      
      let formData = new FormData()
      formData.append('title', songForm.value.title)
      formData.append('genre', songForm.value.genre)
      formData.append('contacts', songForm.value.contacts)
      formData.append('imgUrl', this.imageFileS, this.imageFileS.name)
      formData.append('song', this.songFileS, this.songFileS.name)
  
      this.useService.postData("/user/create/song", formData, {'x-authorization': window.localStorage['user'], }).subscribe(
        {
          next:(res) => {
            //console.log(res.songs)
            this.songs = res.songs
          }, 
          error: (err) => {
            //console.log(err.error.msg)
            if (err.error.msg.startsWith('jwt expire')){
              window.localStorage['user'] = ''
              this.route.navigate(['/login'])
            } 
            else {
              this.serverErrors = err.error.msg.split(',')
            }
          }, 
          complete: () => window.location.reload()
        }
      )

    }
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

  delteUserCard(id:string){
    //console.log("id to delete:", id)

    this.useService.getData(`/delete?song=${id}`, {'x-authorization': window.localStorage['user']}).subscribe(
      {
        next:(res) => {
          console.log(res)
        }, 
        error: (err) => {
          //console.log(err.error.msg)
          this.serverErrors = err.error.msg.split(',')
        }, 
        complete: () => {
          window.location.reload()
        }
      }
    )
  }

  renderEditUserForm(id:string){
    this.songIDtoUpdate = id
    this.renderSongForm = true
    this.renderEditSongForm = true
    
    this.useService.getData(`/edit?song=${this.songIDtoUpdate}`, {'x-authorization': window.localStorage['user']} ).subscribe(
      {
        next:(res) => {
          //console.log(res)
          this.songCurentInfo = res
          
          //New Validators must seted before we setting form values!
          this.songForm.get('title').setValidators([Validators.maxLength(200)])
          this.songForm.get('genre').setValidators([Validators.required])
          this.songForm.get('contacts').setValidators([Validators.maxLength(200)])
          this.songForm.get('imgUrl').setValidators([checkExtentionImg()])
          this.songForm.get('song').setValidators([checkExtentionSong()])
          //--------------------------------------------------------------------

          // Setting a values triger validators (we must change them before setting values)!
          this.songForm.setValue({
            title: this.songCurentInfo.title,
            genre: this.songCurentInfo.genre,
            contacts: this.songCurentInfo.contacts,
            imgUrl: '',
            song: ''
          })
          //-------------------------------------------------------------------
          
        }, 
        error: (err) => {
          //console.log(err.error.msg)
          this.serverErrors = err.error.msg.split(',')
        },
      }
    )
  }

  updateSong(songForm:NgForm){
    
    console.log(songForm.valid)

    if(songForm.valid){

      let formData = new FormData()
      formData.append('title', songForm.value.title)
      formData.append('genre', songForm.value.genre)
      formData.append('contacts', songForm.value.contacts)
      this.imageFileS ? formData.append('imgUrl', this.imageFileS, this.imageFileS.name) : NaN
      this.songFileS ? formData.append('song', this.songFileS, this.songFileS.name) : NaN
  
      this.useService.postData(`/edit?song=${this.songIDtoUpdate}`, formData, {'x-authorization': window.localStorage['user']} ).subscribe(
        {
          next:(res) => {
            //console.log(res.songs)
            this.songs = res.songs
          }, 
          error: (err) => {
            //console.log(err.error.msg)
            this.serverErrors = err.error.msg.split(',')
          }, 
          complete: () => window.location.reload()
        }
      )
    }
    
  }

}
