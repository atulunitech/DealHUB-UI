import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { DashboardService } from '../dashboard.service';
import {DomSanitizer} from '@angular/platform-browser';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
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



 class SaveAttachmentParameter{
  _dh_id:number;
  _dh_header_id:number;
  _fname:string;
  _fpath:string;
  _created_by:string;
  _description:string;
}
@Component({
    selector: 'app-obfSummary',
    templateUrl: './OBFSummary.component.html',
    styleUrls: ['./OBFSummary.component.scss']
  })

  export class OBFSummaryComponent implements OnInit {
   
    // comments = new FormControl('', Validators.required);
    obfsummaryform = new FormGroup({
      comments : new FormControl("",[Validators.required])
    });
    noComment:boolean=false;
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
  loipopath:string="";
  supportdocpath:string="";
  Finaldocpath:string="";
  message: string[] = [];
  listData: MatTableDataSource<any>;
  columns:Array<any>;
 // displayedColumns:Array<any>;
  dashboardData:any[]=[];
  displayedColumns: string[] = ['username','currentstatus','comment','TimeLine'];
   
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    constructor(private sanitizer:DomSanitizer,
        public _obfservices:OBFServices,private dialog:MatDialog,
        public _dashboardservice:DashboardService,
        private _mesgBox: MessageBoxComponent,private datepipe: DatePipe,private router: Router,private route:ActivatedRoute) 
      { 

        // this.subscription =  this._obfservices.Obfsummarysubject.subscribe(data=>{
        //   console.log(data +" :data");
        // });
      }
      
  ngOnInit(): void {
    if(sessionStorage.getItem("privilege_name")!= null)
    {
      this.privilege_name=sessionStorage.getItem("privilege_name");

    }
    console.log(this._obfservices.obfsummarymodel);
     //this.dh_id= this.route.snapshot.queryParams["dh_id"];
     this.route.params.subscribe
     (params => {
      this.dh_id=params["dh_id"];
      this.dh_header_id=params["dh_header_id"];
      this.getdetailsfordh_id(this.dh_id);
     }
     );
     this.GetDetailTimelineHistory();
    this.getserviceslist();
   
  }
  // ngAfterViewInit(){
  //   this._obfservices.getobfsummarydataonRefresh().subscribe(data=>{
  //     console.log(data +" :data on nginit");
  //   });
  // }
 
  getserviceslist()
  {
    if(this._obfservices.obfsummarymodel.solutionDetails.length != 0)
    {
      var Tempservice="";
      for(let i=0 ;i<this._obfservices.obfsummarymodel.solutionDetails.length ; i++)
      {
        Tempservice += ','+ this._obfservices.obfsummarymodel.solutionDetails[i].solution_name;
        
      //   for(let t=0;t < this._obfservices.obfmodel.Services[i].Serviceslist.length;t++)
      //   {
      //     if(Tempservice == this._obfservices.obfmodel.Services[i].Solutioncategory)
      //     {
            
      //       tempservicecat += ','+ this._obfservices.obfmodel.Services[i].Serviceslist[t].viewValue;
      //     }
      //   }
      
      //  tempservicecat=tempservicecat.substring(1);
      //  finalservicecat += " "+ Tempservice +"-"+ tempservicecat +".";
       
      }
      this.service=Tempservice;
       this.service = this.service.substring(1);
    }
  }
  
  ApproveDeatils()
  {
    this._obfservices._approveRejectModel.isapproved=1;
    this._obfservices._approveRejectModel.rejectcomment="";
    this._obfservices._approveRejectModel.rejectionto=0;
    this._obfservices._approveRejectModel._dh_id=this._obfservices.obfsummarymodel.uploadDetails[0].dh_id;
    this._obfservices._approveRejectModel._dh_header_id=this._obfservices.obfsummarymodel.uploadDetails[0].dh_header_id;
    this._obfservices._approveRejectModel._fname="";
    this._obfservices._approveRejectModel._fpath="";
    this._obfservices._approveRejectModel._created_by=localStorage.getItem("user_id");
    this._obfservices.ApproveRejectObf(this._obfservices._approveRejectModel).subscribe(data=>{
    
      if(data.status =="sucess")
      {
        this._mesgBox.showSucess(data.message);
        this.router.navigate(['/DealHUB/dashboard']);
      }
      else{
        this._mesgBox.showError(data.message);
        this.router.navigate(['/DealHUB/dashboard']);
      }
    });
  }
  
  // setStep(index: number) {
  //   this.step = index;
  // }
  downloadCoversheet(event)
  {
    event.preventDefault();
    if(this._obfservices.obfsummarymodel.uploadDetails[0].OBFFilepath== "")
    {
      this._mesgBox.showError("No Supporting Documents to Download");
    }
    else
    {
      window.open('http://13.235.216.142/dealhubapiqa/' + this._obfservices.obfsummarymodel.uploadDetails[0].OBFFilepath);
    }
          
  }
  downloaddocument(event)
  {
    
      
  }
  downloadLOIp(event)
  {
    event.preventDefault();

  }
  getdetailsfordh_id(dh_id)
  {
    this._obfservices.getobfsummarydata(dh_id).subscribe(res =>{
      console.log(res);
      this._obfservices.initializeobf(JSON.parse(res));
    },
    (error)=>{
      alert(error.message);
    }
    );
   
  }
  Type:string="";
  OpenDocDownload(event,Type)
  {
    this.Type=Type;
    this.uploadDocfiles=[];
    this.uploaddocprocess=[];
    if(this.Type == "loipo")
  {
    this.uploadDocfiles=this.loipofiles;
    this.LoiPoprogress= this.uploaddocprocess;
  }
  else if(this.Type == "Supporting")
  {
    this.uploadDocfiles=this.supportfiles;
    this.SupportPoprogress= this.uploaddocprocess;
  }
  else if(this.Type == "FinalAgg")
  {
    this.uploadDocfiles=this.FinalAggfiles;
    this.finalProgress= this.uploaddocprocess;
  }
    const dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '500px',
      height:'600px',
      disableClose: true,
     // data: { campaignId: this.params.id }
  })
 


  }
  public checkError = (controlName: string, errorName: string) => {
    return this.obfsummaryform.controls[controlName].hasError(errorName);
  }

  RejectDeatils()
  {  if(this.obfsummaryform.get("comments").value == "")
  {
     //return this.obfsummaryform.controls["comments"].hasError("required");
     this.obfsummaryform.controls["comments"].markAsTouched();
     this.noComment = true;
    return false;
  }
    this._obfservices._approveRejectModel.isapproved=0;
    this._obfservices._approveRejectModel.rejectcomment=this.obfsummaryform.get("comments").value;
    this._obfservices._approveRejectModel.rejectionto=0;
    this._obfservices._approveRejectModel._dh_id=this._obfservices.obfsummarymodel.uploadDetails[0].dh_id;
    this._obfservices._approveRejectModel._dh_header_id=this._obfservices.obfsummarymodel.uploadDetails[0].dh_header_id;
    this._obfservices._approveRejectModel._fname="";
    this._obfservices._approveRejectModel._fpath="";
    this._obfservices._approveRejectModel._created_by=localStorage.getItem("user_id");
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
  progress: number = 0;
  uploadDocfiles:File[]=[];
  loipofiles: File[] = [];
  supportfiles: File[] = [];    
  FinalAggfiles:File[]=[];    
  
 
  LoiPoprogress: any[] = [];
  uploaddocprocess:any[]=[];
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
           if(this._obfservices.ObfCreateForm.get("Loipodropdown").value == null)
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
     if(this.Type == "loipo")
    {
      //this.isloipo = !this.isloipo;
     
    }
    else if(this.Type == "support")
    {
      
      // this.isSupport = !this.isSupport;
    }
		console.log(event);
		files.splice(files.indexOf(event), 1);
   
    if(this.loipofiles.length == 0)
      {
        
       this.loipofiles=files;
       this.uploadDocfiles=this.loipofiles;
      }
    if(this.supportfiles.length == 0)
    {
      //this.isloipo = !this.isloipo;
      this.supportfiles=files;
      this._obfservices.ObfCreateForm.patchValue({Supportpath: ""});
    }

	}


  SaveAttachment()
  {
    //this.isloipo = !this.isloipo;
    this._obfservices.SaveAttachment(this.Attachments).subscribe(result=>
      {
          console.log(result);
          var REsult=JSON.parse(result);
          if(REsult[0].status ="Success")
          {
            this._mesgBox.showSucess("Attachment Uploaded Successfully.");
           
            this.Attachments=[];
            this.dialog.closeAll();

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
         this.SaveAttachmentParameter._description = "loipo";
         this.Attachments.push(this.SaveAttachmentParameter);
        }
        else if(this.Type  == "Supporting")
        {
          this.supportdocpath = path;
          this.SaveAttachmentParameter._dh_id=this.dh_id;
          this.SaveAttachmentParameter._dh_header_id=this.dh_header_id;
          this.SaveAttachmentParameter._fname= files[i].name; 
           this.SaveAttachmentParameter._fpath = path;
           this.SaveAttachmentParameter._description = "Supporting";
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

  GetDetailTimelineHistory()
  {
    
    this._obfservices.GetDetailTimelineHistory(this.dh_id,this.dh_header_id).subscribe(Result=>{
      debugger;
      console.log("DashBoardData");
      console.log(Result);
      var loginresult =Result;
      this.dashboardData=JSON.parse(Result);
      this.listData = new MatTableDataSource(this.dashboardData);
     
    },
    (error:HttpErrorResponse)=>{
      debugger;
      if (error.status==401)
      {
        this.router.navigateByUrl('/login');
        
      }
      
    }
    );
  
  }
 
  }