import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Brand } from '../models/brand.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'brands';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Brand[]> {
    return this.http.get<Brand[]>(baseUrl, { 'headers': headers });
  }
  getTable(): Observable<Brand[]>{
    return this.http.get(baseUrl, { 'headers': headers })
      .pipe(map((response: any) => response.data as Brand[]))
  }
  get(id: any): Observable<Brand> {
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
  findAllActive(): Observable<Brand[]>{
    return this.http.get<Brand[]>(`${baseUrl}/active`, { 'headers': headers });
  }
  findByDesc(description: any): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${baseUrl}?description=${description}`, { 'headers': headers });
  }
}