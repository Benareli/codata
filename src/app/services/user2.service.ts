import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { User } from '../models/user.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'useruser';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class User2Service {

  constructor(private http: HttpClient) { }
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(baseUrl, { 'headers': headers });
  }
  get(id: any): Observable<User> {
    return this.http.get(`${baseUrl}/${id}`, { 'headers': headers });
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, { 'headers': headers });
  }
  findAllActive(): Observable<User[]>{
    return this.http.get<User[]>(`${baseUrl}/active`, { 'headers': headers });
  }
}