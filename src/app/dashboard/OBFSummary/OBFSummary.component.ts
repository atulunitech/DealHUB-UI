import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit,AfterViewInit, ViewChild } from '@angular/core';
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
import { Router } from '@angular/router';

@Component({
    selector: 'app-obfSummary',
    templateUrl: './OBFSummary.component.html',
    styleUrls: ['./OBFSummary.component.scss']
  })

  export class OBFSummaryComponent implements OnInit,AfterViewInit {
   
    // comments = new FormControl('', Validators.required);
    obfsummaryform = new FormGroup({
      comments : new FormControl("",[Validators.required])
    });
    noComment:boolean=false;
    constructor(private sanitizer:DomSanitizer,
        public _obfservices:OBFServices,private dialog:MatDialog,

        private _mesgBox: MessageBoxComponent,private datepipe: DatePipe,private router: Router) 
      { 

        this._obfservices.Obfsummarysubject.subscribe(data=>{
          console.log(data +" :data");
        });
      }
      
  ngOnInit(): void {
    // this._obfservices.Obfsummarysubject.subscribe(data=>{
    //   console.log(data +" :data");
    // })
    

    console.log(this._obfservices.obfsummarymodel);
  }
  ngAfterViewInit(){
    this._obfservices.getobfsummarydataonRefresh().subscribe(data=>{
      console.log(data +" :data on nginit");
    });
  }
  // {
  //   "isapproved": 0,
  //   "rejectcomment": "string",
  //   "rejectionto": 0,
  //   "_dh_id": 0,
  //   "_dh_header_id": 0,
  //   "_fname": "string",
  //   "_fpath": "string",
  //   "_created_by": "string"
  // }
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
      }
      else{
        this._mesgBox.showError(data.message);
      }
    });
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
      }
      else{
        this._mesgBox.showError(res[0].message);
      }
    });

  }

  }