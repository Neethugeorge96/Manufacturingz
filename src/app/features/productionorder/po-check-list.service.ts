import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class POCheckListService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/ProductionOrder/PlannedPOChecklist/`;
  }
  getAll() {
    return this.http.get<any[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }

  get(id) {
    return this.http.get<any>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }
  getByTask(task: number) {
    return this.http.get<any[]>(this.baseUrl + 'GetAllCheckListByTaskId/' + task).pipe(map(response => response));
  }

  add(checklistToTask: any) {
    return this.http.post(this.baseUrl + 'insert', checklistToTask).pipe(map(response => response));
  }
  update(checklistToTask: any) {
    return this.http.put(this.baseUrl + 'update', checklistToTask).pipe(map(response => response));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }
}
