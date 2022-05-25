import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MaterialIssue } from './material-issue.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MaterialissueService {
  public baseUrl: string;
  public consoleUrl: string;
  public tradingUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/MaterialIssue/BasicMaterialIssue/`;
    this.tradingUrl = `${environment.tradingApiUrl}`;
  }


  getUom(id : number){
    return this.http.get<any[]>(this.tradingUrl + 'Item/Config/Get/' + id).pipe(map(response => { return response; }));
  }
  getLastMaterialRequestId() {
    return this.http.get<number>(this.baseUrl + 'GetLastMaterialRequestId').pipe(map(response => { return response; }));
  }
  getAll() {
    return this.http.get<MaterialIssue[]>(this.baseUrl + 'getAll').pipe(map(response => { return response; }));
  }
  getMaterialIssue(id) {
    return this.http.get<MaterialIssue>(this.baseUrl + 'GetMaterialIssue/' + id).pipe(map(response => { return response; }));
  }
  add(material: MaterialIssue) {
    return this.http.post(this.baseUrl + 'insert', material).pipe(map(response => { return response; }));
  }
  update(material: MaterialIssue) {
    return this.http.put<number>(this.baseUrl + 'update', material).pipe(map(response => { return response; }));
  }
  updateMaterialIssueStatus(materialRequestNo: number, status: number) {
    return this.http.put<number>(this.baseUrl + 'updateMaterialIssueStatus/' + materialRequestNo + '/'+status,{}).pipe(map(response => { return response; }));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => { return response; }));
  }

}