import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Bom } from '../models/bom.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'boms';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class BomService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Bom[]> {
    return this.http.get<Bom[]>(baseUrl, { 'headers': headers });
  }
  getTable(): Observable<Bom[]>{
    return this.http.get(baseUrl, { 'headers': headers })
      .pipe(map((response: any) => response.data as Bom[]))
  }
  get(id: any): Observable<Bom> {
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
  findByProduct(product: any): Observable<Bom[]> {
    return this.http.get<Bom[]>(`${baseUrl}/products/${product}`, { 'headers': headers });
  }
  findByProductAggr(): Observable<Bom[]> {
    return this.http.get<Bom[]>(`${baseUrl}/aggrproducts`, { 'headers': headers });
  }
}
