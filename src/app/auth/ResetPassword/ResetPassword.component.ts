import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm} from '@angular/forms';
import { loginservices } from '../login/LoginServices';
import {ActivatedRoute, Router} from "@angular/router"
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorStateMatcher } from '@angular/material/core';
import { MessageBoxComponent } from 'src/app/shared/MessageBox/MessageBox.Component';

//region model
export class LoginModel
{
  _user_code:string;
  _password:string;
  _token:string;
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
    // NewPassword:string;
    // confirmpassword:string;
    constructor(private route:ActivatedRoute, private formbuilder:FormBuilder, 
        private _loginservice:loginservices,private router: Router,private _mesgBox: MessageBoxComponent) { }
    
    
      ngOnInit(): void {
        this.loginvalid = new FormGroup({
     
            NewPassword : new FormControl('', [Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
            confirmpassword : new FormControl('')
          }, { validators: this.checkPasswords });
      }
      checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        const password = group.get('NewPassword').value;
        const confirmPassword = group.get('confirmpassword').value;
      
        return password === confirmPassword ? null : { notSame: true }     
      }

      ResetPassword()
      {
        this.route.queryParams.subscribe(event=>{
          this.Usercode=event['Usercode'];
        })
        this.Usercode =localStorage.getItem("ResetUC");
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