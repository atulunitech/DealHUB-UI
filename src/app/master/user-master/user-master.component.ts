import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MessageBoxComponent } from 'src/app/shared/MessageBox/MessageBox.Component';
import { MasterService, userdashboardupdate } from '../services/master.service';

class Mstcommonparameters
{
  _domain_id:number
  _domain_code:string
  _domain_name:string
  _active:number
  _user_id:string;
}

class branch{
  value:string
  viewValue:string
  selected:boolean
}

class vertical{
  value:string
  viewValue:string
  selected:boolean
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && control.touched);
  }
}

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss']
})

export class UserMasterComponent implements OnInit {
@Input() masterType : any;

  constructor(private router: Router,private route:ActivatedRoute,
    public _masterservice:MasterService,private _mesgBox: MessageBoxComponent,public commonService:CommonService,
    public dialog: MatDialog) { }
  userdetails :Mstcommonparameters;
  mst_roles_array = [];
  mst_branches_array = [];
  enablecreate:boolean = false;
  edit_branches_array = [];
  mst_verical_array = [];
  edit_vertical_array = [];
  searchwords: string="";
  removable = true;
  displaydiv = false;
  showhidevertical = false;
  showhidebranch = false;
  selectable = true;
  filteredSearchData: Observable<branch[]>;
  filteredSearchDatavertical: Observable<branch[]>;
  barnch_array_selected = [];
  vertical_array_selected = [];
  branchchips = [];
  branchchipstodisplay = [];
  verticalchips = [];
  verticalchipstodisplay = [];
  userfilter = [];
  userlabel:string = "Create User";
  branchSearchControl = new FormControl();
  vericalSearchControl = new FormControl();
  testsearchControl = new FormControl();
  matcher = new MyErrorStateMatcher();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;
  UsersColumn: string[] = ['User_Code', 'First_Name', 'Last_Name', 'Mobile_No','Email_Id','usercash','userlocked','userstatus','useraction'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('branchinput') branchinput: ElementRef;
  @ViewChild('allbranchchck') allbranchchck: ElementRef;
  @ViewChild('allverticalchck') allverticalchck: ElementRef;
  @ViewChild('verticalinput') verticalinput: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
     this.paginator = mp;
    
     }
  ngOnInit(): void {
    
    this.userdetails = new Mstcommonparameters();
    this.route.queryParams.subscribe
    (params => {
      if(params['type'] != undefined)
      {
        let type = params['type'].toString().trim();
        this.switchtotypeapi(type);
      }
    }
    );
   
  }

  ngAfterViewInit() {
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;

}

showhideverticalFn()
{
  this.showhidevertical = !this.showhidevertical;
  this.vertical_array_selected.forEach(elt =>{
    if(elt.selected == false)
    {
      this.allverticalselected = false;
      this.allverticalchck['checked'] = false;
    }
  });
}
clickOutside() {
  this.showhidevertical = !this.showhidevertical;
  this.vertical_array_selected.forEach(elt =>{
    if(elt.selected == false)
    {
      this.allverticalselected = false;
      this.allverticalchck['checked'] = false;
    }
  });
}

showhidebranchFn()
{
  this.showhidebranch = !this.showhidebranch;
  this.barnch_array_selected.forEach(elt =>{
    if(elt.selected == false)
    {
      this.allbranchselected = false;
      this.allbranchchck['checked'] = false;
    }
  });
}

showhidebrranchfn_out()
{
  this.showhidebranch = !this.showhidebranch;
  this.barnch_array_selected.forEach(elt =>{
    if(elt.selected == false)
    {
      this.allbranchselected = false;
      this.allbranchchck['checked'] = false;
    }
  });
}


  applyFilter() {
    this.listData.filter = this.searchwords.trim().toLowerCase();
  }

  displayFn(branch: branch): string {
    return branch && branch.viewValue ? branch.viewValue : '';
  }
  private _filter(value: string): string[] {
    let filterValue ="";
    if((value != null || value != "") && typeof value === "string")
    {
     filterValue = value.toLowerCase();
    return this.barnch_array_selected.filter((data: any) => data.viewValue.toLowerCase().includes(filterValue));
   }
   else
   {
    return this.barnch_array_selected;
   }
  }

  private _filtervertical(value: string): string[] {
    let filterValue ="";
    if((value != null || value != "") && typeof value === "string")
    {
     filterValue = value.toLowerCase();
    return this.vertical_array_selected.filter((data: any) => data.viewValue.toLowerCase().includes(filterValue));
   }
   else
   {
    return this.vertical_array_selected;
   }
  }

  removesearch(branch)
  {
    const index = this.branchchips.indexOf(branch);
    if (index >= 0) {
      this.branchchips.splice(index, 1);
      this.branchchipstodisplay.splice(index, 1);
    }
     
    if(this.branchchips.length >= 4)
      {
        if(this.branchchipstodisplay.length < 4)
      {
        if(index == 0)
        {
          this.branchchipstodisplay.push(this.branchchips[index + 1]);
        }else
        {
        this.branchchipstodisplay.push(this.branchchips[index]);
      }
      }
      }

    this.barnch_array_selected.forEach(elt =>{
      if(elt == branch)
      {
        elt.selected = false;
        this.allbranchselected = false;
        this.allbranchchck['checked'] = false;
      }
    });
    let branchid = "";
    this.branchchips.forEach(element =>{
         branchid += element.value +",";     
    });

   // this.branchinput.nativeElement.value = '...'+this.branchchips.length;
    branchid = branchid.substring(0,branchid.length - 1);
    this._masterservice.usermasterform.controls.branch.setValue(branchid);
  }

  removesearchvertical(vertical)
  {
    const index = this.verticalchips.indexOf(vertical);
    if (index >= 0) {
      this.verticalchips.splice(index, 1);
      this.verticalchipstodisplay.splice(index, 1);
    }
    
    if(this.verticalchips.length >= 4)
    {
      if(this.verticalchipstodisplay.length < 4)
    {
      if(index == 0)
      {
        this.verticalchipstodisplay.push(this.verticalchips[index + 1]);
      }else
      {
      this.verticalchipstodisplay.push(this.verticalchips[index]);
    }
    }
    }

    this.vertical_array_selected.forEach(elt =>{
      if(elt == vertical)
      {
        elt.selected = false;
        this.allverticalselected = false;
        this.allverticalchck['checked'] = false;
      }
    });
    let verticalid = "";
    this.verticalchips.forEach(element =>{
      verticalid += element.value +",";     
    });
   // this.verticalinput.nativeElement.value = '...'+this.verticalchips.length;
    verticalid = verticalid.substring(0,verticalid.length - 1);
    this._masterservice.usermasterform.controls.verticals.setValue(verticalid);
  }

  toggleSelection(event,option)
  {
    if(event.checked)
    {
      
      this.branchchips.push(option);
      option.selected = true;
      this.allbranchselected = this.barnch_array_selected.every(function(item:any) {
        return item.selected == true;
      });
      if(this.branchchipstodisplay.length < 4)
      {
      this.branchchipstodisplay = [...this.branchchipstodisplay, option];
      }
    }
    else
    {
      let index = this.branchchips.findIndex(obj => obj == option);
      if(index > -1)
      {
        this.branchchips.splice(index,1);
        this.branchchipstodisplay.splice(index,1);
        option.selected = false;
      }

      if(this.branchchips.length >= 4)
      {
        if(this.branchchipstodisplay.length < 4)
      {
        if(index == 0)
        {
          this.branchchipstodisplay.push(this.branchchips[index + 1]);
        }else
        {
        this.branchchipstodisplay.push(this.branchchips[index]);
      }
      }
      }
      this.allbranchselected = false;
      this.allbranchchck['checked'] = false;
    }
    // if(this.branchchips.length > 2)
    // {
    // this.branchinput.nativeElement.value = '...'+this.branchchips.length;
    // }
    // else
    // {
    //   this.branchinput.nativeElement.value = "";
    // }
    this.branchSearchControl.setValue(null);
    let branchid = "";
    this.branchchips.forEach(element =>{
         branchid += element.value +",";     
    });
    branchid = branchid.substring(0,branchid.length - 1);
    this._masterservice.usermasterform.controls.branch.setValue(branchid);
  }

  toggleSelectionvertical(event,option)
  {
    if(event.checked)
    {
      this.verticalchips.push(option)
      option.selected = true;
      this.allverticalselected = this.vertical_array_selected.every(function(item:any) {
        return item.selected == true;
      });
      if(this.verticalchipstodisplay.length < 4)
      {
      this.verticalchipstodisplay = [...this.verticalchipstodisplay, option];
      }
    }
    else
    {
      let index = this.verticalchips.findIndex(obj => obj == option);
      if(index > -1)
      {
        this.verticalchips.splice(index,1);
        this.verticalchipstodisplay.splice(index,1);
        option.selected = false;
      }

      if(this.verticalchips.length >= 4)
    {
      if(this.verticalchipstodisplay.length < 4)
    {
      if(index == 0)
      {
        this.verticalchipstodisplay.push(this.verticalchips[index + 1]);
      }else
      {
      this.verticalchipstodisplay.push(this.verticalchips[index]);
    }
    }
    }
    this.allverticalselected = false;
    this.allverticalchck['checked'] = false;
    }
    // if(this.verticalchips.length > 2)
    // {
    // this.verticalinput.nativeElement.value = '...'+this.verticalchips.length;
    // }
    // else
    // {
    //   this.verticalinput.nativeElement.value = "";
    // }
    this.vericalSearchControl.setValue(null);
    let verticalid = "";
    this.verticalchips.forEach(element =>{
      verticalid += element.value +",";     
    });
    verticalid = verticalid.substring(0,verticalid.length - 1);
    this._masterservice.usermasterform.controls.verticals.setValue(verticalid);
  }

  selectallbranch(event)
  {
    if(event.checked)
    {
      this.branchchipstodisplay = [];
      this.barnch_array_selected.forEach(elt =>{
        elt.selected = true;
      });
      this.branchchips = this.barnch_array_selected.slice();
      this.branchchips.forEach(elt =>{
         if(this.branchchipstodisplay.length < 4)
         {
           this.branchchipstodisplay.push(elt);
         }
      });
    }
    else
    {
      this.barnch_array_selected.forEach(elt =>{
        elt.selected = false;
      });
      this.branchchips = [];
      this.branchchipstodisplay = [];
    }
    // if(this.branchchips.length > 2)
    // {
    // this.branchinput.nativeElement.value = '...'+this.branchchips.length;
    // }
    // else
    // {
    //   this.branchinput.nativeElement.value = "";
    // } 

    let branchid = "";
    this.branchchips.forEach(element =>{
         branchid += element.value +",";     
    });
    branchid = branchid.substring(0,branchid.length - 1);
    this._masterservice.usermasterform.controls.branch.setValue(branchid);
  }

  ClearAllBranch()
  {
    if(this.showhidebranch)
    {
    this.allbranchchck['checked'] = false;
    }
    this.barnch_array_selected.forEach(elt =>{
      elt.selected = false;
    });
    this.branchchips = [];
    this.branchchipstodisplay = [];
    let branchid = "";
    this.branchchips.forEach(element =>{
         branchid += element.value +",";     
    });
    branchid = branchid.substring(0,branchid.length - 1);
    this._masterservice.usermasterform.controls.branch.setValue(branchid);
  }

  selectallvertical(event)
  {
    if(event.checked)
    {
      this.verticalchipstodisplay = [];
      this.vertical_array_selected.forEach(elt =>{
        elt.selected = true;
      });
      this.verticalchips = this.vertical_array_selected.slice();
      this.verticalchips.forEach(elt =>{
        if(this.verticalchipstodisplay.length < 4)
        {
          this.verticalchipstodisplay.push(elt);
        }
     });
    }
    else
    {
      this.vertical_array_selected.forEach(elt =>{
        elt.selected = false;
      });
      this.verticalchips = [];
      this.verticalchipstodisplay = [];
    }
    // if(this.verticalchips.length > 2)
    // {
    // this.verticalinput.nativeElement.value = '...'+this.verticalchips.length;
    // }
    // else
    // {
    //   this.verticalinput.nativeElement.value = "";
    // }
    let verticalid = "";
    this.verticalchips.forEach(element =>{
      verticalid += element.value +",";     
    });
    verticalid = verticalid.substring(0,verticalid.length - 1);
    this._masterservice.usermasterform.controls.verticals.setValue(verticalid);
  }

  ClearAllVerticals()
  {
    if(this.showhidevertical)
    {
    this.allverticalchck['checked'] = false;
    }
    this.vertical_array_selected.forEach(elt =>{
      elt.selected = false;
    });
    this.verticalchips = [];
    this.verticalchipstodisplay = [];
    let verticalid = "";
    this.verticalchips.forEach(element =>{
      verticalid += element.value +",";     
    });
    verticalid = verticalid.substring(0,verticalid.length - 1);
    this._masterservice.usermasterform.controls.verticals.setValue(verticalid);
  }

  clearinput(evt)
  {
    console.log(evt.target.value);
    evt.target.value = "";
    //alert("function called");
    //this.vericalSearchControl.setValue(null);
  }

  lockunlockuser(evt,data)
  {
    console.log(evt);
    var target = evt.target || evt.srcElement || evt.currentTarget;
    var srcAttr = target.attributes.src;

    let model = new userdashboardupdate();
    model._is_cassh_user = data.is_cassh_user;
    model._id = data.id;
    model._active = data.active;
    model._islocked = data.islocked == 0 ? 1: 0;
    model._user_id =   this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
    
    const message = data.islocked == 0? "Are you sure you want to lock this user?":"Are you sure you want to unlock this user?";
   let result = false;
  const dialogData = new ConfirmDialogModel("Confirm Action", message);

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    // maxWidth: "400px",
    panelClass: 'custom-modalbox-as',
      backdropClass: 'popupBackdropClass',
    data: dialogData
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
   // this.result = dialogResult;
     if(dialogResult)
     {
      this._masterservice.updateuserdashboard(model).subscribe(res =>{
        console.log(res);
        res = JSON.parse(res);
        data.islocked = data.islocked == 0 ? 1: 0;
        srcAttr.nodeValue = data.islocked == 1 ? 'assets/images/copay_icon.png' : 'assets/images/change_pass_icon.png';
        this._mesgBox.showSucess(res[0].message);
      },
      error =>
         {
          this._mesgBox.showError(error.message);
         });
     }
  });


  //  srcAttr.nodeValue = 'assets/images/copay_icon.png';
   // alert(srcAttr.nodeValue);
    console.log(srcAttr.nodeValue);
  }
  
  casshChange(evt,data)
  {
    if(data.is_cassh_user == 0)
    {
      evt.checked = true;
        evt.source._checked =true;
    }
    else
    {
      evt.checked = false;
        evt.source._checked =false;
    }
    let model = new userdashboardupdate();
    if(evt.checked)
    {
      model._is_cassh_user = 1;
    }
    else
    {
      model._is_cassh_user =0;
    }
    model._id = data.id;
    model._active = data.active;
    model._islocked = data.islocked;
    model._user_id =  this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
    //alert(evt.checked);
    //let res =  this.confirmDialog("Are you sure to change to cash users?");
    
   // console.log(res);
  const message = "Are you sure to change to cash users?";
   let result = false;
  const dialogData = new ConfirmDialogModel("Confirm Action", message);

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    // maxWidth: "400px",
    panelClass: 'custom-modalbox-as',
      backdropClass: 'popupBackdropClass',
    data: dialogData
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
   // this.result = dialogResult;
     if(dialogResult)
     {
      this._masterservice.updateuserdashboard(model).subscribe(res =>{
        console.log(res);
        res = JSON.parse(res);
        if(data.is_cassh_user == 0)
        {
          data.is_cassh_user = 1;
        }
        else
        {
          data.is_cassh_user = 0;
        }
        this._mesgBox.showSucess(res[0].message);
      },
      error =>
         {
          this._mesgBox.showError(error.message);
         });
     }
     else
     {
       if(evt.checked)
       {
      //  evt.checked = false;
        evt.source._checked =false;
       }
       else
       {
       // evt.checked = true;
        evt.source._checked =true;
       }
     }
  });
  }

  switchtotypeapi(type)
  {
     switch (type) {
       case "Users":
         this.getdataforusers();
         break;
     
       default:
         break;
     }
  }

  getdataforusers()
  {
    this.barnch_array_selected = [];
    this.vertical_array_selected = [];
    this._masterservice.createusermasterform();
    this.userdetails._user_id = localStorage.getItem('UserCode');
    this._masterservice.getusermaster(this.userdetails).subscribe(res =>{
      console.log(res);
      res =JSON.parse(res);
      this.dashboardData = res.mst_users;
      this.userfilter = this.dashboardData;
      this.mst_roles_array = res.mst_roles;
      this.mst_branches_array = res.mst_branch;
      this.edit_branches_array = res.map_users_branch;
      this.mst_verical_array = res.mst_verticals;
      this.edit_vertical_array = res.map_user_verticals;
      this.bindbranchtoarray(this.mst_branches_array);
      this.bindverticaltoarray(this.mst_verical_array);
      this.BindGridDetails();
      this.displayedColumns=this.UsersColumn;

    },
   error =>
   {
    this._mesgBox.showError(error.message);
   });
  }
  
  addSearch(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    
    // Add our fruit
    if ((value || '').trim()) {
    // this.filtersToSearch.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    console.log("checking in chip");
   // console.log(this._obfservices.obfmodel);
  }

  Showdiv()
  {
    this.enablecreate = true;
    this.allbranchselected = false;
  this.allverticalselected = false;
    this._masterservice.createusermasterform();
    this.barnch_array_selected.forEach(elt =>{
       elt.selected = false;
    });
    this.vertical_array_selected.forEach(elt =>{
      elt.selected = false;
   });
    this.branchchips = [];
    this.branchchipstodisplay = [];
    this.verticalchips = [];
    this.verticalchipstodisplay = [];
    this.displaydiv = true;
  }

  bindbranchtoarray(arr)
  {
    arr.forEach(element => {
      let elt = new branch();
      elt.viewValue = element.viewValue;
      elt.value = element.value;
      elt.selected = false;
      this.barnch_array_selected.push(elt);
    });
    console.log("check array with selected");
    console.log(this.barnch_array_selected);
     
    this.filteredSearchData = this.branchSearchControl.valueChanges.pipe(
      startWith(""),
      //map(value => value != null && value.length >= 1?this._filter(value):this.barnch_array_selected.slice())
       map(value => value?this._filter(value): this.barnch_array_selected.slice())
    );
    //this.filteredSearchData = this.barnch_array_selected;
  }

  bindverticaltoarray(arr)
  {
    arr.forEach(element => {
      let elt = new branch();
      elt.viewValue = element.viewValue;
      elt.value = element.value;
      elt.selected = false;
      this.vertical_array_selected.push(elt);
    });
    console.log("check vertical array with selected");
    console.log(this.vertical_array_selected);
     
    this.filteredSearchDatavertical = this.vericalSearchControl.valueChanges.pipe(
      startWith(""),
      //map(value => value != null && value.length >= 1?this._filter(value):this.barnch_array_selected.slice())
       map(value => value?this._filtervertical(value): this.vertical_array_selected.slice())
    );

    // this.filteredOptions = this.searchTextboxControl.valueChanges
    //   .pipe(
    //     startWith<string>(''),
    //     map(name => this._filtertest(name))
    //   );
    
    //this.filteredSearchData = this.barnch_array_selected;
  }
  pageTitle()
  {
   return this.masterType;
  }
  displayedColumns:Array<any>;
  dashboardData:any[]=[];
  columns:Array<any>;
  listData: MatTableDataSource<any>;
  BindGridDetails()// code given by kirti kumar shifted to new function
  {
    
    const columns = this.dashboardData
    .reduce((columns, row) => {
      return [...columns, ...Object.keys(row)]
    }, [])
    .reduce((columns, column) => {
      return columns.includes(column)
        ? columns
        : [...columns, column]
    }, [])

  // Describe the columns for <mat-table>.
  this.columns = columns.map(column => {
    return { 
      columnDef: column,
      header: column.replace("_"," "),
      cell: (element: any) => `${element[column] ? element[column] : ``}`     
    }
  })
  this.displayedColumns = this.columns.map(c => c.columnDef);
 
  this.listData = new MatTableDataSource(this.dashboardData);
  this.listData.sort = this.sort;
  this.listData.paginator = this.paginator;
  //this.displayedColumns.push('ActionDraft');
   
 // this.theRemovedElement  = this.columns.shift();
}

onToggleGroupChange(evt,data)
{
  let model = new userdashboardupdate();
 model._is_cassh_user = data.is_cassh_user;
 model._id = data.id;
 model._active = evt.value;
 model._islocked = data.islocked == 0 ? 1: 0;
 model._user_id = localStorage.getItem('UserCode');
 // console.log(evt.value);

 const message = data.active == "0"? "Are you sure you want to activate this user acount?":"Are you sure you want to deactivate this user account?";
 let result = false;
const dialogData = new ConfirmDialogModel("Confirm Action", message);

const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  // maxWidth: "400px",
  panelClass: 'custom-modalbox-as',
      backdropClass: 'popupBackdropClass',
  data: dialogData
});

dialogRef.afterClosed().subscribe(dialogResult => {
 // this.result = dialogResult;
   if(dialogResult)
   {
    this._masterservice.updateuserdashboard(model).subscribe(res =>{
      console.log(res);
      res = JSON.parse(res);
      data.active = evt.value;
      //srcAttr.nodeValue = data.islocked == 1 ? 'assets/images/copay_icon.png' : 'assets/images/change_pass_icon.png';
      this._mesgBox.showSucess(res[0].message);
    },
    error =>
       {
        this._mesgBox.showError(error.message);
       });
   }
   else
   {
    let toggle = evt.source;
      if (toggle) {
        let group = toggle.buttonToggleGroup;
        group.value =evt.value == "1"?"0":"1";
    }
   }
});



}

hidediv()
{
  this.displaydiv = false;
}

allbranchselected:boolean = false;
allverticalselected:boolean = false;
getusereditdetails(data)
{
 // let abc = JSON.stringify(this._masterservice.intialformvalue) != JSON.stringify(this._masterservice.usermasterform.value);
   if(this.enablecreate && (JSON.stringify(this._masterservice.intialformvalue) != JSON.stringify(this._masterservice.usermasterform.value)))
 // if(this.enablecreate && (this._masterservice.usermasterform.dirty))
  {
    if(confirm("Current Form is unsaved,Do you wish to continue?"))
    {

    }
    else{
      return false;
    }
  }
  this.enablecreate = false;
  this._masterservice.createusermasterform();
  this.allbranchselected = true;
  this.allverticalselected = true;
  this.displaydiv = true;
  this.userlabel = "Edit :"+data.First_Name+" "+data.Last_Name;
  this.branchchips =[];
  this.verticalchips = [];
  this.verticalchipstodisplay = [];
  this.branchchipstodisplay = [];
  console.log(data);
  this._masterservice.usermasterform.controls.usercode.setValue(data.User_Code);
  this._masterservice.usermasterform.controls.firstname.setValue(data.First_Name);
  this._masterservice.usermasterform.controls.lastname.setValue(data.Last_Name);
  this._masterservice.usermasterform.controls.role.setValue(data.role_id);
  this._masterservice.usermasterform.controls.email.setValue(data.Email_Id);
  this._masterservice.usermasterform.controls.mobile.setValue(data.Mobile_No);
  this._masterservice.usermasterform.controls.Active.setValue(data.active);
  
  this._masterservice.usermodel._id = data.id;
  this._masterservice.usermodel._is_cassh_user = data.is_cassh_user;
  this._masterservice.usermodel._islocked = data.islocked;
  this._masterservice.usermodel._active = data.active;

  let edit_branch_list = this.edit_branches_array.filter(obj => obj.User_Id == data.id );

  let edit_vertical_list = this.edit_vertical_array.filter(obj => obj.User_Id == data.id );

  this.barnch_array_selected.forEach(elt =>{
    elt.selected = false;
  });

  this.vertical_array_selected.forEach(elt =>{
    elt.selected = false;
  });

  this.barnch_array_selected.forEach(elt =>{
    edit_branch_list.forEach(obj =>{
        if(elt.value == obj.branch_id)
        {
          elt.selected = true;
          this.branchchips.push(elt);
          if(this.branchchipstodisplay.length < 4)
          {
            this.branchchipstodisplay.push(elt);
          }
	       let branchid = "";
    this.branchchips.forEach(element =>{
         branchid += element.value +",";     
    });
    branchid = branchid.substring(0,branchid.length - 1);
    this._masterservice.usermasterform.controls.branch.setValue(branchid);
        }
    });
  });

  this.vertical_array_selected.forEach(elt =>{
    edit_vertical_list.forEach(obj =>{
        if(elt.value == obj.Vertical_Id)
        {
          elt.selected = true;
          this.verticalchips.push(elt);
          if(this.verticalchipstodisplay.length < 4)
          {
            this.verticalchipstodisplay.push(elt);
          }
	       let verticalid = "";
    this.verticalchips.forEach(element =>{
      verticalid += element.value +",";     
    });
    verticalid = verticalid.substring(0,verticalid.length - 1);
    this._masterservice.usermasterform.controls.verticals.setValue(verticalid);
        }
    });
  });

  this.barnch_array_selected.forEach(elt =>{
    if(elt.selected == false)
    {
      this.allbranchselected = false;
    }
  });

  this.vertical_array_selected.forEach(elt =>{
    if(elt.selected == false)
    {
      this.allverticalselected = false;
    }
  });
  
  // if(this.branchchips.length > 2)
  //   {
  //   this.branchinput.nativeElement.value = '...'+this.branchchips.length;
  //   }
  //   else
  //   {
  //     this.branchinput.nativeElement.value = "";
  //   }

  // if(this.verticalchips.length > 2)
  //   {
  //   this.verticalinput.nativeElement.value = '...'+this.verticalchips.length;
  //   }
  //   else
  //   {
  //     this.verticalinput.nativeElement.value = "";
  //   }

  // edit_branch_list.forEach(element => {
  //   let elt = new branch();
  //   elt.viewValue = element.viewValue;
  //   elt.value = element.branch_id;
  //   elt.selected = false;
  //   this.vertical_array_selected.push(elt);
  // });
    
}

SaveUsers()
{
  console.log(this._masterservice.usermasterform.value);
  if(this._masterservice.usermodel._id == null)
  {
  this._masterservice.usermodel._id = 0;
  this._masterservice.usermodel._is_cassh_user = 0;
  //this._masterservice.usermodel._active = "0";
  this._masterservice.usermodel._islocked = 0;
}


  this._masterservice.usermodel._user_code = this._masterservice.usermasterform.controls.usercode.value;
  this._masterservice.usermodel._first_name = this._masterservice.usermasterform.controls.firstname.value;
  this._masterservice.usermodel._last_name = this._masterservice.usermasterform.controls.lastname.value;
  this._masterservice.usermodel._mobile_no = this._masterservice.usermasterform.controls.mobile.value;
  this._masterservice.usermodel._email_id = this._masterservice.usermasterform.controls.email.value;
  this._masterservice.usermodel._role_id = this._masterservice.usermasterform.controls.role.value;

  this._masterservice.usermodel._active = this._masterservice.usermasterform.controls.Active.value;
  
  this._masterservice.usermodel._mappedverticals =  this._masterservice.usermasterform.controls.verticals.value;
  this._masterservice.usermodel._mappedbranches =  this._masterservice.usermasterform.controls.branch.value;
  this._masterservice.usermodel._user_id = this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
 
  this._masterservice.updateusermaster(this._masterservice.usermodel).subscribe(res =>{
    res = JSON.parse(res);
		this._mesgBox.showSucess(res[0].message);
    // setTimeout(() => {
    //   window.location.reload();
    // },2000);
     this.displaydiv = false;
     this.getdataforusers();
    this.paginator.firstPage();
    //this.router.navigate(['/DealHUB/master/masterlist'],{ queryParams: { type:'Users' } });
   // window.location.reload();
 },
  (error:HttpErrorResponse) =>
     {
      this._mesgBox.showError(error.error.Record.MESSAGE);
     });
}

// confirmDialog(msg): boolean {
//   const message = msg;
//    let result = false;
//   const dialogData = new ConfirmDialogModel("Confirm Action", message);

//   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
//     maxWidth: "400px",
//     data: dialogData
//   });

//   dialogRef.afterClosed().subscribe(dialogResult => {
//    // this.result = dialogResult;
//    result =  dialogResult;
//   });
//   return result;
 
// }

// multiselect test
// selectedValues = [];
// filteredOptions: Observable<any[]>;
// searchTextboxControl = new FormControl();
// @ViewChild('search') searchTextBox: ElementRef;

// openedChange(e) {
//   // Set search textbox value as empty while opening selectbox 
//   this.searchTextboxControl.patchValue('');
//   // Focus to search textbox while clicking on selectbox
//   if (e == true) {
//     this.searchTextBox.nativeElement.focus();
//   }
  
// }

// clearSearch(event) {
//   event.stopPropagation();
//   this.searchTextboxControl.patchValue('');
// }


//  selectionChange(event) {
//   if (event.isUserInput && event.source.selected == false) {
//     let index = this.selectedValues.indexOf(event.source.value);
//     this.selectedValues.splice(index, 1)
//   }
// }

// private _filtertest(name: string): String[] {
//   const filterValue = name.toLowerCase();
//   // Set selected values to retain the selected checkbox state 
//   this.setSelectedValues();
//   this._masterservice.usermasterform.controls.verticals.patchValue(this.selectedValues);
//   let filteredList = this.vertical_array_selected.filter(data => data.viewValue.toLowerCase().includes(filterValue));
//   return filteredList;
// }

// setSelectedValues() {
//   console.log('selectFormControl', this._masterservice.usermasterform.controls.verticals.value);
//   if (this._masterservice.usermasterform.controls.verticals.value && this._masterservice.usermasterform.controls.verticals.value.length > 0) {
//     this._masterservice.usermasterform.controls.verticals.value.forEach((e) => {
//       if (this.selectedValues.indexOf(e) == -1) {
//         this.selectedValues.push(e);
//       }
//     });
//   }

// }
}