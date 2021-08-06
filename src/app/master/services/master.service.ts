import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MasterModule } from '../master.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

export class mst_branch{
  _branch_id:number;
  _branchname:string;
  _active:string;
  _user_id:string;
}

export class mst_commenttype{
  _comment_type_id:number;
  _comment_type:string;
  _user_id:string;
}

export interface PrivilegeList{
  value: number;
  viewValue: string;
  tablename:string;
}

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
  Mst_Domains:Mst_Domains=new Mst_Domains();
  Mst_privilege:Mst_privilege=new Mst_privilege();
  PrivilegeList:PrivilegeList[]=[];
  mst_roles:mst_roles=new mst_roles();
   usermasterform:FormGroup;
   usermodel:users;
   branchmodel:mst_branch;
   commentmodel:mst_commenttype;
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

  createnewbranchmodel()
  {
    this.branchmodel = new mst_branch();
  }

  createnewcommentmodel()
  {
    this.commentmodel = new mst_commenttype();
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

  GetMstBranch():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=parseInt(localStorage.getItem("UserCode"));
    
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstBranch",modeldata);  
  }

  Update_Mst_Branch(modeldata):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Branch",modeldata);  
  }

  GetMstCommentType():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=parseInt(localStorage.getItem("UserCode"));
    
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstCommentType",modeldata);  
  }

  Update_Mst_Comment(modeldata):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_CommentType",modeldata);  
  }
}
