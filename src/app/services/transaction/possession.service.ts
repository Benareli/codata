import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Possession } from 'src/app/models/transaction/possession.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'possessions';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class PossessionService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Possession[]> {
    return this.http.get<Possession[]>(baseUrl, { 'headers': headers });
  }
  get(id: any): Observable<Possession> {
    return this.http.get(`${baseUrl}/?id=${id}`, { 'headers': headers });
  }
  getUser(user: any): Observable<Possession> {
    return this.http.get(`${baseUrl}/user/${user}`, { 'headers': headers });
  }
  getUserOpen(user: any): Observable<Possession[]> {
    return this.http.get<Possession[]>(`${baseUrl}/openuser/${user}`, { 'headers': headers });
  }
  getUserClose(user: any): Observable<Possession[]> {
    return this.http.get<Possession[]>(`${baseUrl}/closeuser/${user}`, { 'headers': headers });
  }
  getAllOpen(): Observable<Possession[]> {
    return this.http.get<Possession[]>(`${baseUrl}/allopen`, { 'headers': headers });
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data, { 'headers': headers });
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, { 'headers': headers });
  }
}