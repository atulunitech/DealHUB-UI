import {Injectable} from '@angular/core'
import {HttpClient}from '@angular/common/http'
import {HttpHeaders} from '@angular/common/http'
import {Observable, observable} from 'rxjs'
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient) 
  { 

  }
  
    GetDashBoardData(DashBoardData: any): Observable<any> {  
	    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
	    return this.http.post<any>(environment.apiUrl + '/Api/DashBoard/GetDashBoardData',  
        DashBoardData, httpOptions);  
	  }
 
    uploadImage(image:File) {
      const formData: FormData = new FormData();
       let count=0;
       formData.append('Image', image, image.name);
       // const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True'}),observe:"events",reportProgress: true};  
       return this.http.post(environment.apiUrl + '/Api/Auth/UploadImage', formData,{
           headers: new HttpHeaders({ 'No-Auth':'True'}),
           reportProgress: true,
           observe: 'events'
         });
    }
 
 GetDashboardCount(DashBoardData: any): Observable<any> 
 {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
  return this.http.post<any>(environment.apiUrl + '/Api/DashBoard/GetDashBoardDataCount',  
    DashBoardData, httpOptions);  

 }
}