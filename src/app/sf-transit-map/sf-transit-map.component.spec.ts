import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SfTransitMapComponent } from './sf-transit-map.component';

describe('SfTransitMapComponent', () => {
  let component: SfTransitMapComponent;
  let fixture: ComponentFixture<SfTransitMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SfTransitMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SfTransitMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
