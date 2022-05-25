import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from  'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentUploadService {
  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = baseUrl + "api/profile/documentsave/";
  }

  upload(documentFormData) {
    return this.http.post<any>(this.baseUrl + 'fileupload/', documentFormData);
  }

  delete(path) {
    return this.http.post<any>(this.baseUrl + 'fileuploaddelete', path);
  }
}
