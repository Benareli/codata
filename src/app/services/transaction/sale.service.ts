import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Sale } from 'src/app/models/transaction/sale.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'sales';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(baseUrl, { 'headers': headers });
  }
  getAllByComp(comp: any): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${baseUrl}/comp/${comp}`, { 'headers': headers });
  }
  get(id: any): Observable<Sale> {
    return this.http.get(`${baseUrl}/${id}`, { 'headers': headers });
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data, { 'headers': headers });
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, { 'headers': headers });
  }
  updateState(id: any, state: any): Observable<any> {
    return this.http.get(`${baseUrl}/state/${id}/${state}`, { 'headers': headers });
  }
}
