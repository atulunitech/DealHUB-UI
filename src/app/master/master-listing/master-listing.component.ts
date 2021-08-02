import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-master-listing',
  templateUrl: './master-listing.component.html',
  styleUrls: ['./master-listing.component.scss']
})
export class MasterListingComponent implements OnInit {
@Input() masterType : any;
  constructor(private router: Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
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
    
  }

  pageTitle()
  {
   return this.masterType;
  }
}
