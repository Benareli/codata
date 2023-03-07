import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Id } from 'src/app/models/settings/id.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'ids';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class IdService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Id[]> {
    return this.http.get<Id[]>(baseUrl, { 'headers': headers });
  }
  getPOSessId(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/posessid`, { 'headers': headers });
  }
  getPOSId(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/posid`, { 'headers': headers });
  }
  getPaymentId(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/paymentid`, { 'headers': headers });
  }
  getTransferId(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/transferid`, { 'headers': headers });
  }
  getPurchaseId(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/purchaseid`, { 'headers': headers });
  }
  getSaleId(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/saleid`, { 'headers': headers });
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, { 'headers': headers });
  }
}