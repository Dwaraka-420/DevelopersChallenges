import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedChallengesComponent } from './submited-challenges.component';

describe('SubmitedChallengesComponent', () => {
  let component: SubmittedChallengesComponent;
  let fixture: ComponentFixture<SubmittedChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmittedChallengesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmittedChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
