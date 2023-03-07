import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Partner } from 'src/app/models/masterdata/partner.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'partners';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Partner[]> {
    return this.http.get<Partner[]>(baseUrl, { 'headers': headers });
  }
  getTable(): Observable<Partner[]>{
    return this.http.get(baseUrl, { 'headers': headers })
      .pipe(map((response: any) => response.data as Partner[]))
  }
  get(id: any): Observable<Partner> {
    return this.http.get(`${baseUrl}/${id}`, { 'headers': headers });
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data, { 'headers': headers });
  }
  createMany(user: any, data: any): Observable<any> {
    return this.http.post(`${baseUrl}/many?user=${user}`, data, { 'headers': headers });
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, { 'headers': headers });
  }
  findAllActive(): Observable<Partner[]>{
    return this.http.get<Partner[]>(`${baseUrl}/active`, { 'headers': headers });
  }
  findAllActiveCustomer(): Observable<Partner[]>{
    return this.http.get<Partner[]>(`${baseUrl}/activecustomer`, { 'headers': headers });
  }
  findAllActiveSupplier(): Observable<Partner[]>{
    return this.http.get<Partner[]>(`${baseUrl}/activesupplier`, { 'headers': headers });
  }
  findByDesc(name: any): Observable<Partner[]> {
    return this.http.get<Partner[]>(`${baseUrl}?name=${name}`, { 'headers': headers });
  }
}