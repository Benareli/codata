import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Productcat } from '../models/productcat.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'productcats';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class ProductCatService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Productcat[]> {
    return this.http.get<Productcat[]>(baseUrl, { 'headers': headers });
  }
  getTable(): Observable<Productcat[]>{
    return this.http.get(baseUrl, { 'headers': headers })
      .pipe(map((response: any) => response.data as Productcat[]))
  }
  get(id: any): Observable<Productcat> {
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
  findByCatId(catid: any): Observable<Productcat[]> {
    return this.http.get<Productcat[]>(`${baseUrl}?catid=${catid}`, { 'headers': headers });
  }
  findAllActive(): Observable<Productcat[]>{
    return this.http.get<Productcat[]>(`${baseUrl}/active`, { 'headers': headers });
  }
  findByDesc(description: any): Observable<Productcat[]> {
    return this.http.get<Productcat[]>(`${baseUrl}?description=${description}`, { 'headers': headers });
  }
}