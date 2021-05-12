import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
import { loginservices } from './LoginServices';
import {Router} from "@angular/router"
import { HttpErrorResponse } from '@angular/common/http';
import {MessageBoxComponent} from '../../shared/MessageBox/MessageBox.Component';
import { Action } from 'rxjs/internal/scheduler/Action';
//region model
export class LoginModel
{
  _user_code:string;
  _password:string;
  _token:string;
  privilege_name:string;
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
  constructor(private formbuilder:FormBuilder, 
    private _loginservice:loginservices,private router: Router,private _mesgBox: MessageBoxComponent) { }


  ngOnInit(): void {
    // sample comment
    this.loginvalid = new FormGroup({
     
      userID : new FormControl('', [Validators.required]),
      Password : new FormControl('', [Validators.required]),
      RememberMe:new FormControl("")
    });
    this.ResetPasswordForm=new FormGroup({

      ResetPasswordUserid:new FormControl('',[Validators.required])
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
    this.loginmodel._user_code=this.loginvalid.get('userID').value;
    this.loginmodel._password=this.loginvalid.get('Password').value;
    this.RememberMe = this.loginvalid.get('RememberMe').value;

    this._loginservice.getLoginDetails(this.loginmodel).subscribe(Result=>{
      console.log(Result);
      var loginresult =Result;

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
      sessionStorage.setItem("privilege_name",Result.user.privilege_name);
      localStorage.setItem("userToken",Result.user.Api_Key);
      
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
     this._mesgBox.showError(error.message);
     
      
    }
    );
  }
  
  LostPass(event)
  {
    event.preventDefault();
    this.ResetPass=true;
  }
  GetEmail()
  {
    this.loginmodel._user_code=this.loginvalid.get('userID').value;
    this.loginmodel._password=this.loginvalid.get('Password').value;
    this._loginservice.sendemail(this.loginmodel).subscribe(Result=>{
      alert("Email Send.");
     
    });
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

