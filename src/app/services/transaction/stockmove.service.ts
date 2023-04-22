import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Stockmove } from 'src/app/models/transaction/stockmove.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'stockmoves';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class StockmoveService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Stockmove[]> {
    return this.http.get<Stockmove[]>(baseUrl, { 'headers': headers });
  }
  getAllByComp(comp: any): Observable<Stockmove[]> {
    return this.http.get<Stockmove[]>(`${baseUrl}/comp/${comp}`, { 'headers': headers });
  }
  getTable(): Observable<Stockmove[]>{
    return this.http.get(baseUrl, { 'headers': headers })
      .pipe(map((response: any) => response.data as Stockmove[]))
  }
  get(id: any): Observable<Stockmove> {
    return this.http.get(`${baseUrl}/id/${id}`, { 'headers': headers });
  }
  getTransId(transid: any): Observable<Stockmove> {
    return this.http.get(`${baseUrl}/transid/${transid}`, { 'headers': headers });
  }
  getProd(product: any): Observable<Stockmove[]> {
    return this.http.get<Stockmove[]>(`${baseUrl}/prod/${product}`, { 'headers': headers });
  }
  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/quick`, data, { 'headers': headers });
  }
  findTransIn(product: any, comp: any): Observable<Stockmove[]> {
    return this.http.get<Stockmove[]>(`${baseUrl}/transin/${product}/${comp}`, { 'headers': headers });
  }
  findTransOut(product: any, comp: any): Observable<Stockmove[]> {
    return this.http.get<Stockmove[]>(`${baseUrl}/transout/${product}/${comp}`, { 'headers': headers });
  }
  findOrigin(origin: any): Observable<Stockmove[]> {
    return this.http.get<Stockmove[]>(`${baseUrl}/origin/${origin}`, { 'headers': headers });
  }
  findByWh(wh: any): Observable<Stockmove[]> {
    return this.http.get<Stockmove[]>(`${baseUrl}/wh/${wh}`, { 'headers': headers });
  }
}
