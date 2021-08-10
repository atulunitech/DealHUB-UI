import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {FormBuilder,FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBoxComponent } from 'src/app/shared/MessageBox/MessageBox.Component';
import { MasterService, PrivilegeList } from '../services/master.service';

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
 public VerticalForm:FormGroup;

public pagesListForm:FormGroup;
  constructor(private router: Router,private route:ActivatedRoute,public _masterservice:MasterService,private _mesgBox: MessageBoxComponent) { }
  userdetails :Mstcommonparameters;
  UsersColumn: string[] = ['user_code', 'first_name', 'last_name', 'mobile_no','email_id','useractive'];
  ProjectTypeColumn: string[] = ['Project_Code','Project_Name','Active','ProjectTypeAction'];
  PrivilegeColumn:string[]=['privilege_name','Active','ProjectTypeAction'];
  RolesColumn:string[]=['role_code','role_name','equivalent_cassh_role_name','Active','ProjectTypeAction'];
  formsColumn:string[]=['form_name','url','Active','ProjectTypeAction'];
  VerticalColumn:string[]=['Vertical_code','Vertical_name','Function_code','Active','ProjectTypeAction'];
  PrivilegeId:number=0;
  FormId:number=0;
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
      PrivilegeStatus:new FormControl("", [Validators.required]),

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
    this.pagesListForm = new FormGroup({
      // Validators.email,
      Form_name : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      Form_Url:new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      FormStatus:new FormControl("", [Validators.required]),
    });
   }
  else if(this.masterType=="Vertical")
  {
    this.VerticalForm=new FormGroup({
      VerticalName:new FormControl('',[Validators.required,this.NoInvalidCharacters]),
      VerticalCode: new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      Function:new FormControl('', [Validators.required]),
      Sector:new FormControl("", [Validators.required]),
      VerticalStatus:new FormControl("", [Validators.required]),

    })
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
      case "Vertical":
                this.GetMstVerticals();
                this.masterType="Vertical";
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
  else if(this.masterType=="Forms")
  {
    return this.pagesListForm.controls[controlName].hasError(errorName);
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
    this.PrivilegeForm.controls.PrivilegeStatus.setValue(Details.Active=="Active"?"1":"0");
    
  }
  else if(this.masterType=="Roles")
  {

    this.ShowRoleEdit=true;
    this.Role_id=Details. id;
    this.RoleForm.controls.Role_code.setValue(Details.role_code);
    this.RoleForm.controls.role_name.setValue(Details.role_name);
    this.RoleForm.controls.Rolestatus.setValue(Details.Active=="Active"?"1":"0");
    
    this.RoleForm.controls.equivalent_cassh_role_name.setValue(Details.equivalent_cassh_role_name);

    if(this._masterservice.map_privilege_role.length != null)
    {
      let locationarray=[];
   for(var i=0;i<this._masterservice.map_privilege_role.length;i++)
   {

      if(this._masterservice.map_privilege_role[i].role_id== this.Role_id)
      {
        locationarray.push(this._masterservice.map_privilege_role[i].Previlege_Id);
      
      }
  
    } 
    this.RoleForm.controls.privilege.patchValue(locationarray);
    }
  
  }
  else if(this.masterType=="Forms")
  {
    this.ShowFormEdit=true;
    this.FormId=Details.id;
  
    this.pagesListForm.controls.Form_name.setValue(Details.form_name);
    this.pagesListForm.controls.Form_Url.setValue(Details.url);
    this.pagesListForm.controls.FormStatus.setValue(Details.Active=="Active"?"1":"0");
  }
  else if(this.masterType=="Vertical")
  {
    this.ShowVerticalEdit=true;
    this.VerticalId=Details.Vertical_id
    this.VerticalForm.controls.VerticalName.setValue(Details.Vertical_name);
    this.VerticalForm.controls.VerticalCode.setValue(Details.Vertical_code);
    this.VerticalForm.controls.Function.setValue(Details.Function_id);
    this.VerticalForm.controls.VerticalStatus.setValue(Details.Active=="Active"?"1":"0");
    if(this._masterservice.map_vertical_sector.length != null)
    {
      let locationarray=[];
   for(var i=0;i<this._masterservice.map_vertical_sector.length;i++)
   {

      if(this._masterservice.map_vertical_sector[i].vertical_id== this.VerticalId)
      {
        locationarray.push(this._masterservice.map_vertical_sector[i].sector_id);
      
      }
  
    } 
    this.VerticalForm.controls.Sector.patchValue(locationarray);
    }
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
      
      this._masterservice.Mst_Domains._active=0;
      this._masterservice.Mst_Domains._domain_name="";
      this._masterservice.Mst_Domains._domain_code="";
      this._masterservice.Mst_Domains._domain_id=0;
      this._masterservice.Mst_Domains._user_id="";
      this.DomainId=0;
      this.GetMstDomains();
 
    }
    else if(this.masterType=="Privilege")
    {
      this.ShowPrivilegeEdit=false;
      this.PrivilegeForm.controls.privilege_name.setValue("");

      this.GetMstPrivilege();
    }
    else if(this.masterType=="Roles")
    {
     this.ShowRoleEdit==false;
     this.Role_id=0;
     this.RoleForm.controls.Role_code.setValue("");
     this.RoleForm.controls.role_name.setValue("");
     this.RoleForm.controls.Rolestatus.setValue("");
     this.RoleForm.controls.equivalent_cassh_role_name.setValue("");
     this.GetMstRole();
    }
    
    else if(this.masterType=="Forms")
    {
     this.ShowFormEdit=false;
     this.FormId=0;
     this.pagesListForm.controls.Form_name.setValue("");
     this.pagesListForm.controls.Form_Url.setValue("");
     this.pagesListForm.controls.FormStatus.setValue("");
     this.GetMstForms();
     
    }
    else if(this.masterType=="Vertical")
    {
      this.ShowVerticalEdit=false;
      this.VerticalId=0;
      this.VerticalForm.controls.VerticalName.setValue("");
      this.VerticalForm.controls.VerticalCode.setValue("");
      this.VerticalForm.controls.Function.setValue("");
      this.VerticalForm.controls.Sector.setValue("");
      this.VerticalForm.controls.VerticalStatus.setValue("");
      this.GetMstVerticals();
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
  else if(this.masterType=="Forms")
  {
    this.ShowFormEdit=true;
    this.FormId=0;
  }
  else if(this.masterType=="Vertical")
  {
    this.ShowVerticalEdit=true;
    this.VerticalId=0;
  }

}
//project Type Start
ShowVerticalEdit:boolean=false;
ShowProjectTypeEdit:boolean=false;
ShowPrivilegeEdit:boolean=false;
DomainId:number=0;
Role_id:number=0;
VerticalId:number=0;
ShowRoleEdit:boolean=false;
ShowFormEdit:boolean=false;
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
    this.Canceltype();
    this.ShowProjectTypeEdit=false;
    this.GetMstDomains();
  });
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
  this._masterservice.Mst_privilege._active=this.PrivilegeForm.controls.PrivilegeStatus.value;
  this._masterservice.Mst_privilege._user_id=localStorage.getItem("UserCode");
  this._masterservice.Update_Mst_Privilege( this._masterservice.Mst_privilege).subscribe((Result)=>{
    console.log(Result);
    var Res=JSON.parse(Result);
    this.Canceltype();
    this._mesgBox.showSucess(Res[0].message);
   
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
this._masterservice.map_privilege_role=res.map_privilege_role;
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
  
  this._masterservice.mst_roles._active=this.RoleForm.controls.Rolestatus.value;
  var tempservicecat="";
  if(this.RoleForm.controls.privilege.value.length!=0)
  {
    tempservicecat += this.RoleForm.controls.privilege.value;
    
  }
  this._masterservice.mst_roles._Previlege_Id=tempservicecat;
  this._masterservice.mst_roles._user_id=localStorage.getItem("UserCode");

  this._masterservice.Update_Mst_Roles(this._masterservice.mst_roles).subscribe((Result)=>{
    console.log(Result);
    var res=JSON.parse(Result);
    this.Canceltype();
    if(res[0].status=="success")
    {
      this._mesgBox.showSucess(res[0].message);
    }
    else 
    {
      this._mesgBox.showError(res[0].message);
    }
  
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
SubmitFormList()
{
  this._masterservice.mst_Forms._form_name=this.pagesListForm.controls.Form_name.value;
  this._masterservice.mst_Forms._url=this.pagesListForm.controls.Form_Url.value;
  this._masterservice.mst_Forms._active=this.pagesListForm.controls.FormStatus.value;
  this._masterservice.mst_Forms._id=this.FormId;
  this._masterservice.mst_Forms. _user_id=localStorage.getItem("UserCode");
  this._masterservice.Update_Mst_Forms(this._masterservice.mst_Forms).subscribe((Result)=>{
    var res=JSON.parse(Result);
    this.Canceltype();
    if(res[0].status=="success")
    {
      this._mesgBox.showSucess(res[0].message);
    }
    else 
    {
      this._mesgBox.showError(res[0].message);
    }
   
  })
  
}
//Forms End

//Vertical start
GetMstVerticals()
{
  this._masterservice.GetMstVerticals().subscribe((Result)=>{
    console.log(Result);
    var res=JSON.parse(Result);
    this.dashboardData=res.mst_verticals;
    this._masterservice.FunctionList=res.mst_functions;
    this._masterservice.SectorList=res.mst_sector;
    this._masterservice.map_vertical_sector=res.map_vertical_sector;
    this.BindGridDetails();
    this.displayedColumns=this.VerticalColumn;
  })
}
Update_Mst_Verticals()
{
  var tempservicecat="";
  if(this.VerticalForm.controls.Sector.value.length!=0)
  {
    tempservicecat += this.VerticalForm.controls.Sector.value;
    
  }
  this._masterservice.mst_verticals._vertical_id=this.VerticalId;
  this._masterservice.mst_verticals._vertical_name=this.VerticalForm.controls.VerticalName.value;
  this._masterservice.mst_verticals._vertical_code=this.VerticalForm.controls.VerticalCode.value;
  this._masterservice.mst_verticals._function_id=this.VerticalForm.controls.Function.value;
  this._masterservice.mst_verticals._active=this.VerticalForm.controls.VerticalStatus.value;
  this._masterservice.mst_verticals._Sector_Id=tempservicecat;
  this._masterservice.mst_verticals._user_id=localStorage.getItem("UserCode");
  this._masterservice.Update_Mst_Verticals(this._masterservice.mst_verticals).subscribe((Result)=>{
    var res=JSON.parse(Result);
    this.Canceltype();
    if(res[0].status=="success")
    {
      this._mesgBox.showSucess(res[0].message);
    }
    else 
    {
      this._mesgBox.showError(res[0].message);
    }
  })

}
//Vertical End
}
