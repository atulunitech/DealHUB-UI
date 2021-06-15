import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { DashboardService } from '../dashboard.service';
import {DomSanitizer} from '@angular/platform-browser';
import {FormBuilder,FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';

import { OBFServices, SAPIO } from '../services/obfservices.service';
import {​​​​​​​​ MatTableModule ,MatTableDataSource}​​​​​​​​ from'@angular/material/table';
import {​​​​​​​​ MatDialog }​​​​​​​​ from'@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TemplateRef } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatChipList} from '@angular/material/chips';
import { MessageBoxComponent } from 'src/app/shared/MessageBox/MessageBox.Component';
import { DatePipe } from '@angular/common';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MaterialModule } from '../../shared/materialmodule/materialmodule.module';
import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

 class SaveAttachmentParameter{
  _dh_id:number;
  _dh_header_id:number;
  _fname:string;
  _fpath:string;
  _created_by:string;
  _description:string;
}
class CommentDetails
{
  Fullname:string;
  role_name:string;
  dh_comment:string;
  commented_on:string;
  Version_name:string;
  Status:string;
  role_code:string;
  Initials:string;
}
class filesdetail
{

  filename:string;
  filepath:string;
  description:string;
  }
  
@Component({
    selector: 'app-obfSummary',
    templateUrl: './OBFSummary.component.html',
    styleUrls: ['./OBFSummary.component.scss']
  })

  export class OBFSummaryComponent implements OnInit {
  //  public types: string = 'component';
    @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
    @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
    // comments = new FormControl('', Validators.required);
    obfsummaryform = new FormGroup({
      comments : new FormControl("",[Validators.required,this.NoInvalidCharacters]),
      MarginException:new FormControl("",[Validators.required]),
      ExceptionCFO:new  FormControl("",[Validators.required]),
      ExceptionCEO:new FormControl("",[Validators.required]),
      version:new FormControl("",[Validators.required]),
    });
   
 //   noComment:boolean=false;
    readMore = false;
    BrifreadMore=false;
    paymentRead=false;
    comments = new FormControl('', Validators.required);
    step=0;
    service:string;
    privilege_name:string;
    subscription: Subscription;
    dh_id:number;
    supportfilecount:number=0;
    FinalAggfilecount:number=0;
    dh_header_id:number;
  SupportPoprogress:any[] = [];
  finalProgress:any[]=[];
  SaveAttachmentParameter:SaveAttachmentParameter;
  Attachments:SaveAttachmentParameter[] = [];
 CommentDetails:CommentDetails[]=[];
  loipopath:string="";
  supportdocpath:string="";
  Finaldocpath:string="";
  role_name:string="";
  message: string[] = [];
  listData: MatTableDataSource<any>;
  columns:Array<any>;
 // displayedColumns:Array<any>;
  dashboardData:any[]=[];
  displayedColumns: string[] = ['username','TimeLine','currentstatus','comment','actions'];
  progress: number = 0;
  uploadDocfiles:File[]=[];

  loipofiles: File[] = [];
  supportfiles: File[] = [];    
  FinalAggfiles:File[]=[];   
  LoiPoprogress: any[] = [];
  uploaddocprocess:any[]=[];
  filelist:filesdetail[]=[];
  Type:string="";
  User_name:string="";
  CEOMess:boolean=false;
  MarginException:boolean=false;
  CFOMess:boolean=false;
  Loipodropdown:string="";
  shortcurrentstatus:string="";
  ServiceMore:boolean=false;
  SAPNumMore:boolean=false;
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    constructor(private sanitizer:DomSanitizer,
        public _obfservices:OBFServices,private dialog:MatDialog,
        public _dashboardservice:DashboardService,
        private _mesgBox: MessageBoxComponent,private datepipe: DatePipe,private router: Router,private route:ActivatedRoute) 
      { 

      }
      
  ngOnInit(): void {
    if(sessionStorage.getItem("privilege_name")!= null)
    {
      this.privilege_name=sessionStorage.getItem("privilege_name");

    }
    this.role_name=localStorage.getItem("role_name");

    this.User_name= localStorage.getItem("UserName"); 
    console.log(this._obfservices.obfsummarymodel);
     //this.dh_id= this.route.snapshot.queryParams["dh_id"];
     this.route.params.subscribe
     (params => {
      this.dh_id=params["dh_id"];
      this.dh_header_id=params["dh_header_id"];
      this.shortcurrentstatus=params["shortcurrentstatus"];
      this.getdetailsfordh_id(this.dh_id);
     }
     );

     
     this.GetDetailTimelineHistory(this.dh_id,this.dh_header_id);
    
   
  }
  CEOmessage:string="";
  cfomessgae:string="";
  disableCFOcontrol:boolean=false;
  disableCEOcontrol:boolean=false;
  disableMargincontrol:boolean=false;
  ShowViewButton:boolean=false;
  getdetailsfordh_id(dh_id)
  {
    this._obfservices.getobfsummarydata(dh_id).subscribe(data =>{
      console.log(data);
    //  this._obfservices.initializeobf(JSON.parse(data));
      var jsondata=JSON.parse(data);
      this._obfservices.obfsummarymodel.uploadDetails = jsondata.uploadDetails;
      this._obfservices.obfsummarymodel.solutionDetails = jsondata.solutionDetails;
      this._obfservices.obfsummarymodel.AttachmentDetails = jsondata.AttachmentDetails;
      this._obfservices.obfsummarymodel.CommentDetails=jsondata.CommentDetails;
      this._obfservices.obfsummarymodel.VersionDetails=jsondata.VersionDetails;
      this._obfservices.obfsummarymodel.servicelist=jsondata.ServicesList;
      this._obfservices.obfsummarymodel.PPl_details=jsondata.PPl_details;
      this._obfservices.obfsummarymodel.SAPdetail=jsondata.SAPdetail;
      
      if(this.role_name=='CFO')
      {
       if(this._obfservices.obfsummarymodel.uploadDetails[0].exceptionalcase_cfo==1)
       {
        this.obfsummaryform.controls["ExceptionCFO"].setValue(true);
        this.CEOMess=true;
        if(this._obfservices.obfsummarymodel.uploadDetails[0].is_loi_po_uploaded=="N")
         {
         this.cfomessgae="Approval required as per DOA Matrix.No LOI/PO";
         this.disableCFOcontrol=true;
         }
        else  {
          this.disableCFOcontrol=true;
         this.cfomessgae="Approval required as per Pricing Team.";
         }
       }
       if(this._obfservices.obfsummarymodel.uploadDetails[0].marginal_exception_requested==1)
       {
        this.MarginException=true;
        //this._mesgBox.showUpdate("Margin Exception Requested by VSH.");
       }
      }
      if(this.role_name=='CEO')
      {
        if(this._obfservices.obfsummarymodel.uploadDetails[0].exceptioncase_ceo==1)
        {
         this.obfsummaryform.controls["ExceptionCEO"].setValue(true);
         this.CFOMess=true;
          if(this._obfservices.obfsummarymodel.uploadDetails[0].exceptionalcase_cfo_updatedby=='Exceptioncal Case CEO  Updated by system:-DOA Matrix  ')
          {
            this.disableCEOcontrol=true;
            this.CEOmessage="Approval required as per DOA Matrix.GM Less than 10%";
          }
         else {
          this.disableCEOcontrol=true;
             this.CEOmessage="Approval required as per Pricing Team.";
            
          }
        }
        
        
      }
      if(this.role_name=='PH')
      {
         if(this._obfservices.obfsummarymodel.uploadDetails[0].is_loi_po_uploaded=="N")
         {
          this.CEOMess=true;
          this.disableCFOcontrol=false;
          this.obfsummaryform.controls["ExceptionCFO"].setValue(true);
         this.cfomessgae="Approval required as per DOA Matrix.No LOI/PO";
         }
         if(this._obfservices.obfsummarymodel.uploadDetails[0].marginal_exception_requested==1)
        {
         this.MarginException=true;
        // this._mesgBox.showUpdate("Margin Exception Requested by VSH.");
        }
      }
      if(this.role_name=='VH')
      {
        if(this._obfservices.obfsummarymodel.uploadDetails[0].marginal_exception_requested==1)
        {
         this.MarginException=true;
        // this._mesgBox.showUpdate("Margin Exception Requested by VSH.");
        }
      }
      if(this.role_name=='SH')
      {
        if(this._obfservices.obfsummarymodel.uploadDetails[0].marginal_exception_requested==1)
        {
         this.MarginException=true;
         //this._mesgBox.showUpdate("Margin Exception Requested by VSH.");
        }
      }
      
      if(this._obfservices.obfsummarymodel.uploadDetails[0].phase_code=='OBF') {
        if(this._obfservices.obfsummarymodel.uploadDetails[0].ppl_init == 0)
        {
          this.ShowViewButton=true;
         // this.getdetailsfordh_id(this._obfservices.obfsummarymodel.PPl_details[0].PPL_dh_id);
        }
        
       }

      //this.obfsummaryform.controls["version"].setValue();
      this.obfsummaryform.patchValue({version:this._obfservices.obfsummarymodel.uploadDetails[0].dh_id });
      this.getserviceslist();
      this.getSAPCode();

    },
    (error)=>{
      alert(error.message);
    }
    );
   
  }
  getserviceslist()
  {
    this.service="";
    var finalservicecat="";
   
    if(this._obfservices.obfsummarymodel.servicelist.length != 0)
    {
      var tempservicecat="";
      var Tempservice="";
     
      for(let i=0 ;i<this._obfservices.obfsummarymodel.servicelist.length ; i++)
      {
      
        Tempservice=this._obfservices.obfsummarymodel.servicelist[i].solutioncategory_name;

        for(let t=0;t < this._obfservices.obfsummarymodel.solutionDetails.length;t++)
        {
          if(Tempservice == this._obfservices.obfsummarymodel.solutionDetails[t].solutioncategory_name)
          {
            
            tempservicecat += ','+ this._obfservices.obfsummarymodel.solutionDetails[t].solution_name;
          }
        }
      
       tempservicecat=tempservicecat.substring(1);
       finalservicecat += " "+ Tempservice +"-"+ tempservicecat +".";
       
      }
      this.service=finalservicecat;
       this.service = this.service.substring(1);
    }
  }
  
  GetDetailTimelineHistory(dh_id,dh_header_id)
  {
    
    this._obfservices.GetDetailTimelineHistory(dh_id,dh_header_id).subscribe(Result=>{
    
      console.log("DashBoardData");
      console.log(Result);
      var loginresult =Result;
      this.dashboardData= JSON.parse(Result);
      this.listData = new MatTableDataSource(this.dashboardData);
      
    },
    (error:HttpErrorResponse)=>{
    
      if (error.status==401)
      {
        this.router.navigateByUrl('/login');
        
      }
      
    }
    );
   
  }
  
  downloadCoversheet(event)
  {
    event.preventDefault();
    if(this._obfservices.obfsummarymodel.uploadDetails[0].OBFFilepath== "")
    {
      this._mesgBox.showError("No OBF Sheet Documents to Download");
    }
    else
    {
      var url=environment.apiUrl + this._obfservices.obfsummarymodel.uploadDetails[0].OBFFilepath;
      window.open(url);
    }
          
  }
  downloadsuppodocument(event)
  {
    event.preventDefault();
    if(this._obfservices.obfsummarymodel.AttachmentDetails != undefined)
    {
    if(this._obfservices.obfsummarymodel.AttachmentDetails.length != 0)
    {
      let index=this._obfservices.obfsummarymodel.AttachmentDetails.findIndex(obj=> obj.description=="support");
      if(index>-1)
      {
        for(var i=0;i<this._obfservices.obfsummarymodel.AttachmentDetails.length;i++)
        {
          if(this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="support")
          {
             var url=environment.apiUrl + this._obfservices.obfsummarymodel.AttachmentDetails[i].filepath;
             window.open(url);
            
          }
        }
      }
      else{
        this._mesgBox.showError("No Supporting Documents to Download");
      }
      
    }
    else
    {
      this._mesgBox.showError("No Supporting Documents to Download");
    }
  }
    else
    {
      this._mesgBox.showError("No Supporting Documents to Download");
    }
      
  }
 
  downloadLOIp(event)
  {
    event.preventDefault();
    if(this._obfservices.obfsummarymodel.AttachmentDetails != undefined)
    {
     if(this._obfservices.obfsummarymodel.AttachmentDetails.length != 0)
    {
      let index=this._obfservices.obfsummarymodel.AttachmentDetails.findIndex(obj=> obj.description=="LOI" || obj.description=="PO");
      if(index > -1)
      {
        for(var i=0;i<this._obfservices.obfsummarymodel.AttachmentDetails.length;i++)
        {
          if(this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="LOI" || this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="PO" ||  this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="Agreement" )
          {
             var url=environment.apiUrl + this._obfservices.obfsummarymodel.AttachmentDetails[i].filepath;
             window.open(url);
          }
        }
      }
      else{
        this._mesgBox.showError("No LOI or PO Documents to Download");
      }
     
    }
    else
    {
      this._mesgBox.showError("No LOI or PO Documents to Download");
    }
  }
    else
    {
      this._mesgBox.showError("No LOI or PO Documents to Download");
    }
  }
  downloadFinal(event)
  {
    event.preventDefault();
    if(this._obfservices.obfsummarymodel.AttachmentDetails != undefined)
    {
     if(this._obfservices.obfsummarymodel.AttachmentDetails.length != 0)
    {
      let index=this._obfservices.obfsummarymodel.AttachmentDetails.findIndex(obj=> obj.description=="FinalAgg");
      if(index > -1)
      {
        for(var i=0;i<this._obfservices.obfsummarymodel.AttachmentDetails.length;i++)
        {
          if(this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="FinalAgg")
          {
             var url=environment.apiUrl + this._obfservices.obfsummarymodel.AttachmentDetails[i].filepath;
             window.open(url);
          }
          
        }
      }
      else{
        this._mesgBox.showError("No Final Aggrement Documents to Download");
      }

    }

    else
    {
      this._mesgBox.showError("No Final Aggrement Documents to Download");
    }
   
  }
    else
    {
      this._mesgBox.showError("No Final Aggrement Documents to Download");
    }
  }
  today:any=new Date();
  commentVisiable:boolean=false;
  SaveCommentdetail:CommentDetails[] = [];
  SaveComment()
  {
    
    if(this.obfsummaryform.get("comments").value!= "")
    {
      
      var comment=this.obfsummaryform.get("comments").value;
     

      let SaveComment:CommentDetails = new CommentDetails();
      var comment=this.obfsummaryform.get("comments").value;
      SaveComment.Fullname=this.User_name;

      SaveComment.role_name= this.role_name;
      SaveComment.Status="Pending";
      SaveComment.Version_name=this._obfservices.obfsummarymodel.uploadDetails[0]. Version_name;
      SaveComment.commented_on=  this.today;
      SaveComment.dh_comment=comment;
      SaveComment.role_code=this.role_name;
   
      this.commentVisiable=true;
       this.SaveCommentdetail.push(SaveComment);
      console.log('wait');
       this.componentRef.directiveRef.scrollToBottom(500);
    }
      else {
      this.componentRef.directiveRef.scrollToBottom();
    }
    //  if (this.types === 'directive' && this.directiveRef) {
    //   this.directiveRef.scrollToBottom();
    // } else if (this.types === 'component' && this.componentRef && this.componentRef.directiveRef) {
    //   this.componentRef.directiveRef.scrollToBottom();
    // }
  }
  deletecomment()
  {
    this.commentVisiable=false;
    this.obfsummaryform.controls["comments"].setValue('');

    this.SaveCommentdetail=[];

  }
  OpenDocDownload(event,Type)
  {
    this.Type=Type;
    this.uploadDocfiles=[];
    this.uploaddocprocess=[];

    if(this.Type == "loipo")
  {
    this.uploadDocfiles=this.loipofiles;
    this.LoiPoprogress= this.uploaddocprocess;
    this.filelist=[];
   
   
    if(this._obfservices.obfsummarymodel.AttachmentDetails != undefined)
    {
      if(this._obfservices.obfsummarymodel.AttachmentDetails.length !=0)
      {
        for(var i=0;i<this._obfservices.obfsummarymodel.AttachmentDetails.length;i++)
        {
            if(this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="PO")
            {
              let savefile:filesdetail = new filesdetail();
              savefile.filename=this._obfservices.obfsummarymodel.AttachmentDetails[i].filename;
              savefile.filepath=this._obfservices.obfsummarymodel.AttachmentDetails[i].filepath;
              savefile.description=this._obfservices.obfsummarymodel.AttachmentDetails[i].description;
              
              this.filelist.push(savefile);
            }
           else if(this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="LOI")
            {
              let savefile:filesdetail = new filesdetail();
              savefile.filename=this._obfservices.obfsummarymodel.AttachmentDetails[i].filename;
              savefile.filepath=this._obfservices.obfsummarymodel.AttachmentDetails[i].filepath;
              savefile.description=this._obfservices.obfsummarymodel.AttachmentDetails[i].description;
              this.filelist.push(savefile);
            }
            else if(this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="Agreement")
            {
              let savefile:filesdetail = new filesdetail();
              savefile.filename=this._obfservices.obfsummarymodel.AttachmentDetails[i].filename;
              savefile.filepath=this._obfservices.obfsummarymodel.AttachmentDetails[i].filepath;
              savefile.description=this._obfservices.obfsummarymodel.AttachmentDetails[i].description;
              this.filelist.push(savefile);
            }
        }
      }
    }
  
  }
  else if(this.Type == "Supporting")
  {
    this.uploadDocfiles=this.supportfiles;
    this.SupportPoprogress= this.uploaddocprocess;
   
    this.filelist=[];
    if(this._obfservices.obfsummarymodel.AttachmentDetails != undefined)
    {
    if(this._obfservices.obfsummarymodel.AttachmentDetails.length !=0)
    {
      for(var i=0;i<this._obfservices.obfsummarymodel.AttachmentDetails.length;i++)
      {
          if(this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="support")
          {
            let savefile:filesdetail = new filesdetail();
            savefile.filename=this._obfservices.obfsummarymodel.AttachmentDetails[i].filename;
            savefile.filepath=this._obfservices.obfsummarymodel.AttachmentDetails[i].filepath;
            savefile.description=this._obfservices.obfsummarymodel.AttachmentDetails[i].description;
            this.filelist.push(savefile);
          }
      }
    }
  }
  }
  else if(this.Type == "FinalAgg")
  {
    this.uploadDocfiles=this.FinalAggfiles;
    this.finalProgress= this.uploaddocprocess;
   
    this.filelist=[];
    if(this._obfservices.obfsummarymodel.AttachmentDetails != undefined)
    {
    if(this._obfservices.obfsummarymodel.AttachmentDetails.length !=0)
    {
      for(var i=0;i<this._obfservices.obfsummarymodel.AttachmentDetails.length;i++)
      {
          if(this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="FinalAgg")
          {
             let savefile:filesdetail = new filesdetail();
            savefile.filename=this._obfservices.obfsummarymodel.AttachmentDetails[i].filename;
            savefile.filepath=this._obfservices.obfsummarymodel.AttachmentDetails[i].filepath;
            savefile.description=this._obfservices.obfsummarymodel.AttachmentDetails[i].description;
            this.filelist.push(savefile);
          }
      }
    }
  }
  }
    const dialogRef = this.dialog.open(this.callAPIDialog, {
      // width: '500px',
      // height:'600px',
      // disableClose: true,
      panelClass: 'custom-modalbox',
      backdropClass: 'popupBackdropClass',
     // data: { campaignId: this.params.id }
  })
 


  }
  public checkError = (controlName: string, errorName: string) => {
    return this.obfsummaryform.controls[controlName].hasError(errorName);
  }

  //Action Functions For Approve ,Rejected and OnHold function
  ApproveDeatils()
  {
    this._obfservices._approveRejectModel.isapproved=1;
    this._obfservices._approveRejectModel.rejectcomment=this.obfsummaryform.get("comments").value;
    this._obfservices._approveRejectModel.rejectionto=0;
    this._obfservices._approveRejectModel._dh_id=this._obfservices.obfsummarymodel.uploadDetails[0].dh_id;
    this._obfservices._approveRejectModel._dh_header_id=this._obfservices.obfsummarymodel.uploadDetails[0].dh_header_id;
    this._obfservices._approveRejectModel._fname="";
    this._obfservices._approveRejectModel._fpath="";
    this._obfservices._approveRejectModel._created_by=localStorage.getItem("UserCode");
    this._obfservices._approveRejectModel.exceptionalcase_cfo= (this.obfsummaryform.get("ExceptionCFO").value==false? 0 :1 );
    this._obfservices._approveRejectModel.exceptioncase_ceo=(this.obfsummaryform.get("ExceptionCEO").value==false? 0 :1 );
    this._obfservices._approveRejectModel.is_on_hold=0;
    this._obfservices._approveRejectModel._marginal_exception_requested=(this.obfsummaryform.get("MarginException").value==false? 0 :1 );
    this._obfservices.ApproveRejectObf(this._obfservices._approveRejectModel).subscribe(data=>{
    var jsondata=JSON.parse(data);
      if(jsondata[0].status =="success")
      {
        this._mesgBox.showSucess(jsondata[0].message);
        this.router.navigate(['/DealHUB/dashboard']);
      }
      else{
        this._mesgBox.showError(jsondata[0].message);
        this.router.navigate(['/DealHUB/dashboard']);
      }
    });
  }
  RejectDeatils()
   {  
   if(this.SaveCommentdetail.length == 0)
   {
//
  if(this.obfsummaryform.get("comments").value == "")
  {
    this.obfsummaryform.controls["comments"].markAsTouched();
  //  this.noComment = true;
    return false;
    //return this.obfsummaryform.controls["comments"].hasError("required");
  }
  else
  {
    this._mesgBox.showError("Please Submit Comment");
  }
  
   } 
   else
   {
    this._obfservices._approveRejectModel.isapproved=0;
    this._obfservices._approveRejectModel.rejectcomment=this.obfsummaryform.get("comments").value;
    this._obfservices._approveRejectModel.rejectionto=0;
    this._obfservices._approveRejectModel._dh_id=this._obfservices.obfsummarymodel.uploadDetails[0].dh_id;
    this._obfservices._approveRejectModel._dh_header_id=this._obfservices.obfsummarymodel.uploadDetails[0].dh_header_id;
    this._obfservices._approveRejectModel._fname="";
    this._obfservices._approveRejectModel._fpath="";
    this._obfservices._approveRejectModel._created_by=localStorage.getItem("UserCode");
    this._obfservices._approveRejectModel.exceptionalcase_cfo=(this.obfsummaryform.get("ExceptionCFO").value==false? 0 :1 );
    this._obfservices._approveRejectModel.exceptioncase_ceo=(this.obfsummaryform.get("ExceptionCEO").value==false? 0 :1 );
    this._obfservices._approveRejectModel.is_on_hold=0;
    this._obfservices._approveRejectModel._marginal_exception_requested=(this.obfsummaryform.get("MarginException").value==false? 0 :1 );
    this._obfservices.ApproveRejectObf(this._obfservices._approveRejectModel).subscribe(data=>{
       let res = JSON.parse(data);
      if(res[0].status =="success")
      {
        this._mesgBox.showSucess(res[0].message);
        this.router.navigate(['/DealHUB/dashboard']);
      }
      else{
        this._mesgBox.showError(res[0].message);
        this.router.navigate(['/DealHUB/dashboard']);
      }
    });

  }
  }
  onHoldDetails()
  {
    if(this.SaveCommentdetail.length == 0)
   {
//
  if(this.obfsummaryform.get("comments").value == "")
  {
    this.obfsummaryform.controls["comments"].markAsTouched();
    //this.noComment = true;
    return false;
    //return this.obfsummaryform.controls["comments"].hasError("required");
  }
  else
  {
    this._mesgBox.showError("Please Submit Comment");
  }
  
   } 
   else
   {

    this._obfservices._approveRejectModel.isapproved=0;
    this._obfservices._approveRejectModel.rejectcomment="";
    this._obfservices._approveRejectModel.rejectionto=0;
    this._obfservices._approveRejectModel._dh_id=this._obfservices.obfsummarymodel.uploadDetails[0].dh_id;
    this._obfservices._approveRejectModel._dh_header_id=this._obfservices.obfsummarymodel.uploadDetails[0].dh_header_id;
    this._obfservices._approveRejectModel._fname="";
    this._obfservices._approveRejectModel._fpath="";
    this._obfservices._approveRejectModel._created_by=localStorage.getItem("UserCode");
    this._obfservices._approveRejectModel.exceptionalcase_cfo=(this.obfsummaryform.get("ExceptionCFO").value==false? 0 :1 );
    this._obfservices._approveRejectModel.exceptioncase_ceo=(this.obfsummaryform.get("ExceptionCEO").value==false? 0 :1 );
    this._obfservices._approveRejectModel.is_on_hold=1;
    this._obfservices._approveRejectModel._marginal_exception_requested=(this.obfsummaryform.get("MarginException").value==false? 0 :1 );
    this._obfservices.ApproveRejectObf(this._obfservices._approveRejectModel).subscribe(data=>{
       let res = JSON.parse(data);
      if(res[0].status =="success")
      {
        this._mesgBox.showSucess(res[0].message);
        this.router.navigate(['/DealHUB/dashboard']);
      }
      else{
        this._mesgBox.showError(res[0].message);
        this.router.navigate(['/DealHUB/dashboard']);
      }
    });
  }
}
  
  bytesToSize(bytes):number {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 0;
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    if (i === 0) return bytes;
    return parseFloat((bytes / (1024 ** i)).toFixed(1));
  }
	onSelect(event) {
    try{
    // var format = /[`!@#$%^&*()+\=\[\]{};':"\\|,<>\/?~]/;
    var format = /[`!@#$%^&*+\=\[\]{};':"\\|,<>\/?~]/;   //removed () from validation 
   
    event.addedFiles.forEach(element => {
      // console.log("file size of "+element.name+" is "+ this.bytesToSize(element.size));
       if( Math.floor(this.bytesToSize(element.size)) == 0)
       {
         throw new Error("The file size of "+element.name+" is invalid" );
       }
 
       if(format.test(element.name))
       {
         throw new Error(element.name+" :name contains special characters,Kindly rename and upload again");
        }
       // if( this.bytesToSize(element.size) > 4)
       if( element.size > 4194304)
       {
         throw new Error("The file size of "+element.name+" is greater than 4 Mb, Kindly re-upload files with size less than 4 Mb" );
       }
 
     });
    this.progress = 0;
    
       if(this.Type == "loipo")
       {
        if(event.addedFiles.length > 1)
        {
          throw new Error("Kindly upload only one valid LOI/PO Sheet");
        }
         if(this.loipofiles.length >= 1 )
         {
         // alert("Kindly upload only one Loi / Po file");
          this._mesgBox.showError("Kindly upload only one valid LOI/PO Sheet");
          return false;
         }
         else{
           if(this.Loipodropdown == null || this.Loipodropdown == "")
           {
            throw new Error("Kindly select LOI or PO file type");
           }
        this.loipofiles.push(...event.addedFiles);
       
        this.uploadDocfiles=this.loipofiles;
        }
        // this.files = this.loipofiles;
       }
       else if(this.Type=='Supporting')
       {
        this.supportfilecount +=1;
        if(this.supportfilecount > 1)
        {

        }
       this.supportfiles.push(...event.addedFiles);
        this.uploadDocfiles=this.supportfiles;
        // this.files = this.supportfiles;
       }
       else if(this.Type=='FinalAgg')
       {
         this.FinalAggfilecount +=1;
         if(this.FinalAggfilecount > 1)
         {

         }
        
        this.FinalAggfiles.push(...event.addedFiles);
      

        this.uploadDocfiles=this.FinalAggfiles;
        // this.files = this.supportfiles;
       }
       console.log("check progrss value");
       console.log(this.progress);
		// this.files.push(...event.addedFiles);
  }
  catch(e)
  {
    this._mesgBox.showError(e.message);
  }

	}
  onRemove(files:File[],event) {
    console.log(event);
		files.splice(files.indexOf(event), 1);
   
  
     if(this.Type == "loipo")
    {
       this.loipofiles=files;
       this.uploadDocfiles=this.loipofiles;
    }
    else if(this.Type == "support")
    {
      this.supportfiles=files;
      this.uploadDocfiles=this.supportfiles;
    
    }
    else if(this.Type =='FinalAgg')
    {
     
     this.FinalAggfiles=files;
     this.uploadDocfiles=this.FinalAggfiles;
    } 
    

	}
  SaveAttachment()
  {
    //this.isloipo = !this.isloipo;
   
  if(this.Type == "loipo")
  {
    if(this.filelist.length !=0)
    {
      for(let i=0;i< this.filelist.length;i++)
      {
        let SaveAttachment = new SaveAttachmentParameter();
        SaveAttachment._dh_id=this.dh_id;
        SaveAttachment._dh_header_id=this.dh_header_id;
        SaveAttachment._fname=  this.filelist[i].filename; 
        SaveAttachment._fpath = this.filelist[i].filepath;
        SaveAttachment._description = this.Loipodropdown;
        this.Attachments.push(SaveAttachment);
      }
    }
    
  }
   else{
    if(this.filelist.length !=0)
    {
      for(let i=0;i< this.filelist.length;i++)
      {
        let SaveAttachment = new SaveAttachmentParameter();
        SaveAttachment._dh_id=this.dh_id;
        SaveAttachment._dh_header_id=this.dh_header_id;
        SaveAttachment._fname=  this.filelist[i].filename; 
        SaveAttachment._fpath = this.filelist[i].filepath;
        SaveAttachment._description = this.filelist[i].description;
        this.Attachments.push(SaveAttachment);
      }
    }
   } 
    this._obfservices.SaveAttachment(this.Attachments).subscribe(result=>
      {
          console.log(result);
          var REsult=JSON.parse(result);
          if(REsult[0].status ="Success")
          {
            this._mesgBox.showSucess("Attachment Uploaded Successfully.");
           
           // this.Attachments=[];
           // this.dialog.closeAll();

          }
        
    });
  }
  uploadfiles(files:File[])
  {
    let val = true;
     if(this.Type == "loipo")
    {
     // this.isloipo = !this.isloipo;
      this.LoiPoprogress = [];
      this.uploaddocprocess=[];
      
    }
    else if(this.Type == "Supporting")
    {
     // this.isloipo = !this.isloipo;
      this.SupportPoprogress = [];
      this.uploaddocprocess=[];
    }
    else if(this.Type == "FinalAgg")
    {
     // this.isloipo = !this.isloipo;
      this.finalProgress = [];
      this.uploaddocprocess=[];
    }
    var path="";
    var consolidatedpath="";
    for (let i = 0; i < files.length; i++) {
     if(this.Type == "loipo")
    {
      this.LoiPoprogress[i] = { value: 0, fileName: files[i].name };
      this.uploaddocprocess[i] = { value: 0, fileName: files[i].name };
      
    }
    else if(this.Type == "Supporting")
    {
      this.SupportPoprogress[i] = { value: 0, fileName: files[i].name };
      this.uploaddocprocess[i] = { value: 0, fileName: files[i].name };
    }
    else if(this.Type == "FinalAgg")
    {
      this.finalProgress[i] = { value: 0, fileName: files[i].name };
      this.uploaddocprocess[i] = { value: 0, fileName: files[i].name };
    }
      
      path="";
    this._dashboardservice.uploadImage(files[i]).subscribe(
      event => {
       
        if(event.type === HttpEventType.UploadProgress)
        {
          console.log('Upload Progress: '+Math.round(event.loaded/event.total * 100) +"%");
          this.progress = Math.round(event.loaded/event.total * 100);
          
    if(this.Type  == "loipo")
    {
      this.LoiPoprogress[i].value = Math.round(event.loaded/event.total * 100);
      this.uploaddocprocess[i].value = Math.round(event.loaded/event.total * 100);
     
    }
    else if(this.Type  == "Supporting")
    {
      this.SupportPoprogress[i].value = Math.round(event.loaded/event.total * 100);
      this.uploaddocprocess[i].value = Math.round(event.loaded/event.total * 100);
    }
    else if(this.Type  == "FinalAgg")
    {
      this.finalProgress[i].value = Math.round(event.loaded/event.total * 100);
      this.uploaddocprocess[i].value = Math.round(event.loaded/event.total * 100);
    }
        }
        else if(event.type === HttpEventType.Response)
        {
        console.log(event.body);
        path = JSON.stringify(event.body);
        path=path.split('"').join('');
        path = path.substring(0,path.length -1);
        consolidatedpath += path +",";
        consolidatedpath = consolidatedpath.substring(0,consolidatedpath.length -1);
         this.SaveAttachmentParameter = new SaveAttachmentParameter();
        if(path != ""){
         if(this.Type  == "loipo")
        {
         this.loipopath = path;
        this.SaveAttachmentParameter._dh_id=this.dh_id;
        this.SaveAttachmentParameter._dh_header_id=this.dh_header_id;
         this.SaveAttachmentParameter._fname= files[i].name; 
         this.SaveAttachmentParameter._fpath = path;
         this.SaveAttachmentParameter._description = this.Loipodropdown;
         this.SaveAttachmentParameter. _created_by=localStorage.getItem("UserCode");

         this.Attachments.push(this.SaveAttachmentParameter);
        }
        else if(this.Type  == "Supporting")
        {
          this.supportdocpath = path;
          this.SaveAttachmentParameter._dh_id=this.dh_id;
          this.SaveAttachmentParameter._dh_header_id=this.dh_header_id;
          this.SaveAttachmentParameter._fname= files[i].name; 
           this.SaveAttachmentParameter._fpath = path;
           this.SaveAttachmentParameter._description = "support";
           this.SaveAttachmentParameter. _created_by=localStorage.getItem("UserCode");
           this.Attachments.push(this.SaveAttachmentParameter);
        }
        else if(this.Type  == "FinalAgg")
        {
          this.Finaldocpath = path;
          this.SaveAttachmentParameter._dh_id=this.dh_id;
          this.SaveAttachmentParameter._dh_header_id=this.dh_header_id;
          this.SaveAttachmentParameter._fname= files[i].name; 
           this.SaveAttachmentParameter._fpath = path;
           this.SaveAttachmentParameter._description = "FinalAgg";
           this.SaveAttachmentParameter. _created_by=localStorage.getItem("UserCode");
           this.Attachments.push(this.SaveAttachmentParameter);
        }
      }
      this.SaveAttachment();
      }

     
      },
      (err:any)=>{
     if(this.Type  == "loipo")
    {
      this.LoiPoprogress[i].value = 0;
      this.uploaddocprocess[i].value = 0;
    }
    else if(this.Type  == "Supporting")
    {
      this.SupportPoprogress[i].value = 0;
      this.uploaddocprocess[i].value = 0;
    }
  
    else if(this.Type  == "FinalAgg")
    {
      this.finalProgress[i].value = 0;
      this.uploaddocprocess[i].value = 0;
    }
        const msg = 'Could not upload the file: ' + files[i].name;
        this.message.push(msg);
      }
    );
    }
  }
  removeFile(file:filesdetail[],event)
  {
 
  console.log(event);
  file.splice(file.indexOf(event), 1);
  if(this._obfservices.obfsummarymodel.AttachmentDetails.length != 0)
    {
      for(var i=0;i<this._obfservices.obfsummarymodel.AttachmentDetails.length;i++)
      {
        if(this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="support")
        {
          this._obfservices.obfsummarymodel.AttachmentDetails.splice(i);
        }
        else if(this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="FinalAgg")
        {

          this._obfservices.obfsummarymodel.AttachmentDetails.splice(i);
        }
        else if(this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="LOI")
        {

          this._obfservices.obfsummarymodel.AttachmentDetails.splice(i);
        }
        else if(this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="PO")
        {

          this._obfservices.obfsummarymodel.AttachmentDetails.splice(i);
        }
        else if(this._obfservices.obfsummarymodel.AttachmentDetails[i].description=="Agreement")
        {

          this._obfservices.obfsummarymodel.AttachmentDetails.splice(i);
        }
        
      }
    }
  }
  onversionchange(evt,dh_id,dh_header_id)
  {
   console.log(dh_id,dh_header_id);
    this._obfservices.GetOBFSummaryDataVersionWise(dh_id,dh_header_id).subscribe(data =>{
      
      var jsondata=JSON.parse(data);
      this._obfservices.obfsummarymodel.uploadDetails = jsondata.uploadDetails;
      this._obfservices.obfsummarymodel.solutionDetails = jsondata.solutionDetails;
      this._obfservices.obfsummarymodel.AttachmentDetails = jsondata.AttachmentDetails;
      this._obfservices.obfsummarymodel.CommentDetails=jsondata.CommentDetails;
      this._obfservices.obfsummarymodel.servicelist=jsondata.ServicesList;
      //this._obfservices.obfsummarymodel.VersionDetails=jsondata.VersionDetails;
      this._obfservices.obfsummarymodel.SAPdetail=jsondata.SAPdetail;

      var tempdh_id=this._obfservices.obfsummarymodel.uploadDetails[0].dh_id;
     var tempdh_header_id=this._obfservices.obfsummarymodel.uploadDetails[0].dh_header_id;
      if(this._obfservices.obfsummarymodel.uploadDetails[0].marginal_exception_requested == 1)
      {
        this.obfsummaryform.controls["MarginException"].setValue(true);
        this.disableMargincontrol=true;
      }
      else{
        this.obfsummaryform.controls["MarginException"].setValue(false);
        this.disableMargincontrol=false;
      }
       
     if(this.role_name=='CFO')
     {
      if(this._obfservices.obfsummarymodel.uploadDetails[0].exceptionalcase_cfo==1)
      {
       this.obfsummaryform.controls["ExceptionCFO"].setValue(true);
       this.CEOMess=true;
       if(this._obfservices.obfsummarymodel.uploadDetails[0].is_loi_po_uploaded=="N")
        {
        this.cfomessgae="Approval required as per DOA Matrix.No LoI/PO";
        this.disableCFOcontrol=true;
        }
       else  {

         this.disableCFOcontrol=true;
        this.cfomessgae="Approval required as per Pricing Team.";
        }
      }
      else{
        this.disableCFOcontrol=false;
        this.obfsummaryform.controls["ExceptionCFO"].setValue(false);
    }
      if(this._obfservices.obfsummarymodel.uploadDetails[0].marginal_exception_requested==1)
      {
       this.MarginException=true;
      // this._mesgBox.showUpdate("Margin Exception Requested by VSH.");
      }
      else{
        this.MarginException=false;
      }
     }
     if(this.role_name=='CEO')
     {
       if(this._obfservices.obfsummarymodel.uploadDetails[0].exceptioncase_ceo==1)
       {
        this.obfsummaryform.controls["ExceptionCEO"].setValue(true);
        this.CFOMess=true;
         if(this._obfservices.obfsummarymodel.uploadDetails[0].exceptionalcase_cfo_updatedby=='Exceptioncal Case CEO  Updated by system:-DOA Matrix  ')
         {
           this.disableCEOcontrol=true;
           this.CEOmessage="Approval required as per DOA Matrix.GM Less than 10%";
         }
        else {
         this.disableCEOcontrol=true;
            this.CEOmessage="Approval required as per Pricing Team.";
           
         }
       }
       else{
        this.disableCEOcontrol=false;
        this.obfsummaryform.controls["ExceptionCEO"].setValue(false);
       }
       
       
     }
     if(this.role_name=='PH')
     {
        if(this._obfservices.obfsummarymodel.uploadDetails[0].is_loi_po_uploaded=="N")
        {
         this.CEOMess=true;
         this.disableCFOcontrol=true;
         this.obfsummaryform.controls["ExceptionCFO"].setValue(true);
        this.cfomessgae="Approval required as per DOA Matrix.No LoI/PO";
        }
        else{
          this.disableCFOcontrol=false;
          this.obfsummaryform.controls["ExceptionCFO"].setValue(false);
        }
        if(this._obfservices.obfsummarymodel.uploadDetails[0].marginal_exception_requested==1)
        {
         this.MarginException=true;
        // this._mesgBox.showUpdate("Margin Exception Requested by VSH.");
        }
     }
    
      this.getserviceslist();
      this.getSAPCode();
      this.GetDetailTimelineHistory(tempdh_id,tempdh_header_id);
    },
    (error)=>{
      alert(error.message);
    }
    );
    
  }
  getOBFPPLDetails()
  {
     if(this._obfservices.obfsummarymodel.uploadDetails[0].phase_code=='PPL')
     {
      this.getdetailsfordh_id(this._obfservices.obfsummarymodel.uploadDetails[0].parent_dh_main_id);
     }
     else if(this._obfservices.obfsummarymodel.uploadDetails[0].phase_code=='OBF') {
      if(this._obfservices.obfsummarymodel.PPl_details != undefined && this._obfservices.obfsummarymodel.PPl_details[0].PPL_dh_id !=0)
      {
        this.getdetailsfordh_id(this._obfservices.obfsummarymodel.PPl_details[0].PPL_dh_id);
      }
      
     }
  }
  SAPIONo:string="";
  getSAPCode()
  {
    this.SAPIONo ="";
    if( this._obfservices.obfsummarymodel.SAPdetail !=undefined ||  this._obfservices.obfsummarymodel.SAPdetail.length !=0)
    {
      for(let i=0;i< this._obfservices.obfsummarymodel.SAPdetail.length;i++)
      {
        this.SAPIONo += ','+  this._obfservices.obfsummarymodel.SAPdetail[i].cust_sap_io_number;
      }
      this.SAPIONo=this.SAPIONo.substring(1);
    }
  }
  getdownloadfile(event)
  {
    
    if(event.actions== "")
    {
      this._mesgBox.showError("No Documents to Download");
    }
    else
    {
      var url=environment.apiUrl + event.actions;
      window.open(url);
    }
  }
  

  NoInvalidCharacters(control: AbstractControl): {[key: string]: any} | null  {
    var format = /[<>'"&]/;
    if (control.value && format.test(control.value)) {
      return { 'invalidservices': true };
    }
    return null;
  }
  }