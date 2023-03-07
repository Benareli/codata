import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Saledetail } from 'src/app/models/transaction/saledetail.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'saledetails';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class SaledetailService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Saledetail[]> {
    return this.http.get<Saledetail[]>(baseUrl, { 'headers': headers });
  }
  get(id: any): Observable<Saledetail> {
    return this.http.get(`${baseUrl}/${id}`, { 'headers': headers });
  }
  getBySOId(so: any): Observable<Saledetail[]> {
    return this.http.get<Saledetail[]>(`${baseUrl}/so/${so}`, { 'headers': headers });
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data, { 'headers': headers });
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, { 'headers': headers });
  }
  updateSendAll(id: any, partner: any, wh: any, date: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/sendAll/${id}/${partner}/${wh}/${date}`, data, { 'headers': headers });
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`, { 'headers': headers });
  }
  findByProduct(product: any): Observable<Saledetail[]> {
    return this.http.get<Saledetail[]>(`${baseUrl}/poo/${product}`, { 'headers': headers });
  }
}
