import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = `${baseUrl}api/account/`;
   }
   public get getAuthToken() {
     return localStorage.getItem('token')
   }
  isLoggedIn(){
    
      if(localStorage.getItem('token')){
        return true
      }
      return false
    
  }
  login(email: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}login`, { email, password })
        .pipe(map(user => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }));
  }

  logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      return;
      // this.currentUserSubject.next(null);
  }

  resetPassword(obj) {
    return this.http.post<any>(`${this.baseUrl}resetpassword`,obj);
  }

  insertNewUser(obj) {
    return this.http.post<any>(`${this.baseUrl}Insert`,obj);
  }

}
