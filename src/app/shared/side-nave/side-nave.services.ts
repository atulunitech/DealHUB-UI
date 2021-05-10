import {Injectable} from '@angular/core'
import {HttpClient}from '@angular/common/http'
import {HttpHeaders} from '@angular/common/http'
import {Observable, observable} from 'rxjs'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  constructor(private http:HttpClient) 
  { 

  }

  url = environment.apiUrl + '/Api/Auth/GetMenuDetails';

    
    GetMenus(MenuDetails: any): Observable<any> {  
	     const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
	    return this.http.post<any>(this.url,  
	   MenuDetails, httpOptions);  
	   }
}
