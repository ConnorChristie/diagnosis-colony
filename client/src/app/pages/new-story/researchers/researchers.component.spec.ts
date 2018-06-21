import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchersComponent } from './researchers.component';

describe('FundingComponent', () => {
  let component: ResearchersComponent;
  let fixture: ComponentFixture<ResearchersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResearchersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
