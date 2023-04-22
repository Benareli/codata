import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Stockrequest } from 'src/app/models/transaction/stockrequest.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'stockrequests';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class StockrequestService {
  constructor(private http: HttpClient) { }
  getAll(): Observable<Stockrequest[]> {
    return this.http.get<Stockrequest[]>(baseUrl, { 'headers': headers });
  }
  getAllByComp(comp: any): Observable<Stockrequest[]> {
    return this.http.get<Stockrequest[]>(`${baseUrl}/comp/${comp}`, { 'headers': headers });
  }
  getTable(): Observable<Stockrequest[]>{
    return this.http.get(baseUrl, { 'headers': headers })
      .pipe(map((response: any) => response.data as Stockrequest[]))
  }
  get(id: any): Observable<Stockrequest> {
    return this.http.get(`${baseUrl}/id/${id}`, { 'headers': headers });
  }
  getTransId(transid: any): Observable<Stockrequest> {
    return this.http.get(`${baseUrl}/transid/${transid}`, { 'headers': headers });
  }
  validateByTransid(transid: any): Observable<Stockrequest> {
    return this.http.get(`${baseUrl}/valtransid/${transid}`, { 'headers': headers });
  }
  getProd(product: any): Observable<Stockrequest[]> {
    return this.http.get<Stockrequest[]>(`${baseUrl}/prod/${product}`, { 'headers': headers });
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data, { 'headers': headers });
  }
  findTransIn(product: any): Observable<Stockrequest[]> {
    return this.http.get<Stockrequest[]>(`${baseUrl}/transin/${product}`, { 'headers': headers });
  }
  findTransOut(product: any): Observable<Stockrequest[]> {
    return this.http.get<Stockrequest[]>(`${baseUrl}/transout/${product}`, { 'headers': headers });
  }
  findOrigin(origin: any): Observable<Stockrequest[]> {
    return this.http.get<Stockrequest[]>(`${baseUrl}/origin/${origin}`, { 'headers': headers });
  }
}
