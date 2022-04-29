import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { BehaviorSubject, Observable, share } from 'rxjs';
import { IRow } from '../components/table/table.component';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  savedData: any = {};
  host: string;
  headers: HttpHeaders;
  public onChangeSavedData = new BehaviorSubject(this.savedData);

  constructor(private http: HttpClient) {
    this.host = environment.host;
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json'});
  }

  private get(route: string, name: string, save = false, header = this.headers): Observable<any> {
    return new Observable(observer => {
      if (save && this.savedData[name]) {
        observer.next(this.savedData[name]);
        return observer.complete();
      }
      // this.http.get(this.host + this.lang + '/' + route, {headers: this.headers, observe: 'response'}).subscribe(res => {
      this.http.get(this.host + route, {headers: header, observe: 'response'}).subscribe((res: any) => {
        if (res.body) {
          if (save) {
            this.savedData[name] = res.body;
            this.onChangeSavedData.next(this.savedData);
          }
          observer.next(res.body);
          observer.complete();
        } else {
          console.log(res.body);
        }
      }, error => {
        console.log(error.body);
      });
    }).pipe(share());
  }

  public getUsers(): Observable<IRow[]> {
    return this.get(`?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}`, 'users')
  }
}
