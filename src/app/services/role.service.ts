import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Role } from '../models/role.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'userrole';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(baseUrl, { 'headers': headers });
  }
  get(id: any): Observable<Role> {
    return this.http.get(`${baseUrl}/${id}`, { 'headers': headers });
  }
}
