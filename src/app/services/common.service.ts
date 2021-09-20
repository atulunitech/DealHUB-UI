import {Injectable} from '@angular/core'
import {HttpHeaders,HttpParams,HttpClient} from '@angular/common/http'
import {Observable, observable, BehaviorSubject } from 'rxjs'
import { environment } from 'src/environments/environment';
import { GetObfMasterParameters } from '../dashboard/services/obfservices.service';
import { AbstractControl } from '@angular/forms';
import * as CryptoJS from 'crypto-js'; 

export class notificationDetails
 {
  notification_text:string;
  notification_date:string;
  IsRead:number;
  dh_system_notification_id:number;
  tablename:string;
 }

 export class getnotificationparams
{
  _user_code:string;
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public disabledresetclose:boolean = false;
  public commonkey = "0c24f9de!b855915";
  private _loading = new BehaviorSubject<boolean>(false);
  qryparamssecretkey:string = "dealhubsecretkey$123";
  public resetclicked = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();
  menu_status: boolean = false;
  usercode:string ="";
  notification_view: boolean = false;
  
  constructor(private http:HttpClient) 
  { 

  }

  show() {
    this._loading.next(true);
  }

  getresetclickedevent():Observable<any>
  {
    return this.resetclicked.asObservable();
  }

  hide() {
    setTimeout(() => {
      this._loading.next(false);
    },5000);
    
  }

  menuevent(){
    this.menu_status = !this.menu_status;       
}

notification()
{
  this.notification_view = !this.notification_view;
}
// Get_System_Notification(usercode:string)
//  {
//   const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}),
//   params: new HttpParams().set('_user_code', usercode.toString())};
//   return this.http.get<any>(environment.apiUrl+"Api/DashBoard/Get_System_Notification",
//      httpOptions);  
//  }

Get_System_Notification(usercode:string)
 {
  let model:getnotificationparams = new getnotificationparams();
  model._user_code = usercode;
  // const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}),
  // params: new HttpParams().set('_user_code', usercode.toString())};
  return this.http.post<any>(environment.apiUrl+"Api/DashBoard/Get_System_Notification",
  model);  
 }

 notificationDetails:notificationDetails[];
 initializeNotification(data:any)
 {
   console.log(data);
   this.notificationDetails = data.notification;
 
  
   console.log( this.notificationDetails);


  // this.router.navigate(['/DealHUB/dashboard/OBFSummary']);
   
    }
  
    Update_System_Notification(model:any)
 {
   // const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}) };  
     return this.http.post<any>(environment.apiUrl+"Api/DashBoard/Update_System_Notification",model );  
 }

deletetoken(usercode:any): Observable<any> {  
  //const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};  
  return this.http.post<any>(environment.apiUrl+"Api/Auth/DeleteToken",usercode
     );  
}

NoInvalidCharacters(control: AbstractControl): {[key: string]: any} | null  {
  var format = /[<>()'"/\*;={}`%+^!-]/;
  if (control.value && format.test(control.value)) {
    return { 'invalidcharacters': true };
  }
  return null;
}

setEncryption(keys, value){
  var key = CryptoJS.enc.Utf8.parse(keys);
  var iv = CryptoJS.enc.Utf8.parse(keys);
  var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
  {
      keySize: 256 / 32,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  });

  return encrypted.toString();
}

setDecryption(keys, value){
  var key = CryptoJS.enc.Utf8.parse(keys);
  var ivs = CryptoJS.enc.Utf8.parse(keys);
  var decrypted = CryptoJS.AES.decrypt(value, key,
  {
      keySize: 128 / 8,
      iv: ivs,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

 encryptalpha(key,str) {
  return CryptoJS.AES.encrypt(str, key).toString();
}

 decryptalpha(key,encrypted) {
  const decrypted = CryptoJS.AES.decrypt(encrypted, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
}


encrypt(value : string) : string{
  return CryptoJS.AES.encrypt(value, this.qryparamssecretkey.trim()).toString();
}

decrypt(textToDecrypt : string){
  return CryptoJS.AES.decrypt(textToDecrypt, this.qryparamssecretkey.trim()).toString(CryptoJS.enc.Utf8);
}

}
