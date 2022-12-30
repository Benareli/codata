import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Journal } from '../models/journal.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'journals';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  constructor(private http: HttpClient) { }
  getAll(): Observable<Journal[]> {
    return this.http.get<Journal[]>(baseUrl, { 'headers': headers });
  }
  get(id: any): Observable<Journal> {
    return this.http.get(`${baseUrl}/id/${id}`, { 'headers': headers });
  }
  findJournal(): Observable<Journal[]>{
    return this.http.get<Journal[]>(`${baseUrl}/journal`, { 'headers': headers });
  }
  findJourn(journal: any): Observable<Journal>{
    return this.http.get(`${baseUrl}/journ/${journal}`, { 'headers': headers });
  }
  findOrigin(origin: any): Observable<Journal[]>{
    return this.http.get<Journal[]>(`${baseUrl}/origin/${origin}`, { 'headers': headers });
  }
  findBill(): Observable<Journal[]>{
    return this.http.get<Journal[]>(`${baseUrl}/bill`, { 'headers': headers });
  }
  findInv(): Observable<Journal[]>{
    return this.http.get<Journal[]>(`${baseUrl}/inv`, { 'headers': headers });
  }
  updateLock(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/lock/${id}`, data, { 'headers': headers });
  }
  createBill(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/bill`, data, { 'headers': headers });
  }
  createInv(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/inv`, data, { 'headers': headers });
  }
}
