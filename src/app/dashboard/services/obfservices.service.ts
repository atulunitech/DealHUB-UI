import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

class SaveAttachmentParameter{
  _dh_id:number;
  _dh_header_id:number;
  _fname:string;
  _fpath:string;
  _created_by:string;
  _description:string;
}

class Serviceslist{
  value:string;
  viewValue:string;
}

class SaveServiceParameter{
  Solutioncategory:string;
  value:string;
  Serviceslist:Serviceslist[] = [];
}

// class elementcls
// {
//    value:string;
//    viewValue:string;
   
// }
// class objectlist
// {solutioncategory:string;
//  value:string;
//   Servicelist:elementcls[] = [];
// }
class obfsubmit
{
  _dh_id:number;
  _dh_header_id:number;
  _fname:string;
  _fpath:string;
  _created_by:string;
  _active:string;
  _is_submitted:number;
}

class obfsolutionandservices
{
  _dh_id:number;
  _dh_header_id:number;
  _fname:string;
  _fpath:string;
  _created_by:string;
  Services:SaveServiceParameter[] =[];
  _Sector_Id:number;
  _SubSector_Id:number;
}


class obf{
  _dh_id:number;
  _dh_header_id:number;
  _fname:string;
  _fpath:string;
  _created_by:string;
  _dh_project_name:string;
  _opportunity_id:string;
  _dh_location:string;
  _vertical_id:number;
  _verticalhead_id:number;
  _dh_desc:string;
  _dh_phase_id:number;
  _parent_dh_main_id:number;
  _total_revenue:number;
  _total_cost:number;
  _total_margin:number;
  _total_project_life:string;
  _irr_surplus_cash:number;
  _ebt:number;
  _capex:number;
  _irr_borrowed_fund:number;
  _is_loi_po_uploaded:string;
  _assumptions_and_risks:string;
  _active:string;
  _status:string;
  _is_saved:number;
  _is_submitted:number;
  _service_category:string;
  _payment_terms:number;
  _mode:string;
  _Sector_Id:number;
  _SubSector_Id:number;
  save_with_solution_sector:string;
  Attachments:SaveAttachmentParameter[] = [];
  Services:SaveServiceParameter[] =[];
  _SubmitOBFParameters:obfsubmit[]=[];
}

@Injectable({
  providedIn: 'root'
})


export class OBFServices {

  constructor(private http:HttpClient) { }
  obfmodel:obf = new obf();
  obfsumbitmodel:obfsubmit = new obfsubmit();
  obfsolutionandservices:obfsolutionandservices = new obfsolutionandservices();
  SaveAttachmentParameter:SaveAttachmentParameter = new SaveAttachmentParameter();
  ObfCreateForm = new FormGroup({
    coversheet : new FormControl("",Validators.required),
    Loiposheet : new FormControl("",Validators.required),
    Supportpath : new FormControl(""),
    Loipodropdown: new FormControl("PO"),
    Selfdeclare: new FormControl(""),
    Projectname:new FormControl("",Validators.required),
    Projecttype:new FormControl(""),
    Solutioncategory:new FormControl(""),
    Otherservicesandcategories:new FormControl(""),
    Opportunityid:new FormControl("",Validators.required),
    State:new FormControl("",Validators.required),
    Vertical:new FormControl("",Validators.required),
    Verticalhead:new FormControl("",Validators.required),
    Createddate:new FormControl(""),
    Sapio:new FormControl(""),
    Customername:new FormControl("",Validators.required),
    Sapcustomercode:new FormControl(""),
    Projectprimarylocation:new FormControl(""),
    Solutiontype:new FormControl(""),
    Sector:new FormControl(""),
    Subsector:new FormControl(""),
    Totalrevenue:new FormControl("",Validators.required),
    Totalcost:new FormControl("",Validators.required),
    Totalmargin:new FormControl("",Validators.required),
    Totalprojectlife:new FormControl("",Validators.required),
    EBT:new FormControl(""),
    Capex:new FormControl("",Validators.required),
    IRRsurpluscash:new FormControl(""),
    IRRborrowedfund:new FormControl(""),
    Paymentterms:new FormControl("",Validators.required),
    Projectdate:new FormControl(""),
    Projectbrief:new FormControl("",Validators.required),
    Assumptionrisks:new FormControl("",Validators.required),
    Loipo:new FormControl("",Validators.required),
    otherservices:new FormControl({value:"",disabled:true}),
    othersolutions:new FormControl({value:"",disabled:true}),
    otherintegratedsolutions:new FormControl({value:"",disabled:true}),
    comments:new FormControl("")
   });

   GetCreateOBFMasters(usercode: string): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}),params: new HttpParams().set('userid', usercode) };  
    return this.http.get<any>("http://localhost:52229/Api/Manage_OBF/GetMasterOBF",  
       httpOptions);  
  }

  getsolutionmaster(): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}) };  
    return this.http.get<any>("http://localhost:52229/Api/Manage_OBF/getmastersolutions",  
       httpOptions);  
  }

  createobf(model:obf): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}) };  
    return this.http.post<any>("http://localhost:52229/Api/Manage_OBF/CreateOBF",model ,
       httpOptions);  
  }

  savesolutionandservices(model:obfsolutionandservices): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}) };  
    return this.http.post<any>("http://localhost:52229/Api/Manage_OBF/SaveServiceSolutionSector",model ,
       httpOptions);  
  }

  SubmitOBF(model:obfsubmit): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}) };  
    return this.http.post<any>("http://localhost:52229/Api/Manage_OBF/SubmitOBF",model ,
       httpOptions);  
  }
}
