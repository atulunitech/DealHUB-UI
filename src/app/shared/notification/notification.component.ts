import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
 

export class systemnotificationparameters{
  _dh_system_notification_id:number;
  _IsRead:number;
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
   // this.Get_System_Notification();
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
  systemnotificationparameters:systemnotificationparameters[]=[];
  Update_System_Notification(_dh_system_notification_id)
  {
    let Savenotification:systemnotificationparameters = new systemnotificationparameters();
    Savenotification._dh_system_notification_id=_dh_system_notification_id;
    Savenotification._IsRead=0;
    this.systemnotificationparameters.push(Savenotification);
    this.commonService.Update_System_Notification(this.systemnotificationparameters).subscribe(data=>{
      console.log(data);
      var jsonresult=JSON.parse(data);
      this.commonService.initializeNotification(JSON.parse(data));
     this.Get_System_Notification();
      //alert("notifcation called");

    })
  }
  markallread()
  {
    this.systemnotificationparameters=[];
    if(this.commonService.notificationDetails.length !=0)
    { 
      let Savenotification:systemnotificationparameters = new systemnotificationparameters();
      for(let i=0;i<this.commonService.notificationDetails.length;i++)
      {
       
        Savenotification._dh_system_notification_id=this.commonService.notificationDetails[i].dh_system_notification_id;
        Savenotification._IsRead=0;
        
        this.systemnotificationparameters.push(Savenotification);
      } 
      
    }
    this.commonService.Update_System_Notification(this.systemnotificationparameters).subscribe(data=>{
      console.log(data);
      var jsonresult=JSON.parse(data);
      this.commonService.initializeNotification(JSON.parse(data));
     this.Get_System_Notification();
      //alert("notifcation called");

    })
  }
}
