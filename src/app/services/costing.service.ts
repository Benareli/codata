import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Costing } from '../models/costing.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'costings';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class CostingService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Costing[]> {
    return this.http.get<Costing[]>(baseUrl, { 'headers': headers });
  }
  getTable(): Observable<Costing[]>{
    return this.http.get(baseUrl, { 'headers': headers })
      .pipe(map((response: any) => response.data as Costing[]))
  }
  get(id: any): Observable<Costing> {
    return this.http.get(`${baseUrl}/${id}`, { 'headers': headers });
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data, { 'headers': headers });
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, { 'headers': headers });
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`, { 'headers': headers });
  }
  findByProduct(product: any): Observable<Costing[]> {
    return this.http.get<Costing[]>(`${baseUrl}/products/${product}`, { 'headers': headers });
  }
}
