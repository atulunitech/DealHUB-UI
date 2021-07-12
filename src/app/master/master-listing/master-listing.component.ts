import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-master-listing',
  templateUrl: './master-listing.component.html',
  styleUrls: ['./master-listing.component.scss']
})
export class MasterListingComponent implements OnInit {
@Input() masterType : any;
  constructor() { }

  ngOnInit(): void {
  }
  pageTitle()
  {
   return this.masterType;
  }
}
