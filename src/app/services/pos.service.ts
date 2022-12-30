import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Pos } from '../models/pos.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'poss';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class PosService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Pos[]> {
    return this.http.get<Pos[]>(baseUrl, { 'headers': headers });
  }
  get(id: any): Observable<Pos> {
    return this.http.get(`${baseUrl}/${id}`, { 'headers': headers });
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data, { 'headers': headers });
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, { 'headers': headers });
  }
}