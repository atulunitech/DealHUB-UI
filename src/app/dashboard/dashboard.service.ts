import {Injectable} from '@angular/core'
import {HttpHeaders,HttpParams,HttpClient} from '@angular/common/http'
import {Observable, observable} from 'rxjs'
import { environment } from 'src/environments/environment';

export class GetOBFSummaryDataVersionWiseParameters
{
  dh_id:number;
  dh_header_id:number;
}
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient) 
  { 

  }
  
    GetDashBoardData(DashBoardData: any): Observable<any> {  
	   // const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
	    return this.http.post<any>(environment.apiUrl + '/Api/DashBoard/GetDashBoardData',  
        DashBoardData);  
	  }
 
    uploadImage(image:File) {
      const formData: FormData = new FormData();
       let count=0;
       formData.append('Image', image, image.name);
       // const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True'}),observe:"events",reportProgress: true};  
       return this.http.post(environment.apiUrl + '/Api/Auth/UploadImage', formData,{
          //  headers: new HttpHeaders({ 'No-Auth':'True'}),
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
 
}