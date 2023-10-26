import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Company } from 'src/app/models/settings/company.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'companys';
const headers= new HttpHeaders()
  .set('apikey', BaseURL.API_KEY)
  .set('apikey2', BaseURL.API_KEY2)
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(baseUrl, { 'headers': headers });
  }
  get(id: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/get/${id}`, { 'headers': headers });
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, { 'headers': headers });
  }
}
