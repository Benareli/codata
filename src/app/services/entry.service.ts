import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Entry } from '../models/entry.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'entrys';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  constructor(private http: HttpClient) { }
  getAll(): Observable<Entry[]> {
    return this.http.get<Entry[]>(baseUrl, { 'headers': headers });
  }
  get(id: any): Observable<Entry> {
    return this.http.get(`${baseUrl}/id/${id}`, { 'headers': headers });
  }
  getJournal(journal: any): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${baseUrl}/journal/${journal}`, { 'headers': headers });
  }
}
