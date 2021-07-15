import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterListingComponent } from './master-listing.component';

describe('MasterListingComponent', () => {
  let component: MasterListingComponent;
  let fixture: ComponentFixture<MasterListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
