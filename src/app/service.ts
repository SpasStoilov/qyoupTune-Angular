import {HttpClient} from '@angular/common/http'
import { Injectable } from '@angular/core'

const baseURL:string = 'http://localhost:3000'


@Injectable({
    providedIn:'root'
})

export class UseService {

    constructor(private fetchMe:HttpClient){
    }
    getData(path:string ='/', headers:any={}){
      return this.fetchMe.get<any>(`${baseURL}${path}`, {headers:headers})
    }
    postData(path:string ='/', body={}, headers:any={'content-type': "application/json"}){
      return this.fetchMe.post<any>(
        `${baseURL}${path}`, 
        body, 
        {headers:headers}
      )
    }
}
