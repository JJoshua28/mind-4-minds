import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl: string = environment.apiUrl;
  private httpClient: HttpClient = inject(HttpClient);

  get<T>(url: string, config = {}) {
    return this.httpClient.get(this.baseUrl + url, {
      ...config
    }) as Observable<T>;
  }

  post<T>(url: string, data: any, config = {}) {
    return this.httpClient.post(this.baseUrl + url, data, {
      headers: undefined,
      ...config,
    }) as Observable<T>;
  }
  put<T>(url: string, data: any, config = {}) {
    return this.httpClient.put(this.baseUrl + url, data, {
      ...config,
    }) as Observable<T>;
  }

  delete<T>(url: string, data?: any, config: any = {}): Observable<T> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', ...(config.headers || {}) });

    const options = data
      ? { body: data, headers, observe: 'body' as const, ...config }
      : { headers, observe: 'body' as const, ...config };

    return this.httpClient.delete<T>(this.baseUrl + url, options) as Observable<T>;
  }


}
