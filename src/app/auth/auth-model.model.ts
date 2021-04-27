import { tokenize } from "@angular/compiler/src/ml_parser/lexer"

export class LoginCred {
  constructor(public username: string,private _token:string,public companyname:string,public companycode:string)
  {
      
  }

  get token(){
     if(this._token != null)
     {
        return this._token;
     }
     return null;
  }
}
