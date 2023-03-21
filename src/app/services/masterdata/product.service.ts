import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Product } from 'src/app/models/masterdata/product.model';
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
  getAll(comp: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/all/${comp}`, { 'headers': headers });
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
  findAllActive(comp: any): Observable<Product[]>{
    return this.http.get<Product[]>(`${baseUrl}/active/${comp}`, { 'headers': headers });
  }
  findAllStock(comp: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/stock/${comp}`, { 'headers': headers });
  }
  findAllActiveStock(comp: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/activestock/${comp}`, { 'headers': headers });
  }
  findAllReady(comp: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/ready/${comp}`, { 'headers': headers });
  }
  findAllFGStock(comp: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/fgready/${comp}`, { 'headers': headers });
  }
  findAllRMStock(comp: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/rmready/${comp}`, { 'headers': headers });
  }
  findAllRMTrue(comp: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/rmtrue/${comp}`, { 'headers': headers });
  }
  findAllRM(comp: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/rm/${comp}`, { 'headers': headers });
  }
  findAllPOReady(comp: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/poready/${comp}`, { 'headers': headers });
  }
  findAllSOReady(comp: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/soready/${comp}`, { 'headers': headers });
  }
  findByDesc(name: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}?name=${name}`, { 'headers': headers });
  }
  getCostComp(prod: any, comp: any): Observable<any> {
    return this.http.get(`${baseUrl}/costcomp/${prod}/${comp}`, { 'headers': headers });
  }
}