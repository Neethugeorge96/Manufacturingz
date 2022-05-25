import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ManpowerToShift } from './manpower-shift-mapping.model';
import { OwnManPowerService } from '@settings/man-power/own-man-power.service';
import { HiredManPowerService } from '@settings/man-power/hired-man-power.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManpowerShiftMappingService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(
    http: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/manufacturing/mapper/ManPowerToShift/`;
  }

  getAll() {
    return this.http.get<ManpowerToShift[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }

  GetAllShiftCode() {
    return this.http.get<ManpowerToShift[]>(this.baseUrl + 'GetAllShiftCode/').pipe(map(response => response));
  }
  delete(id: number) {
    return this.http.delete<number[]>(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }

  GetAllByShiftCode(code: string) {
    return this.http.get<ManpowerToShift[]>(this.baseUrl + 'GetAllByShiftCode/' + code).pipe(map(response => response));
  }
  DeleteByShiftCode(code: string) {
    return this.http.delete(this.baseUrl + 'DeleteByShiftCode/' + code).pipe(map(response => response));
  }

  upsertMapping(mapping) {
    return this.http.post(this.baseUrl + 'UpsertManPowerToShift/', mapping).pipe(map(response => response));
  }
}
