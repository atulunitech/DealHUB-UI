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

export class editobfarguement
{
  dh_id:number;
  dh_header_id:number;
  user_code:string;
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
class PPl_details
{
  PPL_dh_id:number;
  tablename:string;
}
class obfsummary{
  
  solutionDetails:solutionDetails[];
  uploadDetails:uploadDetails[];
  AttachmentDetails:AttachmentDetails[];
  CommentDetails:CommentDetails[];
  VersionDetails:VersionDetails[];
  servicelist:solutionservicelist[];
  PPl_details:PPl_details[];
  SAPdetail:SAPdetail[];

}
class solutionservicelist
{
  solutioncategory_name:string;
  solution_name:string;

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
  sap_customer_code:number;
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
  exceptionalcase_cfo:number;
  exceptioncase_ceo:number;
  marginal_exception_requested:number;
  exceptionalcase_cfo_updatedby:string;
  exceptionalcase_ceo_updatedby:string;
  Cust_SAP_IO_Number:number;
  is_latest_version:number;
  phase_code:string;
  parent_dh_main_id:number;
  ppl_init:number;
  ppl_status:string;
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
class CommentDetails
{
  Fullname:string;
  Role_name:string;
  dh_comment:string;
  commented_on:string;
  Version_name:string;
  Status:string;
  role_code:string;
  Initials:string;
}
class VersionDetails{
  Version_name:number;
  dh_header_id:number;
  dh_id:number;
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

// class previousobf{
//   _dh_id:number;
//   _dh_header_id:number; 
//   _total_revenue:number;
//   _total_cost:number;
//   _total_margin:number;
//   _total_project_life:string;
//   _irr_surplus_cash:number;
//   _ebt:number;
//   _capex:number;
//   _irr_borrowed_fund:number;
//   _payment_terms:number;
// }
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
  _parent_dh_main_id:number;
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
    exceptionalcase_cfo:number;
    exceptioncase_ceo:number;
    _marginal_exception_requested:number;
    is_on_hold:number;

  }
class SAPdetail
{
  cust_sap_io_number:string;
  tablename:string;
}
@Injectable({
  providedIn: 'root'
})


export class OBFServices {

  constructor(private http:HttpClient,private router: Router) { }
 
  obfmodel:obf;
 // previousobfmodel:previousobf;
  servicesarray:any[] = [];
  _approveRejectModel:approveRejectModel=new approveRejectModel();
  obfsummarymodel:obfsummary = new obfsummary();
  obfsumbitmodel:obfsubmit = new obfsubmit();
  editObfObject:editObf;
  obfsolutionandservices:obfsolutionandservices = new obfsolutionandservices();
  SaveAttachmentParameter:SaveAttachmentParameter = new SaveAttachmentParameter();
  ObfCreateForm:FormGroup;

  createnewobfmodelandeditobfmodel()
  {
    this.obfmodel = new obf();
    this.editObfObject = new editObf();
   // this.previousobfmodel = new previousobf();
    this.servicesarray = [];
  }

   createform()
   {
    this.ObfCreateForm = new FormGroup({
      coversheet : new FormControl("",Validators.required),
      Loiposheet : new FormControl("",Validators.required),
      Supportpath : new FormControl(""),
      Loipodropdown: new FormControl(""),
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
      Sapcustomercode:new FormControl("",[this.NoSpecialCharacters,this.SIOnumbervalidate]),
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
   }
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

  editsapcustcode_and_io(model:obf): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}) };  
    return this.http.post<any>(environment.apiUrl+"Api/Manage_OBF/EditCustomerCodeandIo",model ,
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
    if (control.value && control.value.toString().length != 8) {
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
  GetOBFSummaryDataVersionWise(dh_id:number,dh_header_id:number): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}),
    params: new HttpParams().set('dh_id', dh_id.toString())
    .set('dh_header_id',dh_header_id.toString()) };  
    return this.http.get<any>(environment.apiUrl+"Api/Manage_OBF/GetOBFSummaryDataVersionWise",
       httpOptions);  
       
  }
  geteditobfdata(editobf:editobfarguement): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'})};  
    return this.http.post<any>(environment.apiUrl+"Api/Manage_OBF/geteditobfdata",editobf,
       httpOptions);  
       
  }

  initializeobf(data:any)
  {
    console.log(data);
    this.obfsummarymodel.uploadDetails = data.uploadDetails;
    this.obfsummarymodel.solutionDetails = data.solutionDetails;
    this.obfsummarymodel.AttachmentDetails = data.AttachmentDetails;
    this.obfsummarymodel.CommentDetails=data.CommentDetails;
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
        const httpOptions = { headers: new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json'}) 
        };  
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
        coversheetarray:any[] = [];
        loipoarray:any[] = [];
        supportarray:any[] = [];
       getarrayforlipo(input) {
        var output = [];
        for (var i=0; i < input.length ; ++i)
        {
            if(input[i]._description == "PO" || input[i]._description == "LOI" || input[i]._description == "Agreement")
            {
              output.push(input[i]);
            }
        }
        return output;
    }

    getarrayforsupport(input) {
      var output = [];
      for (var i=0; i < input.length ; ++i)
      {
          if(input[i]._description == "support")
          {
            output.push(input[i]);
          }
      }
      return output;
  }

  
      initializeobfmodelandform()
      {
        this.coversheetarray = [];
        this.loipoarray= [];
        this.supportarray = [];
        this.obfmodel._dh_id = this.editObfObject._dh_id;
        this.obfmodel._dh_header_id = this.editObfObject._dh_header_id;
        this.obfmodel._fname = this.editObfObject._fname;
        this.obfmodel._fpath = this.editObfObject._fpath;
        this.obfmodel._created_by = this.editObfObject._created_by;
        this.obfmodel._dh_project_name = this.editObfObject._dh_project_name;
        this.obfmodel._opportunity_id = this.editObfObject._opportunity_id;
        this.obfmodel._dh_location = this.editObfObject._dh_location;
        this.obfmodel._vertical_id = this.editObfObject._vertical_id;
        this.obfmodel._verticalhead_id = this.editObfObject._verticalhead_id;
        this.obfmodel._dh_desc = this.editObfObject._dh_desc;
        this.obfmodel._parent_dh_main_id = this.editObfObject._parent_dh_main_id;
        this.obfmodel._total_revenue = this.editObfObject._total_revenue;
        this.obfmodel._total_cost = this.editObfObject._total_cost;
        this.obfmodel._total_margin = this.editObfObject._total_margin;
        this.obfmodel._total_project_life = this.editObfObject._total_project_life;
        this.obfmodel._irr_surplus_cash = this.editObfObject._irr_surplus_cash;
        this.obfmodel._ebt = this.editObfObject._ebt;
        this.obfmodel._capex = this.editObfObject._capex;
        this.obfmodel._irr_borrowed_fund = this.editObfObject._irr_borrowed_fund;
        this.obfmodel._is_loi_po_uploaded = this.editObfObject._is_loi_po_uploaded;
        this.obfmodel._assumptions_and_risks = this.editObfObject._assumptions_and_risks;
        this.obfmodel._payment_terms = this.editObfObject._payment_terms;
        this.obfmodel._Sector_Id = this.editObfObject._Sector_Id;
        this.obfmodel._SubSector_Id = this.editObfObject._SubSector_Id;
        this.obfmodel.Attachments = this.editObfObject.Attachments;
        this.obfmodel.Services = this.editObfObject.Services;
        this.obfmodel._customer_name = this.editObfObject._customer_name;
        this.obfmodel._sap_customer_code = this.editObfObject._sap_customer_code;
        this.obfmodel.sapio = this.editObfObject.sapio;
        this.obfmodel._dh_comment = this.editObfObject._dh_comment;
        this.obfmodel._solution_category_id = this.editObfObject._solution_category_id;
        this.obfmodel._loi_po_details = this.editObfObject._loi_po_details;
        this.obfmodel._payment_term_desc = this.editObfObject._payment_term_desc;
          
        this.coversheetarray.push({_fname:this.editObfObject._fname,_fpath:this.editObfObject._fpath});
        let loiuploaded = null;
        if(this.editObfObject._is_loi_po_uploaded == "Y")
        {
          loiuploaded = null;
        }
        else
        {
          loiuploaded = this.editObfObject._is_loi_po_uploaded;
        }
         
        for(var i =0;i< this.editObfObject.Services.length;i++)
        {
            for(var j =0;j< this.editObfObject.Services[i].Serviceslist.length;j++)
            {
              this.servicesarray.push(this.editObfObject.Services[i].Serviceslist[j].value)
            }
        }
        
        this.loipoarray = this.getarrayforlipo(this.editObfObject.Attachments);
        this.supportarray = this.getarrayforsupport(this.editObfObject.Attachments); 
        this.ObfCreateForm.patchValue({
          coversheet :this.obfmodel._fpath,
          Loiposheet:this.loipoarray[0] != undefined ?this.loipoarray[0]._fpath:"",
          Supportpath:this.supportarray != undefined?this.supportarray:"",
          Loipodropdown:this.loipoarray[0] !=undefined?this.loipoarray[0]._description:null,
          Selfdeclare:loiuploaded,
          Projectname:this.editObfObject._dh_project_name,
          Solutioncategory:this.editObfObject._solution_category_id.toString() == "0"?"":this.editObfObject._solution_category_id.toString(),
          Opportunityid: this.editObfObject._opportunity_id,
          State: this.editObfObject._dh_location,
          Vertical:this.editObfObject._vertical_id,
          Verticalhead:this.editObfObject._verticalhead_id,
          Sapio:null,
          Customername:this.editObfObject._customer_name,
          Sapcustomercode:this.editObfObject._sap_customer_code,
          Sector:this.editObfObject._Sector_Id == 0?"":this.editObfObject._Sector_Id,
          Subsector:this.editObfObject._SubSector_Id == 0?"":this.editObfObject._SubSector_Id,
          Totalrevenue:this.editObfObject._total_revenue,
          Totalcost:this.editObfObject._total_cost,
          Totalmargin:this.editObfObject._total_margin,
          Totalprojectlife:this.editObfObject._total_project_life,
          EBT:this.editObfObject._ebt,
          Capex:this.editObfObject._capex,
          IRRsurpluscash:this.editObfObject._irr_surplus_cash,
          IRRborrowedfund:this.editObfObject._irr_borrowed_fund,
          Paymentterms:this.editObfObject._payment_terms,
          Projectbrief:this.editObfObject._dh_desc,
          Assumptionrisks:this.editObfObject._assumptions_and_risks,
          Payment_Terms_description:this.editObfObject._payment_term_desc,
          Loipo:this.editObfObject._loi_po_details,
          comments:this.editObfObject._dh_comment
        


        });
        this.getotherservicesandsolutions();
      }

      emptyexcelformvaluesforreuploadcoversheet()
      {
        this.ObfCreateForm.patchValue({Projectname: ""});
        this.ObfCreateForm.patchValue({Customername: ""});
        this.ObfCreateForm.patchValue({Opportunityid: ""});
        this.ObfCreateForm.patchValue({State: ""});
        this.ObfCreateForm.patchValue({Vertical: ""});
        this.ObfCreateForm.patchValue({Verticalhead: ""});
        this.ObfCreateForm.patchValue({Projectbrief: ""});
        this.ObfCreateForm.patchValue({Totalrevenue: ""});
        this.ObfCreateForm.patchValue({Totalcost: ""});
        this.ObfCreateForm.patchValue({Totalmargin: ""});
        this.ObfCreateForm.patchValue({Totalprojectlife: ""});
        this.ObfCreateForm.patchValue({IRRsurpluscash: ""});
        this.ObfCreateForm.patchValue({EBT: ""});
        this.ObfCreateForm.patchValue({Capex: ""});
        this.ObfCreateForm.patchValue({IRRborrowedfund: ""});
        this.ObfCreateForm.patchValue({Paymentterms: ""});
        this.ObfCreateForm.patchValue({Payment_Terms_description: ""});
        this.ObfCreateForm.patchValue({Assumptionrisks: ""});
        this.ObfCreateForm.patchValue({Loipo: ""});
      }

      getotherservicesandsolutions(){
        this.obfmodel.Services.forEach(obj =>{
             obj.Serviceslist.forEach(val =>{
                 if(obj.value == "1" && val.value=="0")
                 {
                   this.ObfCreateForm.patchValue({otherservices:val.viewValue});
                   this.ObfCreateForm.controls['otherservices'].enable();
                 }
                 if(obj.value == "2" && val.value=="0")
                 {
                   this.ObfCreateForm.patchValue({othersolutions:val.viewValue});
                   this.ObfCreateForm.controls['othersolutions'].enable();
                 }
                 if(obj.value == "3" && val.value=="0")
                 {
                   this.ObfCreateForm.patchValue({otherintegratedsolutions:val.viewValue});
                   this.ObfCreateForm.controls['otherintegratedsolutions'].enable();
                 }
             });
        });
    
      }
      
}

