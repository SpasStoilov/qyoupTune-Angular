import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UseService } from 'src/app/service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private route:Router, private useService: UseService
  ){}

  ngOnInit(): void {
    window.localStorage['user'] = ''
    this.route.navigate(['/'])
  }

}
