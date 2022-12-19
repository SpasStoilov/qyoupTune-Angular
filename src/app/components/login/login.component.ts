import { Component} from '@angular/core';
import { Validators, FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UseService } from 'src/app/service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent{
  serverErrors = ''

  loginForm:any = this.fb.group({
    email:['', [Validators.required, Validators.email]],
    password:['', [Validators.required, Validators.maxLength(3)] ],
  })

  constructor(
    private useService: UseService, 
    private fb:FormBuilder, 
    private route:Router,
    ){}

  takeData(logIn:NgForm):void{

    console.log(logIn.value)

    if (logIn.valid){

      this.useService.postData("/login/user", logIn.value).subscribe(
        
        {
          next:(res) => {
            window.localStorage['user'] = res.token
          }, 
          error: (err) => {
            console.log(err.error.msg)
            this.serverErrors = err.error.msg.split(',')
          }, 
          complete: () => this.route.navigate(['/'])
      })
    }

  }

}
