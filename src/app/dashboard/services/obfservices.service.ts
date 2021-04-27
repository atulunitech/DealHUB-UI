import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OBFServices {

  constructor() { }

  ObfCreateForm = new FormGroup({
    coversheet : new FormControl("",Validators.required),
    Loiposheet : new FormControl("",Validators.required),
    Supportpath : new FormControl(""),
    Loipodropdown: new FormControl("PO"),
    Selfdeclare: new FormControl(""),
    Projectname:new FormControl(""),
    Projecttype:new FormControl(""),
    Opportunityid:new FormControl(""),
    State:new FormControl(""),
    Vertical:new FormControl(""),
    Verticalhead:new FormControl(""),
    Createddate:new FormControl(""),
    Sapio:new FormControl(""),
    Customername:new FormControl(""),
    Sapcustomercode:new FormControl(""),
    Projectprimarylocation:new FormControl(""),
    Solutiontype:new FormControl(""),
    Sector:new FormControl(""),
    Subsector:new FormControl(""),
    Totalrevenue:new FormControl(""),
    Totalcost:new FormControl(""),
    Totalmargin:new FormControl(""),
    Totalprojectlife:new FormControl(""),
    EBT:new FormControl(""),
    Capex:new FormControl(""),
    IRRsurpluscash:new FormControl(""),
    IRRborrowedfund:new FormControl(""),
    Paymentterms:new FormControl(""),
    Projectdate:new FormControl(""),
    Projectbrief:new FormControl(""),
    Assumptionrisks:new FormControl(""),
    Loipo:new FormControl(""),
    comments:new FormControl("")
   });
}
