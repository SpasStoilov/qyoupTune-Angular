import { Component } from '@angular/core';
import { UseService } from './service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent{
  title = 'app';

  constructor(private useService:UseService){ }

  ngOnInit(){
    // this.useService.getData().subscribe(res => {
    //     console.log(res)
    // })
  }


}
