import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MasterModule } from '../master.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export class userdashboardupdate
{
  _id:number
  _is_cassh_user:number
  _active:string
  _islocked:number
  _user_id:string
}
class users{
  _id:number
  _user_code:string
  _first_name:string
  _last_name:string
  _mobile_no:string
  _email_id:string
  _role_id:number
  _is_cassh_user:number
  _active:string
  _islocked:number
  _mappedverticals:string
  _mappedbranches:string
  _password:string
  _user_id:string
}

@Injectable({
  providedIn: 'root'
})
export class MasterService {
   usermasterform:FormGroup;
   usermodel:users;
  private apiUrl = `https://jsonplaceholder.typicode.com/posts`;
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) { }
  getMaster(): Observable<MasterModule[]> {
    return this.http.get<MasterModule[]>(`${this.apiUrl}`)
   
  }

  createusermasterform()
  {
    this.usermasterform = new FormGroup({
      usercode : new FormControl("",Validators.required),
      firstname : new FormControl("",Validators.required),
      lastname : new FormControl("",Validators.required),
      role : new FormControl("",Validators.required),
      email : new FormControl("",[Validators.required,Validators.email]),
      mobile : new FormControl("",[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      branch : new FormControl("",Validators.required),
      verticals : new FormControl("",Validators.required)
    });

    this.usermodel = new users();
  }

  getusermaster(userdetails): Observable<any> {  
    //const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'})};  
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstUsers",userdetails);  
       
  }

  updateusermaster(userdetails:users): Observable<any> {  
    //const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'})};  
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Users",userdetails);  
       
  }

  updateuserdashboard(userdetails:userdashboardupdate): Observable<any> {  
    //const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'})};  
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Users_Dashboard",userdetails);  
       
  }
}
