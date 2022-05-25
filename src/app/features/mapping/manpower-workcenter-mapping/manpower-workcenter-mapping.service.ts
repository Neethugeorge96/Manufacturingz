import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ManpowerToWorkCenter, OwnManPower } from './manpower-workcenter-mapping.model';

@Injectable({
  providedIn: 'root'
})
export class ManPowertoWorkCenterService {

  public baseUrl: string;
  public baseUrlHired:string;
  public baseUrlManpowertoWorkCenter:string;
  public http: HttpClient;
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) { 
    this.http = http;
    this.baseUrl = `${baseUrl}api/manufacturing/OwnManpower/`;
    this.baseUrlHired = `${baseUrl}api/manufacturing/HiredManPower/`;
    this.baseUrlManpowertoWorkCenter =`${baseUrl}api/manufacturing/mapper/ManpowerToWorkCenter/`; 
  }
  getAll() {
    return this.http.get<OwnManPower[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }
  get(workcenterId) {
    return this.http.get<ManpowerToWorkCenter[]>(this.baseUrlManpowertoWorkCenter + 'GetAllByWorkCenterId/' + workcenterId).pipe(map(response => response));
  }

  add( manpowerToWorkCenter: ManpowerToWorkCenter) {
    return this.http.post(this.baseUrlManpowertoWorkCenter + 'insert', manpowerToWorkCenter).pipe(map(response => response));
  }

  update(manpowerToWorkCenter: any) {
    return this.http.put<number>(this.baseUrlManpowertoWorkCenter + 'update', manpowerToWorkCenter).pipe(map(response => response));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrlManpowertoWorkCenter + 'delete/' + id).pipe(map(response => response));
  }

  MappedManpower(){
    return this.http.get<ManpowerToWorkCenter[]>(this.baseUrlManpowertoWorkCenter + 'GetAllMappedManpowerId').pipe(map(response => response));
  }
}
