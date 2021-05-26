import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Router} from "@angular/router";

export interface SAPIO {
  _Cust_SAP_IO_Number: number;
}

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
  _sap_customer_code:string;
  sapio:SAPIO[] = [];
  _dh_comment:string;
}

class obfsummary{
  
  solutionDetails:solutionDetails[];
  uploadDetails:uploadDetails[];
  AttachmentDetails:AttachmentDetails[];
}

class uploadDetails{
  Loi_po_Details:string;
  OBFFilepath:string;
  VerticalHeadName:string;
  Vertical_name:string;
  assumptions_and_risks:string;
  capex:number;
  customer_name:string;
  dh_code:string;
  dh_desc:string;
  dh_id:number;
  dh_header_id:number;
  dh_location:string;
  dh_project_name:string;
  ebt:number;
  irr_borrowed_fund:number;
  irr_surplus_cash:number;
  is_loi_po_uploaded:string;
  opportunity_id:string;
  payment_terms:number;
  sap_customer_code:string;
  sector_name:string;
  subsector_name:string;
  total_cost:number;
  total_margin:number;
  total_project_life:string;
  total_revenue:number;
  created_on:Date;
  Version_name:string;
  solutioncategory_name:string;
  payment_term_desc:string;
}

class solutionDetails
{
  solution_name:string;
  solutioncategory_name:string;
  tablename:string;
}

class AttachmentDetails
{
  description:string;
  filename:string;
  filepath:string;
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
  _customer_name:string;
  _sap_customer_code:string;
  sapio:SAPIO[] = [];
  _dh_comment:string ;
  _solution_category_id:number;
  _loi_po_details:string;
  _payment_term_desc:string;
}

class editObf{
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
  _payment_terms:number;
  _Sector_Id:number;
  _SubSector_Id:number;
  Attachments:SaveAttachmentParameter[] = [];
  Services:SaveServiceParameter[] =[];
  _customer_name:string;
  _sap_customer_code:string;
  sapio:SAPIO[] = [];
  _dh_comment:string ;
  _solution_category_id:number;
  _loi_po_details:string;
  _payment_term_desc:string;
}
 class approveRejectModel
{
    isapproved: number;
    rejectcomment :string;
    rejectionto:number;
    _dh_id:number;
    _dh_header_id:number;
    _fname:string;
    _fpath:string;
    _created_by:string;
  }

@Injectable({
  providedIn: 'root'
})


export class OBFServices {

  constructor(private http:HttpClient,private router: Router) { }
 
  obfmodel:obf = new obf();
  _approveRejectModel:approveRejectModel=new approveRejectModel();
  obfsummarymodel:obfsummary = new obfsummary();
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
    Otherservicesandcategories:new FormControl(null),
    Opportunityid:new FormControl("",Validators.required),
    State:new FormControl("",Validators.required),
    Vertical:new FormControl("",Validators.required),
    Verticalhead:new FormControl("",Validators.required),
    Createddate:new FormControl(""),
    Sapio:new FormControl(null,[this.SIOnumbervalidate]),
    Customername:new FormControl("",Validators.required),
    Sapcustomercode:new FormControl("",[this.NoSpecialCharacters]),
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
    Payment_Terms_description:new FormControl("",Validators.required),
    Loipo:new FormControl("",Validators.required),
    otherservices:new FormControl({value:"",disabled:true},[this.NoSpecialCharacters]),
    othersolutions:new FormControl({value:"",disabled:true},[this.NoSpecialCharacters]),
    otherintegratedsolutions:new FormControl({value:"",disabled:true},[this.NoSpecialCharacters]),
    comments:new FormControl("")
   });

   GetCreateOBFMasters(usercode: string): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}),params: new HttpParams().set('userid', usercode) };  
    return this.http.get<any>(environment.apiUrl+"Api/Manage_OBF/GetMasterOBF",  
       httpOptions);  
  }

  getsolutionmaster(usercode: string): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}),params: new HttpParams().set('userid', usercode) };  
    return this.http.get<any>(environment.apiUrl+"Api/Manage_OBF/getmastersolutions",  
       httpOptions);  
  }

  createobf(model:obf): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}) };  
    return this.http.post<any>(environment.apiUrl+"Api/Manage_OBF/CreateOBF",model ,
       httpOptions);  
  }

  savesolutionandservices(model:obfsolutionandservices): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}) };  
    return this.http.post<any>(environment.apiUrl+"Api/Manage_OBF/SaveServiceSolutionSector",model ,
       httpOptions);  
  }

  SubmitOBF(model:obfsubmit): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}) };  
    return this.http.post<any>(environment.apiUrl+"Api/Manage_OBF/SubmitOBF",model ,
       httpOptions);  
  }

   SIOnumbervalidate(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value && control.value.length != 8) {
      return { 'Sionumberinvalid': true };
    }
    return null;
  }

  NoSpecialCharacters(control: AbstractControl): {[key: string]: any} | null  {
    var format = /[^a-zA-z0-9 ]/;
    if (control.value && format.test(control.value)) {
      return { 'invalidservices': true };
    }
    return null;
  }

  getobfsummarydata(dh_id:number): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}),params: new HttpParams().set('dh_id', dh_id.toString()) };  
    return this.http.get<any>(environment.apiUrl+"Api/DashBoard/GetOBFSummaryDetails",
       httpOptions);  
       
  }
  initializeobf(data:any)
  {
    console.log(data);
    this.obfsummarymodel.uploadDetails = data.uploadDetails;
    this.obfsummarymodel.solutionDetails = data.solutionDetails;
    this.obfsummarymodel.AttachmentDetails = data.AttachmentDetails;

    //this.Obfsummarysubject.next(this.obfsummarymodel);
   

    console.log("check data after transformation");
    console.log(this.obfsummarymodel);


   // this.router.navigate(['/DealHUB/dashboard/OBFSummary']);
    
     }
      // getobfsummarydataonRefresh(): Observable<any>
      // {
      //   return this.Obfsummarysubject.asObservable();
      // }
      ApproveRejectObf(data:approveRejectModel): Observable<any> 
      {
        const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}) };  
        return this.http.post<any>(environment.apiUrl+"Api/Manage_OBF/ApproveRejectObf",data,
           httpOptions); 
      }
      SaveAttachment(data:SaveAttachmentParameter[]):Observable<any>
      {
        const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}) };  
        return this.http.post<any>(environment.apiUrl+"Api/Manage_OBF/SaveAttachmentDetails",data,
           httpOptions); 
      }
      GetDetailTimelineHistory(dh_id:number,dh_header_id:number):Observable<any>
      {
        const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}),
        params: new HttpParams().set('dh_id', dh_id.toString())
        .set('dh_header_id',dh_header_id.toString()) };  
        return this.http.get<any>(environment.apiUrl+"Api/DashBoard/GetDetailTimelineHistory",
           httpOptions);  
      }
}

