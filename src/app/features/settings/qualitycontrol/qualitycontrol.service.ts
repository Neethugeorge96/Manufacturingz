import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { QualityControl } from './qualitycontrol.model';

@Injectable({
  providedIn: 'root'
})
export class QualitycontrolService {
  public baseUrl: string;
  public http: HttpClient;


  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/QC/QualityControl/`; { }
}
getLastQualityId() {
  return this.http.get<number>(this.baseUrl + 'GetLastQualityControlRequestId').pipe(map(response => { return response; }));
}
getAll() {
  return this.http.get<QualityControl[]>(this.baseUrl + 'getAll').pipe(map(response => { return response; }));
}
add(qualitycontrol: QualityControl) {
  return this.http.post(this.baseUrl + 'insert', qualitycontrol).pipe(map(response => { return response; })); 
}

update(qualitycontrol: QualityControl) {
  return this.http.put<number>(this.baseUrl + 'update', qualitycontrol).pipe(map(response => { return response; }));
}

delete(id: number) {
  return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => { return response; }));
}
}
