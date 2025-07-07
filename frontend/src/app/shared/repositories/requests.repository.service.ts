import {inject, Injectable} from '@angular/core';
import {HttpService} from "../services/http.service";

import {interval, map, Observable, startWith, switchMap} from "rxjs";

import {mapApiToRequest} from "../mapper/api/apiToRequests.mapper";
import {ApiRequest, ApiRequestResponse} from "../../types/api/request.interface";

import { mapRequestsToUpdateRequestApi} from "../mapper/requestsToApi.mapper";
import {Requests} from "../../types/requests.interface";

@Injectable({
  providedIn: 'root'
})
export class RequestsRepositoryService {

  private readonly apiService = inject(HttpService)

  getAllRequestForUser(userDetailsId: string): Observable<Requests[]> {
    const requestsEndpoint = `communications/requests/?user_details_id=${userDetailsId}`;

    return this.apiService.get<ApiRequestResponse[]>(requestsEndpoint).pipe(
      map((details) => details.map(request => mapApiToRequest(request))),
    );
  }

  updateRequest(request: Requests): Observable<Requests> {
    const requestsEndpoint = `communications/requests/${request.id}/`;
    const updatedRequest = mapRequestsToUpdateRequestApi(request);

    return this.apiService.put<ApiRequestResponse>(requestsEndpoint, updatedRequest).pipe(
      map((details) => mapApiToRequest(details))
    )
  }

  createRequest(request: ApiRequest): Observable<Requests> {
    const requestsEndpoint = `communications/requests/`;
    return this.apiService.post<ApiRequestResponse>(requestsEndpoint, request).pipe(
      map((details) => mapApiToRequest(details)),
    );
  }

  createAdminRequest(request: ApiRequest): Observable<Requests> {
    const requestsEndpoint = `communications/requests/create-admin-request/`;
    return this.apiService.post<ApiRequestResponse>(requestsEndpoint, request).pipe(
      map((details) => mapApiToRequest(details)),
    );
  }

  deleteRequest(requestId: string): Observable<Requests> {
    const requestsEndpoint = `communications/requests/${requestId}/`;
    return this.apiService.delete<ApiRequestResponse>(requestsEndpoint).pipe(
      map((details) => mapApiToRequest(details)),
    );
  }

  deleteMultipleRequests(requestIds: Array<string>): Observable<string> {
    const requestsEndpoint = `communications/requests/delete-all/`;
    const requestIdsBody = {
      ids: requestIds
    }

    return this.apiService.post<{
      deleted: number
    }>(requestsEndpoint, requestIdsBody).pipe(
      map((details) => `Deleted ${details.deleted} requests`),
    );
  }

  hasNewRequests(userDetailsId: string): Observable<boolean> {
    return interval(30000).pipe(
      startWith(0),
      switchMap(() =>
        this.apiService.get<ApiRequestResponse[]>(`communications/requests/?is_new=True&user_details_id=${userDetailsId}`)
      ),
      map((requests) => requests.length > 0)
    );
  }




}
