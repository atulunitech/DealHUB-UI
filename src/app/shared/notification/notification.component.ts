import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
 

export class systemnotificationparameters{
  _dh_system_notification_id:number;
  _IsRead:number;
  _IsSoftDelete:number;
}
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(public commonService:CommonService) { }

  ngOnInit(): void {
    this.Get_System_Notification();
  }

  not_view()
  {
    this.Update_System_Notification();
    this.Get_System_Notification();
    this.commonService.notification();
   // this.Get_System_Notification();
  }
  
  Get_System_Notification()
  {
   
    this.commonService.Get_System_Notification(localStorage.getItem("UserCode")).subscribe(data=>{
      console.log(data);
      var jsonresult=JSON.parse(data);
      this.commonService.initializeNotification(JSON.parse(data));
     
      //alert("notifcation called");

    })
  }
  clickonnotification(dh_system_notification_id)
  {
    
    let index=this.commonService.notificationDetails.findIndex(obj=> obj.dh_system_notification_id==dh_system_notification_id);
    this.commonService.notificationDetails[index].IsRead=0;

  }
  systemnotificationparameters:systemnotificationparameters[]=[];
  Update_System_Notification()
  {
    if(this.commonService.notificationDetails != undefined)
    {
      let index=this.commonService.notificationDetails.findIndex(obj=> obj.IsRead==0);
      if(index>-1)
      {
        if(this.commonService.notificationDetails.length !=0)
      { 
      
        for(let i=0;i<this.commonService.notificationDetails.length;i++)
        {
          if(this.commonService.notificationDetails[i].IsRead==0)
          {
            let Savenotification:systemnotificationparameters = new systemnotificationparameters();
            Savenotification._dh_system_notification_id=this.commonService.notificationDetails[i].dh_system_notification_id;
            Savenotification._IsRead=0;
            this.systemnotificationparameters.push(Savenotification);
          }
        } 
        
      }
        this.commonService.Update_System_Notification(this.systemnotificationparameters).subscribe(data=>{
          console.log(data);
          var jsonresult=JSON.parse(data);
          this.Get_System_Notification();
          //this.commonService.initializeNotification(JSON.parse(data));
        })
      }
    }
   
  
     
      //alert("notifcation called");

    
  }
  markallread()
  {
    if(this.commonService.notificationDetails.length !=0)
    {
      for(let i=0;i<this.commonService.notificationDetails.length;i++)
      {
        this.commonService.notificationDetails[i].IsRead=0;
      }
    }

  }
  cancelnotification(dh_system_notification_id)
  {
           let Savenotification:systemnotificationparameters = new systemnotificationparameters();
            Savenotification._dh_system_notification_id=dh_system_notification_id;
            Savenotification._IsRead=0;
            Savenotification._IsSoftDelete=1;
            this.systemnotificationparameters.push(Savenotification);
            this.commonService.Update_System_Notification(this.systemnotificationparameters).subscribe(data=>{
              console.log(data);
              var jsonresult=JSON.parse(data);
              this.Get_System_Notification();
            // this.commonService.initializeNotification(JSON.parse(data));
            })
          
  }
}
