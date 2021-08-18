import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {FormBuilder,FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
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
 public pagesListForm:FormGroup;
 public PrivilegeForm:FormGroup;
public RoleForm:FormGroup;
public BranchForm:FormGroup;
public SectorForm:FormGroup;
public SubSectorForm:FormGroup;
public SolutionCategoryForm:FormGroup;
public SolutionForm:FormGroup;
public DOAForm:FormGroup;
public BusinessForm:FormGroup;
public CommentForm:FormGroup;
enablecreate:boolean = false;
createoredit:string = "";
dontshowforDOA:boolean = true;
  constructor(private router: Router,private route:ActivatedRoute,public commonService:CommonService,
    public _masterservice:MasterService,private _mesgBox: MessageBoxComponent) { }
  userdetails :Mstcommonparameters;
  UsersColumn: string[] = ['user_code', 'first_name', 'last_name', 'mobile_no','email_id','useractive'];
  ProjectTypeColumn: string[] = ['Project_Code','Project_Name','Active','ProjectTypeAction'];
  formsColumn:string[]=['form_name','url','Active','ProjectTypeAction'];
  VerticalColumn:string[]=['Vertical_code','Vertical_name','Function_code','Active','ProjectTypeAction'];
  PrivilegeColumn:string[]=['privilege_name','Active','ProjectTypeAction'];
  //PrivilegeColumn:string[]=['privilege_name','ProjectTypeAction'];
  RolesColumn:string[]=['role_code','role_name','equivalent_cassh_role_name','Active','ProjectTypeAction'];
  BranchColumn: string[] = ['Branch_Name','Active','ProjectTypeAction'];
  CommentTypeColumn: string[] = ['Comment_Type','ProjectTypeAction'];
  SectorColumn: string[] = ['Sector_Name','Active','ProjectTypeAction'];
  SubSectorColumn: string[] = ['SubSector_Name','Sector_Name','ProjectTypeAction'];
  SolutionCategoryColumn: string[] = ['solutioncategory_name','Active','ProjectTypeAction'];
  SolutionColumn: string[] = ['Solution_Name','Solution_Category','Function_Name','Domain','Active','ProjectTypeAction'];
  DOAColumn: string[] = ['Message','Prefix','Message_For','ProjectTypeAction'];
  BusinessColumn: string[] = ['Business_Code','Business_Name','Active','ProjectTypeAction'];
  Sectordropdown:any[] = [];
  SolutionCategorydropdown:any[] = [];
  FormId:number=0;
  public VerticalForm:FormGroup;
  functiondropdown:any[] = [];
  domaindropdown:any[] = [];
  PrivilegeId:number=0;
  searchwords: string="";
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
     this.paginator = mp;
    
     }
   
     ngAfterViewInit() {
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
  
  }
    
     applyFilter() {
      this.listData.filter = this.searchwords.trim().toLowerCase();
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
      PrivilegeStatus:new FormControl("", [Validators.required])

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
      Rolestatus:new FormControl("", [Validators.required])
    });
    
   }
   else if(this.masterType == "Branch")
   {
    this.BranchForm = new FormGroup({
      Branch_Name : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      Active : new FormControl('', [Validators.required])
    });
   }
   else if(this.masterType == "Comment Type")
   {
    this.CommentForm = new FormGroup({
      Comment : new FormControl('', [Validators.required,this.NoInvalidCharacters])
    });
   }
   else if(this.masterType == "Sector")
   {
    this.SectorForm = new FormGroup({
      Sector_Name : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      Active : new FormControl('', [Validators.required])
    });
   }
   else if(this.masterType == "SubSector")
   {
    this.SubSectorForm = new FormGroup({
      SubSector_Name : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      Sector_Id : new FormControl('', [Validators.required])
    });
   }
   else if(this.masterType == "Solution Category")
   {
    this.SolutionCategoryForm = new FormGroup({
      SolutionCategory_Name : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      Active : new FormControl('', [Validators.required])
    });
   }
   else if(this.masterType == "Solution")
   {
    this.SolutionForm = new FormGroup({
      Solution_Name : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      Function : new FormControl('', [Validators.required]),
      SolutionCategory : new FormControl('', [Validators.required]),
      Domain : new FormControl('', [Validators.required]),
      Active : new FormControl('', [Validators.required])
    });
   }
   else if(this.masterType == "DOA Matrix Messages")
   {
    this.DOAForm = new FormGroup({
      Message : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      Prefix : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
      MessageFor : new FormControl('', [Validators.required,this.NoInvalidCharacters])
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
      VerticalStatus:new FormControl("", [Validators.required])

    })
  }
  else if(this.masterType == "Business Type")
  {
   this.BusinessForm = new FormGroup({
     BusinessCode : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
     BusinessName : new FormControl('', [Validators.required,this.NoInvalidCharacters]),
     Active : new FormControl('', [Validators.required])
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
            case "Branch":
              this.GetMstBranch();
              this.masterType="Branch";
              break;
              case "Comment":
                this.GetMstCommentType();
                this.masterType="Comment Type";
                break;
                case "Sector":
                this.GetMstSector();
                this.masterType="Sector";
                break;

                case "SubSector":
                this.GetMstSubSector();
                this.masterType="SubSector";
                break;

                case "SolutionCategory":
                this.GetMstSolutionCategory();
                this.masterType="Solution Category";
                break;

                case "Solution":
                this.GetMstSolution();
                this.masterType="Solution";
                break;

                case "doa":
                this.dontshowforDOA = false;
                this.GetMstDoa();
                this.masterType="DOA Matrix Messages";
                break;
                case "Forms":
                  this.GetMstForms();
                  this.masterType="Forms";
                  break;
                case "Vertical":
                    this.GetMstVerticals();
                    this.masterType="Vertical";
                    break;
                    case "Business":
                      this.GetMstBusiness();
                      this.masterType="Business Type";
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
  else if(this.masterType=="Branch")
  {
    return this.BranchForm.controls[controlName].hasError(errorName);
  }
  else if(this.masterType=="Comment Type")
  {
    return this.CommentForm.controls[controlName].hasError(errorName);
  }
  else if(this.masterType=="Sector")
  {
    return this.SectorForm.controls[controlName].hasError(errorName);
  }
  else if(this.masterType=="SubSector")
  {
    return this.SubSectorForm.controls[controlName].hasError(errorName);
  }
  else if(this.masterType=="Solution Category")
  {
    return this.SolutionCategoryForm.controls[controlName].hasError(errorName);
  }
  else if(this.masterType=="Solution")
  {
    return this.SolutionForm.controls[controlName].hasError(errorName);
  }
  else if(this.masterType=="DOA Matrix Messages")
  {
    return this.DOAForm.controls[controlName].hasError(errorName);
  }
  else if(this.masterType=="Forms")
  {
    return this.pagesListForm.controls[controlName].hasError(errorName);
  }
  else if(this.masterType=="Vertical")
  {
    return this.VerticalForm.controls[controlName].hasError(errorName);
  }
  else if(this.masterType=="Business Type")
  {
    return this.BusinessForm.controls[controlName].hasError(errorName);
  }
  }
  ShowEditType(Details)
{ 
  this.enablecreate = false;
  if( this.masterType=="Project Type")
  {
    this.ShowProjectTypeEdit=true;
    this.DomainId=Details.domain_id;
    this.createoredit = "Edit : "+Details.Project_Name;
    this.ProjectTypeForm.controls.ProjectCode.setValue(Details.Project_Code);
    this.ProjectTypeForm.controls.ProjectName.setValue(Details.Project_Name);
    this.ProjectTypeForm.controls.ProjectStatus.setValue(Details.Active=="Active"?"1":"0");
  }
  else if(this.masterType=="Privilege")
  {
    this.ShowPrivilegeEdit=true;
    this.PrivilegeId=Details.privilege_Id;
    this.createoredit = "Edit : "+Details.privilege_name;
    this.PrivilegeForm.controls.privilege_name.setValue(Details.privilege_name);
    this.PrivilegeForm.controls.PrivilegeStatus.setValue(Details.Active=="Active"?"1":"0");
    
  }
  else if(this.masterType=="Roles")
  {

    this.ShowRoleEdit=true;
    this.Role_id=Details. id;
    this.createoredit = "Edit : "+Details.role_name;
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
  else if(this.masterType=="Branch")
  {
    this._masterservice.createnewbranchmodel();
    this.ShowBranchEdit=true;
    this.createoredit = "Edit : "+Details.Branch_Name;
    this._masterservice.branchmodel._branch_id = Details.branch_id ;
    this.BranchForm.controls.Branch_Name.setValue(Details.Branch_Name);
    this.BranchForm.controls.Active.setValue(Details.Active == "Active"?"1":"0");
  }
  else if(this.masterType=="Comment Type")
  {
    this._masterservice.createnewcommentmodel();
    this.ShowCommentEdit=true;
    this.createoredit = "Edit : "+Details.Comment_Type;
    this._masterservice.commentmodel._comment_type_id = Details.comment_type_id ;
    this.CommentForm.controls.Comment.setValue(Details.Comment_Type);
    //this.BranchForm.controls.Active.setValue(Details.Active == "Active"?"1":"0");
  }
  else if(this.masterType=="Sector")
  {
    this._masterservice.createnewsectormodel();
    this.ShowSectorEdit=true;
    this.createoredit = "Edit : "+Details.Sector_Name;
    this._masterservice.sectormodel._Sector_Id = Details.Sector_Id ;
    this.SectorForm.controls.Sector_Name.setValue(Details.Sector_Name);
    this.SectorForm.controls.Active.setValue(Details.Active == "Active"?"1":"0");
  }
  else if(this.masterType=="SubSector")
  {
    this._masterservice.createnewsubsectormodel();
    this.ShowSubSectorEdit=true;
    this.createoredit = "Edit : "+Details.SubSector_Name;
    this._masterservice.subsectormodel._SubSector_Id = Details.SubSector_Id ;
    this.SubSectorForm.controls.SubSector_Name.setValue(Details.SubSector_Name);
    this.SubSectorForm.controls.Sector_Id.setValue(Details.Sector_Id);
  }
  else if(this.masterType=="Solution Category")
  {
    this._masterservice.createnewsolutioncategorymodel();
    this.ShowSolutionCategoryEdit=true;
    this.createoredit = "Edit : "+Details.solutioncategory_name;
    this._masterservice.solutioncategorymodel._solutioncategory_Id = Details.solutioncategory_Id ;
    this.SolutionCategoryForm.controls.SolutionCategory_Name.setValue(Details.solutioncategory_name);
    this.SolutionCategoryForm.controls.Active.setValue(Details.Active == "Active"?"1":"0");
  }
  else if(this.masterType=="Solution")
  {
    this._masterservice.createnewsolutionmodel();
    this.ShowSolutionEdit=true;
    this.createoredit = "Edit : "+Details.Solution_Name;
    this._masterservice.solutionmodel._Solution_Id = Details.Solution_Id ;
    this.SolutionForm.controls.Solution_Name.setValue(Details.Solution_Name);
    this.SolutionForm.controls.Function.setValue(Details.function_id);
    this.SolutionForm.controls.SolutionCategory.setValue(Details.Solutioncategory_Id);
    this.SolutionForm.controls.Domain.setValue(Details.domain_id);
    this.SolutionForm.controls.Active.setValue(Details.Active == "Active"?"1":"0");
  }
  else if(this.masterType=="DOA Matrix Messages")
  {
    this._masterservice.createnewdoamodel();
    this.ShowDOAEdit=true;
    this.createoredit = "Edit : "+Details.Message;
    this._masterservice.doamodel._DOA_Matrix_Id = Details.DOA_Matrix_Id ;
    this.DOAForm.controls.Message.setValue(Details.Message);
    this.DOAForm.controls.Prefix.setValue(Details.Prefix);
    this.DOAForm.controls.MessageFor.setValue(Details.Message_For);
  }
  else if(this.masterType=="Forms")
  {
    this.ShowFormEdit=true;
    this.FormId=Details.id;
    this.createoredit = "Edit : "+Details.form_name;
    this.pagesListForm.controls.Form_name.setValue(Details.form_name);
    this.pagesListForm.controls.Form_Url.setValue(Details.url);
    this.pagesListForm.controls.FormStatus.setValue(Details.Active=="Active"?"1":"0");
  }
  else if(this.masterType=="Vertical")
  {
    this.ShowVerticalEdit=true;
    this.VerticalId=Details.Vertical_id
    this.createoredit = "Edit : "+Details.Vertical_name;
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
  else if(this.masterType=="Business Type")
  {
    this._masterservice.createnewbusinessmodel();
    this.ShowBusinessEdit=true;
    this.createoredit = "Edit : "+Details.Business_Name;
    this._masterservice.businessmodel._function_id = Details.function_id ;
    this.BusinessForm.controls.BusinessCode.setValue(Details.Business_Code);
    this.BusinessForm.controls.BusinessName.setValue(Details.Business_Name);
    this.BusinessForm.controls.Active.setValue(Details.Active == "Active"?"1":"0");
  }
  }
  Canceltype()
  {
    if( this.masterType=="Project Type")
    {
      this.ShowProjectTypeEdit=false;
      this.GetMstDomains();
      this.ProjectTypeForm.controls.ProjectCode.setValue("");
      this.ProjectTypeForm.controls.ProjectName.setValue("");
      this.ProjectTypeForm.controls.ProjectStatus.setValue("");
    }
    else if(this.masterType=="Privilege")
    {
      this.ShowPrivilegeEdit=false;
      this.GetMstPrivilege();
      this.PrivilegeForm.controls.privilege_name.setValue("");
      this.PrivilegeForm.controls.ProjectStatus.setValue("");
      
    }
    else if(this.masterType=="Roles")
    {
      this.ShowRoleEdit=false;
     this.GetMstRole();
    
     this.Role_id=0;
     this.RoleForm.controls.Role_code.setValue("");
     this.RoleForm.controls.role_name.setValue("");
     this.RoleForm.controls.Rolestatus.setValue("");
     this.RoleForm.controls.equivalent_cassh_role_name.setValue("");
   
    }
    else if(this.masterType=="Branch")
    {
      this.ShowBranchEdit = false;
      this.BranchForm.controls.Branch_Name.setValue("");
      this.BranchForm.controls.Active.setValue("");
    }
    else if(this.masterType=="Comment Type")
    {
      this.ShowCommentEdit = false;
      this.CommentForm.controls.Comment.setValue("");
     // this.BranchForm.controls.Active.setValue("");
    }
    else if(this.masterType=="Sector")
    {
      this.ShowSectorEdit = false;
      this.SectorForm.controls.Sector_Name.setValue("");
      this.SectorForm.controls.Active.setValue("");
    }
    else if(this.masterType=="SubSector")
    {
      this.ShowSubSectorEdit = false;
      
      this.SubSectorForm.controls.SubSector_Name.setValue("");
      this.SubSectorForm.controls.Sector_Id.setValue("");
    }
    else if(this.masterType=="Solution Category")
    {
      this.ShowSolutionCategoryEdit = false;
      this.SolutionCategoryForm.controls.SolutionCategory_Name.setValue("");
      this.SolutionCategoryForm.controls.Active.setValue("");

    }
    else if(this.masterType=="Solution")
    {
      this.ShowSolutionEdit = false;
      this.SolutionForm.controls.Solution_Name.setValue("");
    this.SolutionForm.controls.Function.setValue("");
    this.SolutionForm.controls.SolutionCategory.setValue("");
    this.SolutionForm.controls.Domain.setValue("");
    this.SolutionForm.controls.Active.setValue("");
    }
    else if(this.masterType=="DOA Matrix Messages")
    {
      this.ShowDOAEdit = false;
      this.DOAForm.controls.Message.setValue("");
      this.DOAForm.controls.Prefix.setValue("");
      this.DOAForm.controls.MessageFor.setValue("");
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
    else if(this.masterType=="Business Type")
    {
      this.ShowBusinessEdit = false;
      this.BusinessForm.controls.BusinessCode.setValue("");
      this.BusinessForm.controls.BusinessName.setValue("");
      this.BusinessForm.controls.Active.setValue("");
    }

    
  }
  //Common function End

  
  dashboardData:any[]=[];
  columns:Array<any>;
  listData: MatTableDataSource<any>;
  
createType()
{
  this.enablecreate = true;
  if(this.masterType=="Project Type")
  {
    this.ShowProjectTypeEdit=true;
    this.DomainId=0;
    this.createoredit = "Create Project Type";
    this.ProjectTypeForm.controls.ProjectCode.setValue("");
      this.ProjectTypeForm.controls.ProjectName.setValue("");
      this.ProjectTypeForm.controls.ProjectStatus.setValue("");
    

  }
  else if(this.masterType=="Privilege")
  {
    this.ShowPrivilegeEdit=true;
    this.PrivilegeId=0;
    this.createoredit = "Create Privilege Type";
    this.PrivilegeForm.controls.privilege_name.setValue("");
    this.PrivilegeForm.controls.ProjectStatus.setValue("");
  }
  else if(this.masterType=="Roles")
  {
    this.ShowRoleEdit=true;
    this.Role_id=0;
    this.createoredit = "Create Roles Type";
    this.RoleForm.controls.Role_code.setValue("");
     this.RoleForm.controls.role_name.setValue("");
     this.RoleForm.controls.Rolestatus.setValue("");
     this.RoleForm.controls.equivalent_cassh_role_name.setValue("");
  }
  else if(this.masterType == "Branch")
  {
    this.createoredit = "Create Branch";
    this.ShowBranchEdit=true;
    this._masterservice.createnewbranchmodel();
    this._masterservice.branchmodel._branch_id = 0;
    this.BranchForm.controls.Branch_Name.setValue("");
    this.BranchForm.controls.Active.setValue("");
  }
  else if(this.masterType == "Comment Type")
  {
    this.ShowCommentEdit=true;
    this.createoredit = "Create Comment Type";
    this._masterservice.createnewcommentmodel();
    this._masterservice.commentmodel._comment_type_id = 0;
    //this.CommentControl.setValue("");
    this.CommentForm.controls.Comment.setValue("");
  }
  else if(this.masterType == "Sector")
  {
    this.ShowSectorEdit=true;
    this.createoredit = "Create Sector";
    this._masterservice.createnewsectormodel();
    this._masterservice.sectormodel._Sector_Id = 0;
    this.SectorForm.controls.Sector_Name.setValue("");
    this.SectorForm.controls.Active.setValue("");
  }
  else if(this.masterType == "SubSector")
  {
    this.ShowSubSectorEdit=true;
    this.createoredit = "Create SubSector";
    this._masterservice.createnewsubsectormodel();
    this._masterservice.subsectormodel._SubSector_Id = 0;
    this.SubSectorForm.controls.SubSector_Name.setValue("");
    this.SubSectorForm.controls.Sector_Id.setValue("");
  }
  else if(this.masterType == "Solution Category")
  {
    this.ShowSolutionCategoryEdit=true;
    this.createoredit = "Create Solution Category";
    this._masterservice.createnewsolutioncategorymodel();
    this._masterservice.solutioncategorymodel._solutioncategory_Id = 0;
    this.SolutionCategoryForm.controls.SolutionCategory_Name.setValue("");
    this.SolutionCategoryForm.controls.Active.setValue("");
  }
  else if(this.masterType == "Solution")
  {
    this.ShowSolutionEdit=true;
    this.createoredit = "Create Solution";
    this._masterservice.createnewsolutionmodel();
    this._masterservice.solutionmodel._Solution_Id = 0;
    this.SolutionForm.controls.Solution_Name.setValue("");
    this.SolutionForm.controls.Function.setValue("");
    this.SolutionForm.controls.SolutionCategory.setValue("");
    this.SolutionForm.controls.Domain.setValue("");
    this.SolutionForm.controls.Active.setValue("");
  }
  else if(this.masterType == "DOA Matrix Messages")
  {
    this.ShowDOAEdit=true;
    this.createoredit = "Create DOA Matrix Messages";
    this._masterservice.createnewdoamodel();
    this._masterservice.doamodel._DOA_Matrix_Id = 0;
    this.DOAForm.controls.Message.setValue("");
    this.DOAForm.controls.Prefix.setValue("");
    this.DOAForm.controls.MessageFor.setValue("");
  }
  else if(this.masterType=="Forms")
  {
    this.ShowFormEdit=true;
    this.FormId=0;
    this.createoredit = "Create Forms Type";
    this.pagesListForm.controls.Form_name.setValue("");
    this.pagesListForm.controls.Form_Url.setValue("");
    this.pagesListForm.controls.FormStatus.setValue("");
  }
  else if(this.masterType=="Vertical")
  {
    this.ShowVerticalEdit=true;
    this.VerticalId=0;
    this.createoredit = "Create Vertical Type";
    this.VerticalForm.controls.VerticalName.setValue("");
    this.VerticalForm.controls.VerticalCode.setValue("");
    this.VerticalForm.controls.Function.setValue("");
    this.VerticalForm.controls.Sector.setValue("");
    this.VerticalForm.controls.VerticalStatus.setValue("");
  }
  else if(this.masterType == "Business Type")
  {
    this.ShowBusinessEdit=true;
    this.createoredit = "Create Business Type";
    this._masterservice.createnewbusinessmodel();
    this._masterservice.businessmodel._function_id = 0;
    this.BusinessForm.controls.BusinessCode.setValue("");
    this.BusinessForm.controls.BusinessName.setValue("");
    this.BusinessForm.controls.Active.setValue("");
  }
}
//project Type Start
ShowProjectTypeEdit:boolean=false;
ShowPrivilegeEdit:boolean=false;
DomainId:number=0;
Role_id:number=0;
ShowRoleEdit:boolean=false;
ShowBranchEdit:boolean=false;
ShowSectorEdit:boolean=false;
ShowSubSectorEdit:boolean=false;
ShowSolutionCategoryEdit:boolean=false;
ShowSolutionEdit:boolean=false;
ShowDOAEdit:boolean=false;
ShowCommentEdit:boolean=false;
ShowVerticalEdit:boolean=false;
ShowBusinessEdit:boolean=false;
VerticalId:number=0;
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
  this._masterservice.Mst_Domains._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
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
  this._masterservice.Mst_privilege._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
  this._masterservice.Update_Mst_Privilege( this._masterservice.Mst_privilege).subscribe((Result)=>{
    console.log(Result);
    var Res=JSON.parse(Result);
    this.Canceltype();
    this._mesgBox.showSucess(Res[0].message);
   
  
    
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
  this._masterservice.mst_roles._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));

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

// Branch Start
GetMstBranch()
{
  this._masterservice.GetMstBranch().subscribe((Result)=>{
    var res=JSON.parse(Result);
    this.dashboardData=res.Table;
    this.BindGridDetails();
    this.displayedColumns=this.BranchColumn; 
  },
  (error:HttpErrorResponse) =>{

  });
}

SubmitBranchType()
{
  if(this._masterservice.branchmodel._branch_id == null)
  {
    this._masterservice.branchmodel._branch_id =0;
  }
  this._masterservice.branchmodel._branchname = this.BranchForm.controls.Branch_Name.value;
  this._masterservice.branchmodel._active = this.BranchForm.controls.Active.value;
  this._masterservice.branchmodel._user_id = this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));

  this._masterservice.Update_Mst_Branch(this._masterservice.branchmodel).subscribe((Result)=>{
    Result = JSON.parse(Result);
		this._mesgBox.showSucess(Result[0].message);
    this.ShowBranchEdit = false;
    this.GetMstBranch();
  },
  (error:HttpErrorResponse) =>{
    this._mesgBox.showError(error.message);
  });

}
//branch end

//comment type start
GetMstCommentType()
{
  this._masterservice.GetMstCommentType().subscribe((Result)=>{
    var res=JSON.parse(Result);
    this.dashboardData=res.mst_comment_type;
    this.BindGridDetails();
    this.displayedColumns=this.CommentTypeColumn; 
  },
  (error:HttpErrorResponse) =>{

  });
}

SubmitCommentType()
{
  if(this._masterservice.commentmodel._comment_type_id == null)
  {
    this._masterservice.commentmodel._comment_type_id =0;
  }
  this._masterservice.commentmodel._comment_type = this.CommentForm.controls.Comment.value;
  //this._masterservice.branchmodel._active = this.BranchForm.controls.Active.value;
  this._masterservice.commentmodel._user_id =this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));

  this._masterservice.Update_Mst_Comment(this._masterservice.commentmodel).subscribe((Result)=>{
    Result = JSON.parse(Result);
		this._mesgBox.showSucess(Result[0].message);
    this.ShowCommentEdit = false;
    this.GetMstCommentType();
  },
  (error:HttpErrorResponse) =>{
    this._mesgBox.showError(error.message);
  });

}

//Sector Start

GetMstSector()
{
  this._masterservice.GetMstSector().subscribe((Result)=>{
    var res=JSON.parse(Result);
    this.dashboardData=res.Table;
    this.BindGridDetails();
    this.displayedColumns=this.SectorColumn; 
  },
  (error:HttpErrorResponse) =>{

  });
}

SubmitSectorType()
{
  if(this._masterservice.sectormodel._Sector_Id == null)
  {
    this._masterservice.sectormodel._Sector_Id =0;
  }
  this._masterservice.sectormodel._Sector_Name = this.SectorForm.controls.Sector_Name.value;
  this._masterservice.sectormodel._active = this.SectorForm.controls.Active.value;
  this._masterservice.sectormodel._user_id = this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));

  this._masterservice.Update_Mst_Sector(this._masterservice.sectormodel).subscribe((Result)=>{
    Result = JSON.parse(Result);
		this._mesgBox.showSucess(Result[0].message);
    this.ShowSectorEdit = false;
    this.GetMstSector();
  },
  (error:HttpErrorResponse) =>{
    this._mesgBox.showError(error.message);
  });

}

// Sector Ends

// SubSector start
GetMstSubSector()
{
  this._masterservice.GetMstSubSector().subscribe((Result)=>{
    var res=JSON.parse(Result);
    this.dashboardData=res.mst_subsector;
    this.Sectordropdown = res.mst_sector;
    this.BindGridDetails();
    this.displayedColumns=this.SubSectorColumn; 
  },
  (error:HttpErrorResponse) =>{

  });
}

SubmitSubSectorType()
{
  if(this._masterservice.subsectormodel._SubSector_Id == null)
  {
    this._masterservice.subsectormodel._SubSector_Id =0;
  }
  this._masterservice.subsectormodel._SubSector_Name = this.SubSectorForm.controls.SubSector_Name.value;
  this._masterservice.subsectormodel._Sector_Id = this.SubSectorForm.controls.Sector_Id.value;
  this._masterservice.subsectormodel._user_id = this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));

  this._masterservice.Update_Mst_SubSector(this._masterservice.subsectormodel).subscribe((Result)=>{
    Result = JSON.parse(Result);
		this._mesgBox.showSucess(Result[0].message);
    this.ShowSubSectorEdit = false;
    this.GetMstSubSector();
  },
  (error:HttpErrorResponse) =>{
    this._mesgBox.showError(error.message);
  });

}

// SubSector ends
// Solution Category Start
GetMstSolutionCategory()
{
  this._masterservice.GetMstSolutionCategory().subscribe((Result)=>{
    var res=JSON.parse(Result);
    this.dashboardData=res.Table;
    this.BindGridDetails();
    this.displayedColumns=this.SolutionCategoryColumn; 
  },
  (error:HttpErrorResponse) =>{

  });
}

SubmitSolutionCategoryType()
{
  if(this._masterservice.solutioncategorymodel._solutioncategory_Id == null)
  {
    this._masterservice.solutioncategorymodel._solutioncategory_Id =0;
  }
  this._masterservice.solutioncategorymodel._solutioncategory_name = this.SolutionCategoryForm.controls.SolutionCategory_Name.value;
  this._masterservice.solutioncategorymodel._active = this.SolutionCategoryForm.controls.Active.value;
  this._masterservice.solutioncategorymodel._user_id = this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));

  this._masterservice.Update_Mst_SolutionCategory(this._masterservice.solutioncategorymodel).subscribe((Result)=>{
    Result = JSON.parse(Result);
		this._mesgBox.showSucess(Result[0].message);
    this.ShowSolutionCategoryEdit = false;
    this.GetMstSolutionCategory();
  },
  (error:HttpErrorResponse) =>{
    this._mesgBox.showError(error.message);
  });

}
//Solution Category ends
//Solution starts
GetMstSolution()
{
  this._masterservice.GetMstSolution().subscribe((Result)=>{
    var res=JSON.parse(Result);
    this.dashboardData=res.mst_solution;
    this.SolutionCategorydropdown = res.mst_solutioncategory;
    this.functiondropdown = res.mst_functions;
    this.domaindropdown = res.mst_domains;
    this.BindGridDetails();
    this.displayedColumns=this.SolutionColumn; 
  },
  (error:HttpErrorResponse) =>{

  });
}

SubmitSolution()
{
  if(this._masterservice.solutionmodel._Solution_Id == null)
  {
    this._masterservice.solutionmodel._Solution_Id =0;
  }
  this._masterservice.solutionmodel._Solution_Name = this.SolutionForm.controls.Solution_Name.value;
  this._masterservice.solutionmodel._Solutioncategory_Id = this.SolutionForm.controls.SolutionCategory.value;
  this._masterservice.solutionmodel._function_id = this.SolutionForm.controls.Function.value;
  this._masterservice.solutionmodel._domain_id = this.SolutionForm.controls.Domain.value;
  this._masterservice.solutionmodel._active = this.SolutionForm.controls.Active.value;
  this._masterservice.solutionmodel._user_id = this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));

  this._masterservice.Update_Mst_Solution(this._masterservice.solutionmodel).subscribe((Result)=>{
    Result = JSON.parse(Result);
		this._mesgBox.showSucess(Result[0].message);
    this.ShowSolutionEdit = false;
    this.GetMstSolution();
  },
  (error:HttpErrorResponse) =>{
    this._mesgBox.showError(error.message);
  });

}
// Solution ends
//DOA messages start
GetMstDoa()
{
  this._masterservice.GetMstDoaMsg().subscribe((Result)=>{
    var res=JSON.parse(Result);
    this.dashboardData=res.Table;
    this.BindGridDetails();
    this.displayedColumns=this.DOAColumn; 
  },
  (error:HttpErrorResponse) =>{

  });
}

SubmitDOAMessages()
{
  if(this._masterservice.doamodel._DOA_Matrix_Id == null)
  {
    this._masterservice.doamodel._DOA_Matrix_Id =0;
  }
  this._masterservice.doamodel._Message = this.DOAForm.controls.Message.value;
  this._masterservice.doamodel._Prefix = this.DOAForm.controls.Prefix.value;
  this._masterservice.doamodel._MessageFor = this.DOAForm.controls.MessageFor.value;
  this._masterservice.doamodel._user_id = this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));

  this._masterservice.Update_Mst_DOA(this._masterservice.doamodel).subscribe((Result)=>{
    Result = JSON.parse(Result);
		this._mesgBox.showSucess(Result[0].message);
    this.ShowDOAEdit = false;
    this.GetMstDoa();
  },
  (error:HttpErrorResponse) =>{
    this._mesgBox.showError(error.message);
  });

}

//DOA messages end

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
  this._masterservice.mst_Forms. _user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
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
  this._masterservice.mst_verticals._user_id=this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
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

//Business Type start
GetMstBusiness()
{
  this._masterservice.GetMstBusiness().subscribe((Result)=>{
    var res=JSON.parse(Result);
    this.dashboardData=res.Table;
    this.BindGridDetails();
    this.displayedColumns=this.BusinessColumn; 
  },
  (error:HttpErrorResponse) =>{

  });
}

SubmitBusinessType()
{
  if(this._masterservice.businessmodel._function_id == null)
  {
    this._masterservice.businessmodel._function_id =0;
  }
  this._masterservice.businessmodel._function_name = this.BusinessForm.controls.BusinessName.value;
  this._masterservice.businessmodel._function_code = this.BusinessForm.controls.BusinessCode.value;
  this._masterservice.businessmodel._active = this.BusinessForm.controls.Active.value;
  this._masterservice.businessmodel._user_id =this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));

  this._masterservice.Update_Mst_Business(this._masterservice.businessmodel).subscribe((Result)=>{
    Result = JSON.parse(Result);
		this._mesgBox.showSucess(Result[0].message);
    this.ShowBusinessEdit = false;
    this.GetMstBusiness();
  },
  (error:HttpErrorResponse) =>{
    this._mesgBox.showError(error.message);
  });
}
//Business Type end
}
