import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Lot } from 'src/app/models/masterdata/lot.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'lots';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class LotService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Lot[]> {
    return this.http.get<Lot[]>(baseUrl, { 'headers': headers });
  }
  getTable(): Observable<Lot[]>{
    return this.http.get(baseUrl, { 'headers': headers })
      .pipe(map((response: any) => response.data as Lot[]))
  }
  get(id: any): Observable<Lot> {
    return this.http.get(`${baseUrl}/${id}`, { 'headers': headers });
  }
  findByProduct(warehouse: any): Observable<Lot[]> {
    return this.http.get<Lot[]>(`${baseUrl}/whlot/${warehouse}`, { 'headers': headers });
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data, { 'headers': headers });
  }
}
