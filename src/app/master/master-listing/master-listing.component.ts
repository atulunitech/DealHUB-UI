import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {FormBuilder,FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBoxComponent } from 'src/app/shared/MessageBox/MessageBox.Component';
import { MasterService } from '../services/master.service';

class Mstcommonparameters
{
  _domain_id:number
  _domain_code:string
  _domain_name:string
  _active:number
  _user_id:string;
}
@Component({
  selector: 'app-master-listing',
  templateUrl: './master-listing.component.html',
  styleUrls: ['./master-listing.component.scss']
})
export class MasterListingComponent implements OnInit {
@Input() masterType : any;
 displayedColumns:Array<any>;
//FormGroup Declartaion
 public ProjectTypeForm:FormGroup;
 public PrivilegeForm:FormGroup;
 public RoleForm:FormGroup;
 public Forms:FormGroup;

  constructor(private router: Router,private route:ActivatedRoute,public _masterservice:MasterService,private _mesgBox: MessageBoxComponent) { }
  userdetails :Mstcommonparameters;
  UsersColumn: string[] = ['user_code', 'first_name', 'last_name', 'mobile_no','email_id','useractive'];
  ProjectTypeColumn: string[] = ['Project_Code','Project_Name','Active','ProjectTypeAction'];
  PrivilegeColumn:string[]=['privilege_name','ProjectTypeAction'];
  RolesColumn:string[]=['role_code','role_name','equivalent_cassh_role_name','Active','ProjectTypeAction'];
  formsColumn:string[]=['form_name','url','Active','ProjectTypeAction'];
  PrivilegeId:number=0;
  @ViewChild(MatSort) sort: MatSort;
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
    if( this.masterType=="Project Type")
    {
      this.ProjectTypeForm = new FormGroup({
        // Validators.email,
        ProjectCode : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
        ProjectName : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
        ProjectStatus:new FormControl("",[Validators.required])
      });
    }
   else if(this.masterType=="Privilege")
   {
    this.PrivilegeForm = new FormGroup({
      // Validators.email,
      privilege_name : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      role_name:new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      equivalent_cassh_role_name:new FormControl('', [Validators.required,this.NoInvalidCharacters]),

    });
   }
   else if( this.masterType=="Roles" )
   {
    this.RoleForm = new FormGroup({
      // Validators.email,
      Role_code : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      role_name:new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      equivalent_cassh_role_name:new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      privilege:new FormControl('', [Validators.required]),
      Rolestatus:new FormControl("", [Validators.required]),
    });
    
   }
   else if( this.masterType=="Forms" )
   {
    this.Forms = new FormGroup({
      // Validators.email,
      Role_code : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      role_name:new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      equivalent_cassh_role_name:new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      privilege:new FormControl('', [Validators.required]),
      Rolestatus:new FormControl("", [Validators.required]),
    });
   }
  
  }
  // Users Type Start

  casshChange()
  {
    alert("changes");
  }
  getdataforusers()
  {
    this.userdetails._user_id = localStorage.getItem('UserCode');
    this._masterservice.getusermaster(this.userdetails).subscribe(res =>{
      console.log(res);
      res =JSON.parse(res);
      this.dashboardData = res.mst_users;
      this.BindGridDetails();
      this.displayedColumns=this.UsersColumn;
    },
   error =>
   {
    this._mesgBox.showError(error.message);
   });
  }

  //User Type End

 

  //Common fUnction start
  pageTitle()
  {
   return this.masterType;
  }
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
  
  switchtotypeapi(type)
  {
     switch (type) {
       case "Users":
         this.getdataforusers();
         break;
      case "ProjectType":
        this.GetMstDomains();
        this.masterType="Project Type";
        break;
        case "Privilege":
          this.GetMstPrivilege();
          this.masterType="Privilege";
          break;
          case "Roles":
            this.GetMstRole();
            this.masterType="Roles";
            break;
            case "Forms":
              this.GetMstForms();
              this.masterType="Forms";
              break;
       default:
         break;
     }
  }
  NoInvalidCharacters(control: AbstractControl): {[key: string]: any} | null  {
    var format = /[<>'"&]/;
    if (control.value && format.test(control.value) || (control.value && control.value.includes("%3e"))) {
      return { 'invalidservices': true };
    }
    return null;
  }
  public checkError = (controlName: string, errorName: string) => {
    if( this.masterType=="Project Type")
  {
    return this.ProjectTypeForm.controls[controlName].hasError(errorName);
  }
  else if(this.masterType=="Privilege")
  {
    return this.PrivilegeForm.controls[controlName].hasError(errorName);
  }
  else if(this.masterType=="Roles")
  {
    return this.RoleForm.controls[controlName].hasError(errorName);
  }
    
  }
  ShowEditType(Details)
{
  if( this.masterType=="Project Type")
  {
    this.ShowProjectTypeEdit=true;
    this.DomainId=Details.domain_id;
  
    this.ProjectTypeForm.controls.ProjectCode.setValue(Details.Project_Code);
    this.ProjectTypeForm.controls.ProjectName.setValue(Details.Project_Name);
    this.ProjectTypeForm.controls.ProjectStatus.setValue(Details.Active=="Active"?"1":"0");
  }
  else if(this.masterType=="Privilege")
  {
    this.ShowPrivilegeEdit=true;
    this.PrivilegeId=Details.privilege_Id;
  
    this.PrivilegeForm.controls.privilege_name.setValue(Details.privilege_name);
  }
  else if(this.masterType=="Roles")
  {

    this.ShowRoleEdit=true;
    this.Role_id=Details. id;
    this.RoleForm.controls.Role_code.setValue(Details.role_code);
    this.RoleForm.controls.role_name.setValue(Details.role_name);
    this.RoleForm.controls.Rolestatus.setValue(Details.Active=="Active"?"1":"0");
    this.RoleForm.controls.equivalent_cassh_role_name.setValue(Details.equivalent_cassh_role_name);
  }
  }
  Canceltype()
  {
    if( this.masterType=="Project Type")
    {
      this.ShowProjectTypeEdit=false;
      this.ProjectTypeForm.controls.ProjectCode.setValue("");
      this.ProjectTypeForm.controls.ProjectName.setValue("");
      this.ProjectTypeForm.controls.ProjectStatus.setValue("");
    }
    else if(this.masterType=="Privilege")
    {
      this.ShowPrivilegeEdit=false;
      this.PrivilegeForm.controls.privilege_name.setValue("");
    }
    else if(this.masterType=="Roles")
    {
     this.ShowRoleEdit==false;

    }
    

    
  }
  //Common function End

  
  dashboardData:any[]=[];
  columns:Array<any>;
  listData: MatTableDataSource<any>;
  
createType()
{
  if(this.masterType=="Project Type")
  {
    this.ShowProjectTypeEdit=true;
    this.DomainId=0;
  }
  else if(this.masterType=="Privilege")
  {
    this.ShowPrivilegeEdit=true;
    this.PrivilegeId=0;
  }
  else if(this.masterType=="Roles")
  {
    this.ShowRoleEdit=true;
    this.Role_id=0;
  }

}
//project Type Start
ShowProjectTypeEdit:boolean=false;
ShowPrivilegeEdit:boolean=false;
DomainId:number=0;
Role_id:number=0;
ShowRoleEdit:boolean=false;
GetMstDomains()
{
 
  this._masterservice.GetMstDomains().subscribe((Result)=>
  {
    console.log(Result);
    var res=JSON.parse(Result);
   
     
    this.dashboardData=res.domains;
  
    this.BindGridDetails();
    this.displayedColumns=this.ProjectTypeColumn;
   
  })
  
}

SubmitProjectType(ProjectTypeForm)
{
  this._masterservice.Mst_Domains._active= this.ProjectTypeForm.controls.ProjectStatus.value;
  this._masterservice.Mst_Domains._domain_code=this.ProjectTypeForm.controls.ProjectCode.value;
  this._masterservice.Mst_Domains._domain_name=this.ProjectTypeForm.controls.ProjectName.value;
  this._masterservice.Mst_Domains._domain_id=this.DomainId;
  this._masterservice.Mst_Domains._user_id=localStorage.getItem("UserCode");
  this._masterservice.Update_Mst_Domains( this._masterservice.Mst_Domains).subscribe((Result)=>{
    console.log(Result);
    var Res=JSON.parse(Result);
    this._mesgBox.showSucess(Res[0].message);
    this.clearProjectTypedata();
    this.ShowProjectTypeEdit=false;
    this.GetMstDomains();
  });
}
clearProjectTypedata()
{
  this._masterservice.Mst_Domains._active=0;
  this._masterservice.Mst_Domains._domain_name="";
  this._masterservice.Mst_Domains._domain_code="";
  this._masterservice.Mst_Domains._domain_id=0;
  this._masterservice.Mst_Domains._user_id="";
 this.DomainId=0;
 this.ProjectTypeForm.controls.ProjectCode.setValue("");
 this.ProjectTypeForm.controls.ProjectName.setValue("");
 this.ProjectTypeForm.controls.ProjectStatus.setValue("");

}
//Project Type End

//Privilege start
GetMstPrivilege()
  {
    this._masterservice.GetMstPrivilege().subscribe((Result)=>{
      console.log(Result);
    var res=JSON.parse(Result);
    this.dashboardData=res.mst_privilege;
  
    this.BindGridDetails();
    this.displayedColumns=this.PrivilegeColumn;
    });
  }
  SubmitPrivilegeType()
{
  this._masterservice.Mst_privilege._privilege_Id=this.PrivilegeId;
  this._masterservice.Mst_privilege._privilege_name=this.PrivilegeForm.controls.privilege_name.value;
  
  this._masterservice.Mst_privilege._user_id=localStorage.getItem("UserCode");
  this._masterservice.Update_Mst_Privilege( this._masterservice.Mst_privilege).subscribe((Result)=>{
    console.log(Result);
    var Res=JSON.parse(Result);
    this._mesgBox.showSucess(Res[0].message);
    this.Canceltype();
    this.ShowPrivilegeEdit=false;
    this.GetMstPrivilege();
  });
}
//Privilege End
//Roles Start

GetMstRole()
{
  this._masterservice.GetMstRole().subscribe((Result)=>{
    console.log(Result);
  var res=JSON.parse(Result);
  this.dashboardData=res.mst_roles;
this._masterservice.PrivilegeList=res.mst_privilege;
  this.BindGridDetails();
  this.displayedColumns=this.RolesColumn;
  });
}
SubmitRoleType()
{
  this._masterservice.mst_roles._id=this.Role_id;
  this._masterservice.mst_roles._role_name=this.RoleForm.controls.role_name.value;
  this._masterservice.mst_roles._role_code=this.RoleForm.controls.Role_code.value;
  this._masterservice.mst_roles._equivalent_cassh_role_name=this.RoleForm.controls.equivalent_cassh_role_name.value;
  this._masterservice.mst_roles._Previlege_Id=this.RoleForm.controls.privilege.value;
  this._masterservice.mst_roles._active=this.RoleForm.controls.Rolestatus.value;
  this._masterservice.Update_Mst_Roles(this._masterservice.mst_roles).subscribe((Result)=>{
    console.log(Result);
  });
  

}
//Roles End
//Forms Start
GetMstForms()
{
  this._masterservice.GetMstForms().subscribe((Result)=>{
    console.log(Result);
    var res=JSON.parse(Result);
    this.dashboardData=res.Table;
  
    this.BindGridDetails();
    this.displayedColumns=this.formsColumn;
  })
}
//Forms End
}
