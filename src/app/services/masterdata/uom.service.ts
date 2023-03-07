import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Uom } from 'src/app/models/masterdata/uom.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'uoms';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class UomService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Uom[]> {
    return this.http.get<Uom[]>(baseUrl, { 'headers': headers });
  }
  getTable(): Observable<Uom[]>{
    return this.http.get(baseUrl, { 'headers': headers })
      .pipe(map((response: any) => response.data as Uom[]))
  }
  get(id: any): Observable<Uom> {
    return this.http.get(`${baseUrl}/${id}`, { 'headers': headers });
  }
  getByCat(uomcat: any): Observable<Uom[]> {
    return this.http.get<Uom[]>(`${baseUrl}/uomcat/${uomcat}`, { 'headers': headers });
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data, { 'headers': headers });
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, { 'headers': headers });
  }
}
