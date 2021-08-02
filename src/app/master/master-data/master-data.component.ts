import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.scss']
})
export class MasterDataComponent implements OnInit {
  
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  Route(type)
  {
    this.router.navigate(['/DealHUB/master/masterlist'],{ queryParams: { type:type } });
  }

}
