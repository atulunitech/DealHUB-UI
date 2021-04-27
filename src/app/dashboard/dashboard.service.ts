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
  

  url = environment.apiUrl + '/Api/DashBoard/GetDashBoardData';

    // getLoginDetails(logindetail:LoginModel): Observable<any>{
    //     return this.http.post<any>(this.url,logindetail);
    // }
    GetDashBoardData(DashBoardData: any): Observable<any> {  
	    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
	    return this.http.post<any>(this.url,  
        DashBoardData, httpOptions);  
	  }

    uploadImage(image:File[]) {
     // debugger;
      const formData: FormData = new FormData();
      let count=0;
      image.forEach(value=>{
        formData.append('Image'+count, value, value.name);
        count++;
      });
       
      // const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True'}),observe:"events",reportProgress: true};  
      return this.http.post("http://localhost:52229/Api/Auth/UploadImage", formData,{
          headers: new HttpHeaders({ 'No-Auth':'True'}),
          reportProgress: true,
          observe: 'events'
        });
}
}