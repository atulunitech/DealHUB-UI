import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http:HttpClient) { }
  menu_status: boolean = false;
  usercode:string ="";
  notification_view: boolean = false;
  menuevent(){
    this.menu_status = !this.menu_status;       
}

notification()
{
  this.notification_view = !this.notification_view;
}

deletetoken(usercode:any): Observable<any> {  
  //const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};  
  return this.http.post<any>(environment.apiUrl+"Api/Auth/DeleteToken",usercode
     );  
}
}
