import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class approvalSystemService {
  public baseUrl: string;
  public consoleUrl: string;
  public tradingUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/manufacturing/ApprovalSystem/`;
    this.tradingUrl = `${environment.tradingApiUrl}`;
  }

  GetAllAppr(id,nodeID) {
    return this.http.get<any[]>(this.baseUrl + 'GetAllApprovalParameterValues/' + id + '/' + nodeID).pipe(map(response => response));
  }

}