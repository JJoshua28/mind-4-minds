import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl: string = 'http://localhost:8000/api/';
  private httpClient: HttpClient = inject(HttpClient);

  get(url: string, config = {}) {
    return this.httpClient.get(this.baseUrl + url, {
      ...config,
      headers: undefined
    });
  }

  post(url: string, data: any, config = {}) {
    return this.httpClient.post(this.baseUrl + url, data, {
      ...config,
      headers: undefined
    });
  }
  put(url: string, data: any, config = {}) {
    return this.httpClient.put(this.baseUrl + url, data, {
      ...config,
      headers: undefined
    });
  }
  delete(url: string, config = {}) {
    return this.httpClient.delete(this.baseUrl + url, config);
  }
}
