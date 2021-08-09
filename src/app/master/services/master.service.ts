import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MasterModule } from '../master.module';

export class CommonParameters
{
  _user_id:number;
}
export class Mst_Domains
{
  _domain_id:number;
  _domain_code:string;
  _domain_name:string;
  _active:number;
  _user_id:string;
}
export class Mst_privilege
{
  _privilege_Id:number;
  _privilege_name:string;
  _user_id:string;
}
export class mst_roles{
  _id:number;
  _role_code:string;
  _role_name :string;
  _equivalent_cassh_role_name :string;
  _active:string
  _Previlege_Id :number;
}
export interface PrivilegeList{
  value: number;
  viewValue: string;
  tablename:string;
}
@Injectable({
  providedIn: 'root'
})

export class MasterService {
  Mst_Domains:Mst_Domains=new Mst_Domains();
  Mst_privilege:Mst_privilege=new Mst_privilege();
  PrivilegeList:PrivilegeList[]=[];
  mst_roles:mst_roles=new mst_roles();
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

  getusermaster(userdetails): Observable<any> {  
    //const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'})};  
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstUsers",userdetails);  
       
  }
  GetMstDomains():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=parseInt(localStorage.getItem("UserCode"));
    
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstDomains",modeldata);  
  }
  Update_Mst_Domains(modeldata):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Domains",modeldata);  
  }
  //privilege function
  GetMstPrivilege():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=parseInt(localStorage.getItem("UserCode"));
    
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstPrivilege",modeldata);  
  }
  Update_Mst_Privilege(modeldata):Observable<any>
  {
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Privilege",modeldata); 
  }
  //privilege function
  //Roles function
  GetMstRole():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=parseInt(localStorage.getItem("UserCode"));
    
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstRole",modeldata);  
  }
  Update_Mst_Roles(modeldata):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Roles",modeldata);  
  }

  //roles function
  //Forms Function
  GetMstForms():Observable<any>
  {
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=parseInt(localStorage.getItem("UserCode"));
    
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstForms",modeldata);  
  }
  //Forms Function
}
