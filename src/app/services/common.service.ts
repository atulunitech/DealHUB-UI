import {Injectable} from '@angular/core'
import {HttpHeaders,HttpParams,HttpClient} from '@angular/common/http'
import {Observable, observable, BehaviorSubject } from 'rxjs'
import { environment } from 'src/environments/environment';

export class notificationDetails
 {
  notification_text:string;
  notification_date:string;
  IsRead:number;
  dh_system_notification_id:number;
  tablename:string;
 }


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();
  
  menu_status: boolean = false;
  usercode:string ="";
  notification_view: boolean = false;
  
  constructor(private http:HttpClient) 
  { 

  }

  show() {
    this._loading.next(true);
  }

  hide() {
    setTimeout(() => {
      this._loading.next(false);
    },2000 );
    
  }

  menuevent(){
    this.menu_status = !this.menu_status;       
}

notification()
{
  this.notification_view = !this.notification_view;
}
Get_System_Notification(usercode:string)
 {
  const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}),
  params: new HttpParams().set('_user_code', usercode.toString())};
  return this.http.get<any>(environment.apiUrl+"Api/DashBoard/Get_System_Notification",
     httpOptions);  
 }
 notificationDetails:notificationDetails[];
 initializeNotification(data:any)
 {
   console.log(data);
   this.notificationDetails = data.notification;
 
  
   console.log( this.notificationDetails);


  // this.router.navigate(['/DealHUB/dashboard/OBFSummary']);
   
    }
  
    Update_System_Notification(model:any)
 {
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}) };  
     return this.http.post<any>(environment.apiUrl+"Api/DashBoard/Update_System_Notification",model ,
        httpOptions);  
 }
}
