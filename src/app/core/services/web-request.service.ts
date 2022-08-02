import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly rootURL;

  constructor(private http: HttpClient) {
    this.rootURL = 'http://localhost:4000';
   }

   get(url: string){
     return this.http.get(`${this.rootURL}/${url}`);
   }

   post(url: string, body: Object){
     return this.http.post(`${this.rootURL}/${url}`, body);
   }

   put(url: string, body: Object){
     return this.http.put(`${this.rootURL}/${url}`, body);
   }

   delete(url: string){
    return this.http.delete(`${this.rootURL}/${url}`);
  }
}
