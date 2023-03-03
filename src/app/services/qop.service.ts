import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Qop } from '../models/qop.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'qops';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class QopService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Qop[]> {
    return this.http.get<Qop[]>(baseUrl, { 'headers': headers });
  }
  getTable(): Observable<Qop[]>{
    return this.http.get(baseUrl, { 'headers': headers })
      .pipe(map((response: any) => response.data as Qop[]))
  }
  get(id: any): Observable<Qop> {
    return this.http.get(`${baseUrl}/${id}`, { 'headers': headers });
  }
  getProd(product: any, warehouse: any): Observable<Qop[]> {
    return this.http.get<Qop[]>(`${baseUrl}/prod/${product}/${warehouse}`, { 'headers': headers });
  }
  getProdQop(product: any): Observable<Qop[]> {
    return this.http.get<Qop[]>(`${baseUrl}/prodqop/${product}`, { 'headers': headers });
  }
  getWhQop(warehouse: any): Observable<Qop[]> {
    return this.http.get<Qop[]>(`${baseUrl}/whqop/${warehouse}`, { 'headers': headers });
  }
  findByProduct(product: any): Observable<Qop[]> {
    return this.http.get<Qop[]>(`${baseUrl}/product/${product}`, { 'headers': headers });
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data, { 'headers': headers });
  }
  createUpdate(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/cu`, data, { 'headers': headers });
  }
}