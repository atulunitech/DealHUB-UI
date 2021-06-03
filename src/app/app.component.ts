import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DealHUB-UI';

  constructor(private bnIdle: BnNgIdleService,private router:Router) {
 
  }
 
  // initiate it in your component OnInit
  ngOnInit(): void {
   // alert("Hello from app component");
  //  if(localStorage.getItem("Token") == "")
  //  {
  //   this.router.navigateByUrl('/login'); 
  //  }
    this.bnIdle.startWatching(600).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        if(localStorage.getItem("rememberCurrentUser") != "true")
        {
          this.router.navigateByUrl('/login');
        }
      }
    });
  }
}
