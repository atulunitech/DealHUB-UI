import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MasterModule } from '../master.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
   usermasterform:FormGroup;
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
      mobile : new FormControl("",Validators.required),
      branch : new FormControl("",Validators.required),
      verticals : new FormControl("",Validators.required)
    });
  }

  getusermaster(userdetails): Observable<any> {  
    //const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'})};  
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstUsers",userdetails);  
       
  }
}
