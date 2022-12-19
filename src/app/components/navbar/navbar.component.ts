import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, DoCheck{
 
  isUserLog: string|null = window.localStorage.getItem('user')
  // isEmail: string|null = window.localStorage.getItem('user')

  constructor() {}

  ngOnInit(): void {
    // this.isEmail = window.localStorage.getItem('user')
    this.isUserLog = window.localStorage.getItem('user')
  }
  ngDoCheck(): void {
    // this.isEmail = window.localStorage.getItem('user')
    this.isUserLog = window.localStorage.getItem('user')
   
  }


}
