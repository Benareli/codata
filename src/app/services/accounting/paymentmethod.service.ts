import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Paymentmethod } from 'src/app/models/accounting/paymentmethod.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'paymentmethods';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class PaymentmethodService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Paymentmethod[]> {
    return this.http.get<Paymentmethod[]>(baseUrl, { 'headers': headers });
  }
  get(id: any): Observable<Paymentmethod> {
    return this.http.get(`${baseUrl}/${id}`, { 'headers': headers });
  }
  findByDesc(name: any): Observable<Paymentmethod> {
    return this.http.get(`${baseUrl}/name/${name}`, { 'headers': headers });
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data, { 'headers': headers });
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, { 'headers': headers });
  }
}
