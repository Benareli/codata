import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Product } from '../models/product.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'products';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(baseUrl, { 'headers': headers });
  }
  getTable(): Observable<Product[]>{
    return this.http.get(baseUrl, { 'headers': headers })
      .pipe(map((response: any) => response.data as Product[]))
  }
  get(id: any): Observable<Product> {
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
  findAllActive(): Observable<Product[]>{
    return this.http.get<Product[]>(`${baseUrl}/active`, { 'headers': headers });
  }
  findAllStock(): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/stock`, { 'headers': headers });
  }
  findAllActiveStock(): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/activestock`, { 'headers': headers });
  }
  findAllReady(): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/ready`, { 'headers': headers });
  }
  findAllFGStock(): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/fgready`, { 'headers': headers });
  }
  findAllRMStock(): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/rmready`, { 'headers': headers });
  }
  findAllRMTrue(): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/rmtrue`, { 'headers': headers });
  }
  findAllRM(): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/rm`, { 'headers': headers });
  }
  findAllPOReady(): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/poready`, { 'headers': headers });
  }
  findByDesc(name: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}?name=${name}`, { 'headers': headers });
  }
}