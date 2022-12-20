import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, NgForm, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UseService } from 'src/app/service';


interface Post{
  _id: string,
  owner: {email: string, username:string},
  title:string,
  text:string,
  users:[]
}

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  serverErrors=''
  posts:[Post]|[] = []
  postCurentInfo!:Post
  hostEmail!:string
  postToGo!:object

  postForm:any = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(30)]],
      text: ['', [Validators.required, Validators.maxLength(5000)]],
    }
  )

  renderPostForm:boolean = false
  renderEditPostForm:boolean = false
  postIDtoUpdate!:string

  constructor(
    private useService: UseService, 
    private fb:FormBuilder, 
    private route: Router,

  ){}

  ngOnInit(): void {
    this.useService.getData("/posts", {'x-authorization': window.localStorage['user']}).subscribe(
      {
        next:(res) => {
          console.log(res)
          this.posts = res.allPosts
          this.hostEmail = res.hostEmail
        }, 
        error: (err) => {
          console.log(err.error.msg)
          this.serverErrors = err.error.msg.split(',')
        }, 
        complete: () => this.route.navigate(['/forum'])
      }
    )
  }

  createPostForm(){
    this.renderPostForm = true
    this.renderEditPostForm = false
  }
  deletePostForm(){
    this.renderPostForm = false
    this.renderEditPostForm = false
  }

  takeData(postForm:NgForm):void{
    if (postForm.valid){
      
      let body = {
        title: postForm.value.title,
        text: postForm.value.text
      }

      this.useService.postData("/user/create/post", body, {'x-authorization': window.localStorage['user'], }).subscribe(
        {
          next:(res) => {
            console.log(res)
            this.posts = res
          }, 
          error: (err) => {
            console.log(err.error.msg)
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

  getPostPage(postObj:Post){
    console.log('postObj:', postObj)

    this.postToGo = postObj

    console.log(postObj._id, postObj.title)

    const queryParams = {
      id: postObj._id,
      title: postObj.title
    }
    this.route.navigate(['/post'], {queryParams})
  }

  delteUserCard(id:string){
    console.log("id to delete:", id)

    this.useService.getData(`/user/posts/delete?id=${id}`, {'x-authorization': window.localStorage['user']}).subscribe(
      {
        next:(res) => {
          console.log(res)
        }, 
        error: (err) => {
          console.log(err.error.msg)
          this.serverErrors = err.error.msg.split(',')
        }, 
        complete: () => {
          window.location.reload()
        }
      }
    )
  }

  renderEditUserForm(id:string){
    this.renderEditPostForm = true
    this.renderPostForm = true
    this.postIDtoUpdate = id

    this.useService.getData(`/post/edit?post=${this.postIDtoUpdate}`, {'x-authorization': window.localStorage['user']} ).subscribe(
      {
        next:(res) => {
          console.log(res)
          this.postCurentInfo = res //must be obj
        }, 
        error: (err) => {
          console.log(err.error.msg)
          this.serverErrors = err.error.msg.split(',')
        }, 
      }
    )
  }

  updatePost(postForm:NgForm){

    if (postForm.valid){
      let body = {
        title: postForm.value.title,
        text: postForm.value.text
      }

      this.useService.postData(`/user/posts?edit=${this.postIDtoUpdate}`, body, {'x-authorization': window.localStorage['user']} ).subscribe(
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


}
