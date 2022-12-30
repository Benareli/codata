import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Purchasedetail } from '../models/purchasedetail.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'purchasedetails';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class PurchasedetailService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Purchasedetail[]> {
    return this.http.get<Purchasedetail[]>(baseUrl, { 'headers': headers });
  }
  get(id: any): Observable<Purchasedetail> {
    return this.http.get(`${baseUrl}/${id}`, { 'headers': headers });
  }
  getByPOId(po: any): Observable<Purchasedetail[]> {
    return this.http.get<Purchasedetail[]>(`${baseUrl}/po/${po}`, { 'headers': headers });
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data, { 'headers': headers });
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, { 'headers': headers });
  }
  updateReceiveAll(id: any, partner: any, wh: any, date: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/receiveAll/${id}/${partner}/${wh}/${date}`, data, { 'headers': headers });
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`, { 'headers': headers });
  }
  findByProduct(product: any): Observable<Purchasedetail[]> {
    return this.http.get<Purchasedetail[]>(`${baseUrl}/poo/${product}`, { 'headers': headers });
  }
}