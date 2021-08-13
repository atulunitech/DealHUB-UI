import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MasterModule } from '../master.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';

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
  _active:string;
}
export class map_privilege_role
{
  role_id:number;
  Previlege_Id:number;
  role_code:string;
  privilege_name:string
}
export class mst_roles{
  _id:number;
  _role_code:string;
  _role_name :string;
  _equivalent_cassh_role_name :string;
  _active:string
  _Previlege_Id :string;
  _user_id:string;
}
export class mst_Forms
{
  _id:number;
  _form_name:string;
  _url:string;
  _active:string;
  _user_id:string;
}
export class PrivilegeList{
  value: number;
  viewValue: string;
  tablename:string;
}
export class FunctionList{
  value: number;
  viewValue: string;
  tablename:string;
}
export class SectorList{
  value: number;
  viewValue: string;
  tablename:string;
}
export class map_vertical_sector
{
  vertical_id:number;
  vertical_name:string;
  sector_id:number;
  sector_Name:string
  tablename:string;
}
export class mst_verticals
{
  _vertical_id:number;
  _vertical_code:string;
  _vertical_name :string;
  _function_id :number;
  _active:string;
  _Sector_Id:string;
  _user_id:string;
}

// export class CommonParameters
// {
//   _user_id:number;
// }
// export class Mst_Domains
// {
//   _domain_id:number;
//   _domain_code:string;
//   _domain_name:string;
//   _active:number;
//   _user_id:string;
// }
// export class Mst_privilege
// {
//   _privilege_Id:number;
//   _privilege_name:string;
//   _user_id:string;
// }
// export class mst_roles{
//   _id:number;
//   _role_code:string;
//   _role_name :string;
//   _equivalent_cassh_role_name :string;
//   _active:string
//   _Previlege_Id :number;
// }

export class mst_branch{
  _branch_id:number;
  _branchname:string;
  _active:string;
  _user_id:string;
}

export class mst_sector{
  _Sector_Id:number;
  _Sector_Name:string;
  _active:string;
  _user_id:string;
}

export class mst_subsector{
  _SubSector_Id:number;
  _SubSector_Name:string;
  _Sector_Id:string;
  _user_id:string;
}


export class mst_solutioncategory{
  _solutioncategory_Id:number;
  _solutioncategory_name:string;
  _active:string;
  _user_id:string;
}

export class mst_solution{
  _Solution_Id:number;
  _Solution_Name:string;
  _Solutioncategory_Id:number;
  _function_id:number;
  _domain_id:number;
  _active:string;
  _user_id:string;
}

export class mst_doa{
  _DOA_Matrix_Id:number;
  _Message:string;
  _MessageFor:string;
  _Prefix:string;
  _user_id:string;
}

export class mst_business{
  _function_id:number;
  _function_code:string;
  _function_name:string;
  _active:number;
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
   sectormodel:mst_sector;
   subsectormodel:mst_subsector;
   solutioncategorymodel:mst_solutioncategory;
   solutionmodel:mst_solution;
   doamodel:mst_doa;
   businessmodel:mst_business;
   commentmodel:mst_commenttype;
  FunctionList:FunctionList[]=[];
  SectorList:SectorList[]=[];
  map_privilege_role:map_privilege_role[] =[];
  mst_Forms:mst_Forms=new mst_Forms();
  map_vertical_sector:map_vertical_sector[]=[];
  mst_verticals:mst_verticals=new mst_verticals();
  private apiUrl = `https://jsonplaceholder.typicode.com/posts`;
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient,public commonService:CommonService) { }
  // getMaster(): Observable<MasterModule[]> {
  //   return this.http.get<MasterModule[]>(`${this.apiUrl}`)
   
  // }

  createnewbranchmodel()
  {
    this.branchmodel = new mst_branch();
  }

  createnewsectormodel()
  {
    this.sectormodel = new mst_sector();
  }

  createnewsubsectormodel()
  {
    this.subsectormodel = new mst_subsector();
  }

  createnewsolutioncategorymodel()
  {
    this.solutioncategorymodel = new mst_solutioncategory();
  }

  createnewsolutionmodel()
  {
    this.solutionmodel = new mst_solution();
  }

  createnewdoamodel()
  {
    this.doamodel = new mst_doa();
  }

  createnewbusinessmodel()
  {
    this.businessmodel = new mst_business();
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

  // getusermaster(userdetails): Observable<any> {  
  //   //const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'})};  
  //   return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstUsers",userdetails);  
       
  // }

  updateusermaster(userdetails:users): Observable<any> {  
    //const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'})};  
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Users",userdetails);  
       
  }

  updateuserdashboard(userdetails:userdashboardupdate): Observable<any> {  
    //const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'})};  
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Users_Dashboard",userdetails);  
       
  }

  // GetMstDomains():Observable<any>{
  //   let modeldata:CommonParameters  = new CommonParameters();
  //   modeldata._user_id=parseInt(localStorage.getItem("UserCode"));
    
  //   return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstDomains",modeldata);  
  // }
  // Update_Mst_Domains(modeldata):Observable<any>{
  //   return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Domains",modeldata);  
  // }
  // //privilege function
  // GetMstPrivilege():Observable<any>{
  //   let modeldata:CommonParameters  = new CommonParameters();
  //   modeldata._user_id=parseInt(localStorage.getItem("UserCode"));
    
  //   return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstPrivilege",modeldata);  
  // }
  // Update_Mst_Privilege(modeldata):Observable<any>
  // {
  //   return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Privilege",modeldata); 
  // }
  // //privilege function
  // //Roles function
  // GetMstRole():Observable<any>{
  //   let modeldata:CommonParameters  = new CommonParameters();
  //   modeldata._user_id=parseInt(localStorage.getItem("UserCode"));
    
  //   return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstRole",modeldata);  
  // }
  // Update_Mst_Roles(modeldata):Observable<any>{
  //   return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Roles",modeldata);  
  // }

  GetMstBranch():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
    
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstBranch",modeldata);  
  }

  GetMstBusiness():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
     
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstFunctions",modeldata);  
  }

  Update_Mst_Branch(modeldata):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Branch",modeldata);  
  }

  Update_Mst_SolutionCategory(modeldata):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/UpdateMstSolutionCategory",modeldata);  
  }

  Update_Mst_Sector(modeldata):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/UpdateMstSector",modeldata);  
  }

  Update_Mst_Business(modeldata):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/UpdateMstFunctions",modeldata);  
  }

  Update_Mst_SubSector(modeldata):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Subsector",modeldata);  
  }

  GetMstCommentType():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
     
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstCommentType",modeldata);  
  }

  Update_Mst_Comment(modeldata):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_CommentType",modeldata);  
  }

  Update_Mst_Solution(modeldata):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_solution",modeldata);  
  }

  Update_Mst_DOA(modeldata):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Doa_Matrix_Messages",modeldata);  
  }

  GetMstSector():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
    
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstSector",modeldata);  
  }

  GetMstSolutionCategory():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
     
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstSolutionCategory",modeldata);  
  }

  GetMstSolution():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
     
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstSolution",modeldata);  
  }

  GetMstDoaMsg():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
    
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstDoaMatrixMessages",modeldata);  
  }

  GetMstSubSector():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
    
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstSubsector",modeldata);  
  }

  getMaster(): Observable<MasterModule[]> {
    return this.http.get<MasterModule[]>(`${this.apiUrl}`)
   
  }

  getusermaster(userdetails): Observable<any> {  
    //const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'})};  
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstUsers",userdetails);  
       
  }
  GetMstDomains():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
    
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstDomains",modeldata);  
  }
  Update_Mst_Domains(modeldata):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Domains",modeldata);  
  }
  //privilege function
  GetMstPrivilege():Observable<any>{
    let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
    
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
    modeldata._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));

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
    modeldata._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
    
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstForms",modeldata);  
  }
  Update_Mst_Forms(modeldata):Observable<any>
  {
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Forms",modeldata);  
  }
  //Forms Function
  //Vertical Function 
  GetMstVerticals():Observable<any>
  {
   let modeldata:CommonParameters  = new CommonParameters();
    modeldata._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
    
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/GetMstVerticals",modeldata);  
  }
  Update_Mst_Verticals(modeldata):Observable<any>
  {
    return this.http.post<any>(environment.apiUrl+"Api/MasterUpdation/Update_Mst_Verticals",modeldata);  
  }
}
