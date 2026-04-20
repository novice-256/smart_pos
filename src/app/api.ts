import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
   constructor(private http : HttpClient , public authService : AuthService){
  }
  private apiUrl = environment.apiUrl;
  login( data : any){
    return this.http.post(`${this.apiUrl}/auth/login` , data);
  }
   logout( ){
    return this.http.get(`${this.apiUrl}/auth/logout` );
  }
  uploadInvoice(data : any){
    return this.http.post(`${this.apiUrl}/upload/invoice`,data);
  }
  createInvoice(data : any){
    return this.http.post(`${this.apiUrl}/create/invoice`,data);
  }
}
