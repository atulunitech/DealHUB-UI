import {Injectable} from '@angular/core'
import {HttpClient, HttpParams, JsonpClientBackend}from '@angular/common/http'
import {HttpHeaders} from '@angular/common/http'
import {Observable, observable} from 'rxjs'
import{LoginModel} from './login.component'
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn:'root'
})
export class loginservices
{
 
    constructor(private http:HttpClient){}
     
    getLoginDetails(loginDetail: any): Observable<any> {  
	    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','No-Auth':'True'}) };  
	    return this.http.post<any>(environment.apiUrl + '/Api/Auth/Login',  
	    loginDetail, httpOptions);  
	  }
    
    GetToken(TokenDetails):Observable<any>
    {
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','No-Auth':'True'}) };  
	    return this.http.post<any>(environment.apiUrl + '/Api/Auth/RemindMe',  
        TokenDetails, httpOptions); 
    }
     
    ResetPassword(PasswordDetails):Observable<any>
    {
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','No-Auth':'True'}) };  
	    return this.http.post<any>(environment.apiUrl + '/Api/Auth/ResetPassword',  
        PasswordDetails, httpOptions); 
    }
    
    sendemail(logindetails):Observable<any>
    {

      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','No-Auth':'True'})};  
	    return this.http.post<any>(environment.apiUrl + '/Api/Auth/sendemail',logindetails,httpOptions
        ); 
    }
    

}