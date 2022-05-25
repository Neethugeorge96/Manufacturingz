import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CostAbsorptionToWorkCenter } from './work-center-cost-overhead-mapping.model';

@Injectable({
  providedIn: 'root'
})
export class WorkCenterCostOverheadMappingService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/manufacturing/mapper/CostAbsorptionToWorkCenter/`;
  }

  getAll(id) {
    return this.http.get<CostAbsorptionToWorkCenter[]>(this.baseUrl + 'GetAllByWorkCenter/' + id).pipe(map(response => { return response; }));
  }

  get(id) {
    return this.http.get<CostAbsorptionToWorkCenter[]>(this.baseUrl + 'get/' + id).pipe(map(response => { return response; }));
  }

  add(costAbsorptionToWorkCenter: CostAbsorptionToWorkCenter) {
    return this.http.post(this.baseUrl + 'insert', costAbsorptionToWorkCenter).pipe(map(response => { return response; }));
  }

  update(costAbsorptionToWorkCenter: CostAbsorptionToWorkCenter) {
    return this.http.put<number>(this.baseUrl + 'update', costAbsorptionToWorkCenter).pipe(map(response => { return response; }));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => { return response; }));
  }

}
