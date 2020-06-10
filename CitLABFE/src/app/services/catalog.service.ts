import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {PaperInterfacePagination} from '../interfaces/PaperInterfacePagination';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private http: HttpClient, private cookieService: CookieService, public router: Router, private auth: AuthService) {}

  searchPub(query, page): Observable<PaperInterfacePagination> {
    const headers = {
      'Authorization': String('Token ' + this.auth.getToken()),
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    return this.http.get(environment.url + 'catalog/search/?q=' + query + '&page=' + page,
      { headers: new HttpHeaders(headers) }) as Observable<PaperInterfacePagination>;
  }
}
