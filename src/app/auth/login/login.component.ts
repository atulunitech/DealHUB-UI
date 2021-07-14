import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';
import { loginservices } from './LoginServices';
import {Router} from "@angular/router"
import { HttpErrorResponse } from '@angular/common/http';
import {MessageBoxComponent} from '../../shared/MessageBox/MessageBox.Component';
import { Action } from 'rxjs/internal/scheduler/Action';
import * as CryptoJS from 'crypto-js'; 
import { Token } from '@angular/compiler/src/ml_parser/lexer';

//region model
export class LoginModel
{
  _user_code:string;
  _password:string;
  _token:string;
   _SecretKey:string;
  privilege_name:string;
  _attempt:string;
  role_name:string;
  UserName:string;
  _ClientId:string;
}
//endregion

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public ResetPasswordForm:FormGroup;
  public loginvalid: FormGroup;
  log_in:boolean=true;
  lost_pass:boolean= false;
  loginDetail:any;
  message:string;
  loginmodel:LoginModel=new LoginModel();
  
  RememberMe:any=false;
  ResetPass:boolean=false;
  NewPassword:any="";
  confirmpassword:any="";
  key:string = "";
  midval:string="";
  disablebutton:boolean=false;

  constructor(private formbuilder:FormBuilder, 
    private _loginservice:loginservices,private router: Router,private _mesgBox: MessageBoxComponent) { }


  ngOnInit(): void {
    // if(localStorage.getItem("Token") != "")
    // {
    //   this.router.navigate(['/DealHUB/dashboard']);
    // }
      this.key = "";
    //Password Secret key 
    // let randomNumber:number = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    // localStorage.setItem("Token","");
    //  this.key = "$!$030!m0l0l"+randomNumber.toString();
    // let plainTextBytes = this.stringtobytes(this.key);
    // this.midval =  btoa(String.fromCharCode(...new Uint8Array(plainTextBytes)));
    


    // sample comment
    this.loginvalid = new FormGroup({
      // Validators.email,
      userID : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      Password : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      RememberMe:new FormControl("")
    });
    

    this.ResetPasswordForm=new FormGroup({

      ResetPasswordUserid:new FormControl('',[Validators.required,Validators.email])
    });
    if(this.ResetPass != true)
    {
      if(localStorage.getItem("rememberCurrentUser")!= null)
      {
        if(localStorage.getItem("rememberCurrentUser")=='true')
        {
          this.loginmodel._user_code = localStorage.getItem('UserName'); 
          this.RememberMe = localStorage.getItem('rememberCurrentUser');
          this.loginmodel._token=localStorage.getItem('Token');
          this.loginmodel._password="abc";
          this.GetToken( this.loginmodel);
        }
    
     }
    }

    this.getClientKey();
  }
   
  getClientKey()
  {
    this._loginservice.getClientKey().subscribe((result:any) =>{
     // let res = JSON.parse(result);
     console.log(result);
      let Rkey = atob(result.Secretkey);
      Rkey = Rkey.substring(0,Rkey.length - 4);
      this.key = Rkey;
      this.loginmodel._ClientId = result.ClientID;
     // alert(this.key);
    },
      (error:HttpErrorResponse)=>{
        //this._mesgBox.showError(error.message);
        this._mesgBox.showError("Something went wrong");
      });
  }

  NoInvalidCharacters(control: AbstractControl): {[key: string]: any} | null  {
    var format = /[<>'"&]/;
    if (control.value && format.test(control.value) || (control.value && control.value.includes("%3e"))) {
      return { 'invalidservices': true };
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

 

   stringtobytes(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  GetToken(loginmodel)
  {
    this._loginservice.GetToken(loginmodel).subscribe(Result=>{
      console.log(Result);
      if (Result=="Authorised")
      {
        this.router.navigate(['/DealHUB/dashboard']);
      }
      
    });
  }
  onFormSubmit()
  {
    if(this.loginvalid.valid){
    if(this.loginvalid.get('Password').value != "" && this.loginvalid.get('userID').value != "")
    {
      this.disablebutton=true;
      let midstr = atob(this.midval);
      //this.key = midstr;
      let salt = CryptoJS.lib.WordArray.random(128 / 8);
      let ivsalt = CryptoJS.lib.WordArray.random(128 / 8);
      // let encryptedpwd = this.setEncryption(midstr,this.loginvalid.get('Password').value);
      // this.loginvalid.get('Password').setValue(salt+ivsalt+encryptedpwd);
  
      //below code is working fine, but commented to show changes in obf
       let encryptedpwd="";
     // alert(this.key);
       encryptedpwd = this.setEncryption(this.key,this.loginvalid.get('Password').value);

       this.loginvalid.get('Password').setValue(encryptedpwd);
       console.log("check pwd");
       console.log(this.loginvalid.get('Password').value);
  
      this.loginmodel._user_code=this.loginvalid.get('userID').value;
     // this.loginmodel._SecretKey = this.key;
      this.loginmodel._attempt = "1";
      this.loginmodel._password=this.loginvalid.get('Password').value;
      this.RememberMe = this.loginvalid.get('RememberMe').value;
  
      this._loginservice.getLoginDetails(this.loginmodel).subscribe(Result=>{
        console.log(Result);
        var loginresult =Result;
      this.disablebutton=false;
      if(loginresult.hasOwnProperty("user")){
        if(this.RememberMe)
        {
          localStorage.setItem("UserName",Result.user.UserName);
          localStorage.setItem("Token",Result.user.Api_Key);
          localStorage.setItem("rememberCurrentUser","true");
        
         }
        else
        {
          localStorage.setItem("UserName",Result.user.UserName);
          localStorage.setItem("Token",Result.user.Api_Key);
          localStorage.setItem("rememberCurrentUser","false");

        }
        localStorage.setItem("UserCode",Result.user.UserCode);
        localStorage.setItem("privilege_name",Result.user.privilege_name);
        localStorage.setItem("userToken",Result.user.Api_Key);
        localStorage.setItem("role_name",Result.user.role_name);
        localStorage.setItem("UserName",Result.user.UserName);
        localStorage.setItem("User_Id",Result.user.UserId);
        localStorage.setItem("RequestId",Result.user.AntiforgeryKey);
        console.log(Result.user.UserName);
        
        
        //alert("Login Sucess");
        this.router.navigate(['/DealHUB/dashboard']);
       
        
        this._mesgBox.showSucess("Login Sucess.");
      }
      else
      {
        this._mesgBox.showError("Login Failed.");
      }
       
      },
      (error:HttpErrorResponse)=>{
        this.disablebutton=false;
        let res = error.error.Record.MESSAGE;
        if(error.status == 401)
        {
          //this._mesgBox.showError("Please Enter Correct Login ID Or Password");
          this.loginmodel._attempt =  (parseInt(this.loginmodel._attempt) +1).toString();
          this._mesgBox.showError(res);
          this.getClientKey();
        }
        if(error.status !=0)
        {
          if(error.error.Record.MESSAGE == "Invalid Password Entered")
          {
            this._mesgBox.showError("Please Enter Correct Login ID Or Password");
          }
        }
       else
        { 
           this._mesgBox.showError(error.message);
          }
           this.loginvalid.get("userID").setValue("");
           this.loginvalid.get("Password").setValue("");
         return false;
        }
        
      );
    }
    else
    {
      this._mesgBox.showError("Please Enter Correct Login ID Or Password");
    }
  }
   
  }
  
  LostPass(event)
  {
    event.preventDefault();
    this.ResetPass=true;
  }
  GetEmail()
  {
    if(this.ResetPasswordForm.get('ResetPasswordUserid').value != "" )
    {
      this.loginmodel._user_code=this.ResetPasswordForm.get('ResetPasswordUserid').value;
      //this._loginservice.usercode = this.ResetPasswordForm.get('ResetPasswordUserid').value;
      localStorage.setItem("ResetUC",this.ResetPasswordForm.get('ResetPasswordUserid').value);
      this.loginmodel._password=this.loginvalid.get('Password').value;
      this._loginservice.sendemail(this.loginmodel).subscribe(Result=>{
        this._mesgBox.showSucess("Email send.");
       
      });
    }
    else{
      this._mesgBox.showError("Please Enter UserCode.");
    }
   
  }
  // getErrorMessage() {
  //   if (this.email.hasError('required')) {
  //     return 'You must enter a value';
  //   }

  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }

  public checkError = (controlName: string, errorName: string) => {
    return this.loginvalid.controls[controlName].hasError(errorName);
  }
  public checkResetError = (controlName: string, errorName: string) => {
    return this.ResetPasswordForm.controls[controlName].hasError(errorName);
  }

  // <mat-error *ngIf="checkError('Password', 'Invalid')">Invalid Characters</mat-error>
                   
  // error:boolean=false;
  //  // Only AlphaNumeric with Some Characters [-_ ]
  //  keyPress(event) {

  //   var inp = String.fromCharCode(event.keyCode);
  //   // Allow numbers, alpahbets, space, underscore
  //   if (/[& (-_  ) # !]/.test(inp)) {
  //     return this.checkError("Password","Invalid");
     
  //   } 
  // }
  lostPass()
  {
    this.log_in = false;
    this.lost_pass = true;
  }
  relogin()
  {
    this.log_in = true;
    this.lost_pass = false;
  }
}

