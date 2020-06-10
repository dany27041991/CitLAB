import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cookieService: CookieService, public router: Router) {}

  ngOnInit(){}

  setLogged(token) {
    this.cookieService.set('auth-token', token, 3600);
  }

  login(email: string, password: string) {
    return this.http.post(environment.url + 'auth/token/login', { email: email, password: password });
  }

  isAuthenticated(): boolean {
    const token = this.cookieService.get('auth-token');
    if (token) {
      return true;
    }
    return false;
  }

  logout() {
    this.cookieService.delete('auth-token');
  }

  getToken(): string {
    const token = this.cookieService.get('auth-token');
    if (token) {
      return token;
    }
    this.router.navigate(['auth/signin-v2']);
  }
}
