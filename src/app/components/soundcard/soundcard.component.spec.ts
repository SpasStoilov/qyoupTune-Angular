import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundcardComponent } from './soundcard.component';

describe('SoundcardComponent', () => {
  let component: SoundcardComponent;
  let fixture: ComponentFixture<SoundcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoundcardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoundcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
