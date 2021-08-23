import {Injectable} from '@angular/core'
import {HttpHeaders,HttpParams,HttpClient} from '@angular/common/http'
import {Observable, observable} from 'rxjs'
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';

export class GetOBFSummaryDataVersionWiseParameters
{
  dh_id:number;
  dh_header_id:number;
}
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient,private _commonservices:CommonService) 
  { 

  }
  
    GetDashBoardData(DashBoardData: any): Observable<any> {  
	   // const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
	    return this.http.post<any>(environment.apiUrl + '/Api/DashBoard/GetDashBoardData',  
        DashBoardData);  
	  }
 
    uploadImage(image:File,types:string) {
      const formData: FormData = new FormData();
       let count=0;
       let encryptedusercode = this._commonservices.setEncryption(this._commonservices.commonkey,localStorage.getItem('UserCode'));
       formData.append('Image', image, image.name);
       formData.append("usercode", encryptedusercode);
       formData.append("Token", localStorage.getItem("Token"));
       let url = "";
       if(types == "coversheet")
       url = environment.apiUrl + '/Api/Auth/UploadObfFile';
       else
       url = environment.apiUrl + '/Api/Auth/UploadImage';
       // const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True'}),observe:"events",reportProgress: true};  
       return this.http.post(url, formData,{
             headers: new HttpHeaders({ 'No-Auth':'True'}),
           reportProgress: true,
           observe: 'events'
         });
    }
 
 GetDashboardCount(DashBoardData: any): Observable<any> 
 {
  //const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
  return this.http.post<any>(environment.apiUrl + '/Api/DashBoard/GetDashBoardDataCount',  
    DashBoardData);  

 }
 GetAttachmentDocument(dh_id:string,dh_header_id:string): Observable<any> 
 {
  let modeldata:GetOBFSummaryDataVersionWiseParameters  = new GetOBFSummaryDataVersionWiseParameters();
    modeldata.dh_id=parseInt(dh_id);
    modeldata.dh_header_id=parseInt(dh_header_id);
 // const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}),
  //params: new HttpParams().set('dh_id', dh_id.toString())
 // .set('dh_header_id',dh_header_id.toString()) };  
  return this.http.post<any>(environment.apiUrl+"Api/Manage_OBF/GetAttachmentDocument",
  modeldata);  
 }
 
 GetDashboardProgress(dh_id: string,dh_header_id:string): Observable<any> 
 {
  let modeldata:GetOBFSummaryDataVersionWiseParameters  = new GetOBFSummaryDataVersionWiseParameters();
  modeldata.dh_id=parseInt(dh_id);
  modeldata.dh_header_id=parseInt(dh_header_id);
  //const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),  params: new HttpParams().set('dh_id', dh_id.toString())};  
  return this.http.post<any>(environment.apiUrl + '/Api/DashBoard/GetDashboardProgress',  
  modeldata);  

 }
}