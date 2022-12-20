import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UseService } from 'src/app/service';

interface Post{
  _id: string,
  owner: {email: string, username:string},
  title:string,
  text:string,
  users:[{username:string, post:string}] |[]
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  
  serverErrors=''
  postID = this.activateRoute.snapshot.queryParams['id']
  postCurentInfo!:Post

  constructor(
    private activateRoute: ActivatedRoute,
    private useService: UseService, 
    private fb:FormBuilder, 
    private route: Router,
  ){}

  ngOnInit(): void {
    this.useService.getData(`/post/edit?post=${this.postID}`, {'x-authorization': window.localStorage['user']} ).subscribe(
      {
        next:(res) => {
          console.log(res)
          this.postCurentInfo = res //must be obj post
        }, 
        error: (err) => {
          console.log(err.error.msg)
          this.serverErrors = err.error.msg.split(',')
        }, 
      }
    )
  }

  sendPost(value:string){
    console.log('userEner - ', value)
    let body = {
      post: value
    }

    this.useService.postData(`/posts/newpost?appendto=${this.postCurentInfo._id}`, body, {'x-authorization': window.localStorage['user']} ).subscribe(
      {
        next:(res) => {
          console.log(res)
        }, 
        error: (err) => {
          console.log(err.error.msg)
          this.serverErrors = err.error.msg.split(',')
        }, 
        complete: () => window.location.reload()
      }
    )
  }

}
