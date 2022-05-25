import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Plant } from './plant.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  public baseUrl: string;
  public consoleUrl: string;
  public tradingUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/manufacturing/Plant/`;
    this.consoleUrl = `${environment.consoleApiUrl}Branch/`;
    this.tradingUrl = `${environment.tradingApiUrl}Address/`;
  }
  getLastPlantId() {
    return this.http.get<number>(this.baseUrl + 'GetLastPlantRequestId').pipe(map(response => { return response; }));
  }
  getAllBranches() {
    return this.http.get<any[]>(this.consoleUrl + 'GetAll/').pipe(map(response => { return response; }));
  }

  getAllPlantAddress() {
    return this.http.get<any[]>(this.tradingUrl + 'GetAll/').pipe(map(response => { return response; }));
  }

  getAll() {
    return this.http.get<Plant[]>(this.baseUrl + 'getAll').pipe(map(response => { return response; }));
  }

  get(id) {
    return this.http.get<Plant[]>(this.baseUrl + 'get/' + id).pipe(map(response => { return response; }));
  }

  add(plant: Plant) {
    return this.http.post(this.baseUrl + 'insert', plant).pipe(map(response => { return response; }));
  }

  update(plant: Plant) {
    return this.http.put<number>(this.baseUrl + 'update', plant).pipe(map(response => { return response; }));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => { return response; }));
  }
}
