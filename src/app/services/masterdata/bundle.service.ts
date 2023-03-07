import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Bundle } from 'src/app/models/masterdata/bundle.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'bundles';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class BundleService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Bundle[]> {
    return this.http.get<Bundle[]>(baseUrl, { 'headers': headers });
  }
  getTable(): Observable<Bundle[]>{
    return this.http.get(baseUrl, { 'headers': headers })
      .pipe(map((response: any) => response.data as Bundle[]))
  }
  get(id: any): Observable<Bundle> {
    return this.http.get(`${baseUrl}/${id}`, { 'headers': headers });
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data, { 'headers': headers });
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, { 'headers': headers });
  }
  getByProduct(product: any): Observable<Bundle[]> {
    return this.http.get<Bundle[]>(`${baseUrl}/product/${product}`, { 'headers': headers });
  }
  getByBundle(bundle: any): Observable<Bundle[]> {
    return this.http.get<Bundle[]>(`${baseUrl}/bundle/${bundle}`, { 'headers': headers });
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`, { 'headers': headers });
  }
}