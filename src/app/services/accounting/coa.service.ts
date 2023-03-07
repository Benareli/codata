import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Coa } from 'src/app/models/accounting/coa.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'coas';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class CoaService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Coa[]> {
    return this.http.get<Coa[]>(baseUrl, { 'headers': headers });
  }
  get(id: any): Observable<Coa> {
    return this.http.get(`${baseUrl}/${id}`, { 'headers': headers });
  }
  findAllActive(): Observable<Coa[]>{
    return this.http.get<Coa[]>(`${baseUrl}/active`, { 'headers': headers });
  }
  findByPrefix(prefix: any): Observable<Coa[]> {
    return this.http.get<Coa[]>(`${baseUrl}/prefix/${prefix}`, { 'headers': headers });
  }
}
