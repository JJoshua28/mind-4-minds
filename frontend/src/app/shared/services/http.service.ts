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
      headers: undefined,
      ...config
    });
  }

  post(url: string, data: any, config = {}) {
    return this.httpClient.post(this.baseUrl + url, data, {
      headers: undefined,
      ...config,
    });
  }
  put(url: string, data: any, config = {}) {
    return this.httpClient.put(this.baseUrl + url, data, {
      headers: undefined,
      ...config,
    });
  }
  delete(url: string, config = {}) {
    return this.httpClient.delete(this.baseUrl + url, config);
  }
}
