import { Component, OnInit, ViewChild } from '@angular/core';
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
  postCurentInfo!: Post
  hostEmail!:string
  postToGo!:object
  renderPostForm:boolean = false
  renderEditPostForm:boolean = false
  postIDtoUpdate!:string

  postForm:any = this.fb.group({
      title: '',
      text: '',
    }
  )

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

    //New Validators must be before we setting validators (we must change them before setting values)!
    this.postForm.get('title').setValidators([Validators.required, Validators.maxLength(200)])
    this.postForm.get('text').setValidators([Validators.required, Validators.maxLength(5000)])
    //--------------------------------------------------------------------

    // Setting a values triger validators!
    this.postForm.setValue({
      title: '',
      text: ''
    })
    //-------------------------------------------------------------------
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
            this.posts = res
          }, 
          error: (err) => {
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
   
    this.postToGo = postObj

    const queryParams = {
      id: postObj._id,
      title: postObj.title
    }
    this.route.navigate(['/post'], {queryParams})
  }

  delteUserCard(id:string){
  
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
    this.postIDtoUpdate = id
    this.renderPostForm = true
    this.renderEditPostForm = true

    this.useService.getData(`/post/edit?post=${this.postIDtoUpdate}`, {'x-authorization': window.localStorage['user']} ).subscribe(
      {
        next:(res) => {

          this.postCurentInfo = res

          //New Validators must be before we setting validators (we must change them before setting values)!
          this.postForm.get('title').setValidators([Validators.maxLength(200)])
          this.postForm.get('text').setValidators([Validators.maxLength(5000)])
          //--------------------------------------------------------------------

          // Setting a values triger validators!
          this.postForm.setValue({
            title: this.postCurentInfo.title,
            text: this.postCurentInfo.text
          })
          //-------------------------------------------------------------------
         
        }, 
        error: (err) => {
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
            this.serverErrors = err.error.msg.split(',')
          }, 
          complete: () => window.location.reload()
        }
      )
    }

  }

}
