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
    this.bnIdle.startWatching(600).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        console.log('session expired');
        this.router.navigateByUrl('/login');
      }
    });
  }
}
