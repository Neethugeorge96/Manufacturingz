import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { flatMap, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EocCostAbsorptionService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(
    http: HttpClient,
    @Inject('BASE_URL') baseUrl: string
  ) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/EOC/CPCEstimatedOperationsCost/`;
  }

  getCPCEstimatedOperationsCost(id) {
    return this.http.get<any[]>(this.baseUrl + 'GetCPCByEOCBasicId/' + id).pipe(map(response => { return response; }));
  }

}
