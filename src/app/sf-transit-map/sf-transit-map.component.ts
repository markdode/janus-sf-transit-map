import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs';
import { SfBayTransitService } from '../sf-bay-transit.service';

@Component({
  selector: 'app-sf-transit-map',
  templateUrl: './sf-transit-map.component.html',
  styleUrls: ['./sf-transit-map.component.css']
})
export class SfTransitMapComponent implements OnInit {
  apiLoaded: Observable<boolean>;
  operators: any[] = [];
  lines: any;
  vehicleLocations: any;

  constructor(
    private httpClient: HttpClient,
    private sfBayTransitService: SfBayTransitService
  ) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyD7Zg2BnWSeDsXC1yxbBosTqKtsv-AKxWE', 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  ngOnInit(): void {
    this.sfBayTransitService.getOperators().subscribe(res => {
      this.operators = res;
      console.log('list of ops: ', this.operators);
      this.getLines();
      this.getVehicleLocations();
    })
  }

  getOperators(): void {
    this.sfBayTransitService.getOperators().subscribe(res => {
      this.operators = res;
      console.log('list of ops: ', this.operators);
    });
  }

  getLines(): void {
    this.sfBayTransitService.getLines(this.operators[4]['Id']).subscribe(res => {
      this.lines = res;
      console.log('list of lines: ', this.lines);
    });
  }

  getVehicleLocations(): void {
    this.sfBayTransitService.getVehicleLocations(this.operators[4]['Id']).subscribe(res => {
      this.vehicleLocations = res;
      console.log('list of vehicle locations: ', this.vehicleLocations);
    });
  }

}
