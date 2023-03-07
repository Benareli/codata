import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Warehouse } from 'src/app/models/masterdata/warehouse.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'warehouses';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(baseUrl, { 'headers': headers });
  }
  getTable(): Observable<Warehouse[]>{
    return this.http.get(baseUrl, { 'headers': headers })
      .pipe(map((response: any) => response.data as Warehouse[]))
  }
  get(id: any): Observable<Warehouse> {
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
  findAllActive(): Observable<Warehouse[]>{
    return this.http.get<Warehouse[]>(`${baseUrl}/active`, { 'headers': headers });
  }
  findMain(): Observable<Warehouse[]>{
    return this.http.get<Warehouse[]>(`${baseUrl}/main`, { 'headers': headers });
  }
  findByDesc(name: any): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${baseUrl}?name=${name}`, { 'headers': headers });
  }
}