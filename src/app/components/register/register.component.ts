import { Component} from '@angular/core';
import {UseService} from '../../service'
import { FormBuilder, NgForm, Validators} from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent{

  serverErrors = ''

  registerForm:any = this.fb.group({
    email:['', [Validators.required, Validators.email]],
    username:['', [Validators.required, Validators.maxLength(3)]],
    password:['', [Validators.required, Validators.maxLength(3)]],
    reppassword:['', [Validators.required, Validators.maxLength(3)]
    ],
  })

  constructor(
    private useService: UseService, 
    private fb:FormBuilder, 
    private route:Router,
    ){}

  takeData(reg:NgForm):void{
    
    console.log(reg.value)

    if (reg.valid){
      this.useService.postData("/register", reg.value).subscribe({
        next:(res) => {
          window.localStorage['user'] = res.token
        }, 
        error: (err) => {
          console.log(err.error.msg)
          this.serverErrors = err.error.msg.split(',')
        }, 
        complete: () => this.route.navigate(['/']),
      })
    }

  }

}
