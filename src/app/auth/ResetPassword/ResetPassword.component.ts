import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm} from '@angular/forms';
import { loginservices } from '../login/LoginServices';
import {ActivatedRoute, Router} from "@angular/router"
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorStateMatcher } from '@angular/material/core';
import { MessageBoxComponent } from 'src/app/shared/MessageBox/MessageBox.Component';
import { CommonService } from 'src/app/services/common.service';

//region model
export class LoginModel
{
  _user_code:string;
  _password:string;
  _token:string;
  _ClientId:string;
  _SecretKey:string;
  _CurrentPassword?:string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control.touched && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);

    return invalidCtrl || invalidParent;
  }
}
//endregion

@Component({
    selector: 'app-ResetPassword',
    templateUrl: './ResetPassword.component.html',
    styleUrls: ['./ResetPassword.component.scss']
  })
  export class ResetPassword implements OnInit
  {
    public loginvalid: FormGroup;
    loginmodel:LoginModel=new LoginModel();
    matcher = new MyErrorStateMatcher();
    Usercode:string;
    key:string = "";
    // NewPassword:string;
    // confirmpassword:string;
    constructor(private route:ActivatedRoute, private formbuilder:FormBuilder, 
        private _loginservice:loginservices,private router: Router,private _mesgBox: MessageBoxComponent,public commonService:CommonService) { }
       
    
      ngOnInit(): void {
        this.loginvalid = new FormGroup({
     
            NewPassword : new FormControl('', [Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}'),this.commonService.NoInvalidCharacters]),
            confirmpassword : new FormControl('')
          }, { validators: this.checkPasswords });
          this.getClientKey();
          this.loginvalid.controls.NewPassword.setValue("");
    this.loginvalid.controls.confirmpassword.setValue("");
          this.loginvalid.controls["NewPassword"].markAsPristine();
          this.loginvalid.controls["confirmpassword"].markAsPristine();
          this.loginvalid.controls["NewPassword"].markAsUntouched();
    this.loginvalid.controls["confirmpassword"].markAsUntouched();
    //this.loginvalid.reset();
      }
      getClientKey()
      {
    this._loginservice.getClientKey().subscribe(result =>{
     // let res = JSON.parse(result);
     console.log(result);
      let Rkey = atob(result.Secretkey);
      Rkey = Rkey.substring(0,Rkey.length - 4);
      this.key = Rkey;
      this.loginmodel._ClientId = result.ClientID;

      this.loginvalid.controls.NewPassword.setValue("");
      this.loginvalid.controls.confirmpassword.setValue("");
            this.loginvalid.controls["NewPassword"].markAsPristine();
            this.loginvalid.controls["confirmpassword"].markAsPristine();
            this.loginvalid.controls["NewPassword"].markAsUntouched();
      this.loginvalid.controls["confirmpassword"].markAsUntouched();
     // alert(this.key);
    },
      (error:HttpErrorResponse)=>{
        this._mesgBox.showError(error.message);
      });
     }

      checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        const password = group.get('NewPassword').value;
        const confirmPassword = group.get('confirmpassword').value;
      
        return password === confirmPassword ? null : { notSame: true }     
      }

      ResetPassword()
      {
        // this.route.queryParams.subscribe(event=>{
        //   this.Usercode=event['Usercode'];
        // })
        let encryptedpwd="";
        let encryptedusercode = "";
        // alert(this.key);
          encryptedpwd = this.commonService.setEncryption(this.key,this.loginvalid.get('NewPassword').value);
          this.loginvalid.get('NewPassword').setValue(encryptedpwd);
          this.loginvalid.get('confirmpassword').setValue(encryptedpwd);
          encryptedusercode = this.commonService.setEncryption(this.key,localStorage.getItem("ResetUC"));
         // this.loginmodel._SecretKey = this.key;
        // this.Usercode =localStorage.getItem("ResetUC");
        this.Usercode =encryptedusercode;
        this.loginmodel._user_code=this.Usercode;
        this.loginmodel._password=this.loginvalid.get('confirmpassword').value;
        
         
        this._loginservice.ResetPassword(this.loginmodel).subscribe(Result=>{
         // alert("Password Changed Successfully.");
         this._mesgBox.showSucess("Password Changed Successfully.");
         this.router.navigateByUrl('/login');
         
        });
      }
      public checkError = (controlName: string, errorName: string) => {
        return this.loginvalid.controls[controlName].hasError(errorName);
      }
      
  }