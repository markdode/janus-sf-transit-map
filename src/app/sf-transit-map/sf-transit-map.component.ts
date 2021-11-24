import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of, startWith } from 'rxjs';
import { catchError, map } from 'rxjs';
import { SfBayTransitService } from '../sf-bay-transit.service';
import { Operator, Line, VehicleMonitoring, MarkerInfo, MarkerData } from '../interfaces';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sf-transit-map',
  templateUrl: './sf-transit-map.component.html',
  styleUrls: ['./sf-transit-map.component.css']
})
export class SfTransitMapComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow
  lineControl = new FormControl();
  busLineInput: string = '';

  apiLoaded: Observable<boolean>;

  operators: Operator[] = [];
  operatorIds: string[] = [];

  busLines: Line[] = [];
  lineNames: string[] = [];
  filteredLineNames!: Observable<string[]>;

  vehicleLocations: VehicleMonitoring[] = [];

  markerDataList: MarkerData[] = [];
  infoWindowContent: MarkerInfo;

  options: google.maps.MapOptions = {
    // center: {lat: 37.9730797, lng: -122.019981},
    center: {lat: 37.822027, lng: -122.377561},
    zoom: 10
  };
  icon = "https://img.icons8.com/fluency/32/000000/double-decker-bus.png";

  constructor(
    private httpClient: HttpClient,
    private sfBayTransitService: SfBayTransitService
  ) {
    this.infoWindowContent = new MarkerInfo();
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyD7Zg2BnWSeDsXC1yxbBosTqKtsv-AKxWE', 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  ngOnInit(): void {
    this.sfBayTransitService.getOperators().subscribe(res => {
      this.operators = res.filter(op => op.Montiored === true);
      this.operatorIds = this.operators.map(op => op.Id);
      let resList = this.operatorIds.map(id => this.sfBayTransitService.getLines(id));
      forkJoin(resList).pipe(map(data => data.reduce((result,arr)=>[...result,...arr],[]))).subscribe(res => {
        this.busLines = res.filter(line => line.TransportMode === 'bus');
        console.log('buslines: ', this.busLines);
        this.lineNames = this.busLines.map(line => line.Name);
        this.filteredLineNames = this.lineControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value)),
        );
      });
      let vehicleResList = this.operatorIds.map(id => this.sfBayTransitService.getVehicleLocations(id));
      forkJoin(vehicleResList).subscribe(res => {
        this.vehicleLocations = res;
        this.createMarkers();
      });
    });
  }

  createMarkers(): void {
    let tempMarkerDataList: MarkerData[] = [];
    for (const element of this.vehicleLocations) {
      const vehicleActivity = element.Siri.ServiceDelivery.VehicleMonitoringDelivery?.VehicleActivity;
      if(vehicleActivity) {
        for (const activity of vehicleActivity) {
          const vehicleJourney = activity.MonitoredVehicleJourney;
          if (vehicleJourney) {
            const vehicleLocation = activity.MonitoredVehicleJourney?.VehicleLocation;
            if (vehicleLocation) {
              const currMarkerData: MarkerData = {
                position: {lat: +vehicleLocation.Latitude, lng: +vehicleLocation.Longitude},
                info: {
                  lineName: vehicleJourney.PublishedLineName,
                  lineRef: vehicleJourney.LineRef,
                  operatorId: vehicleJourney.OperatorRef,
                  busId: vehicleJourney.VehicleRef,
                  operatorName: this.operators.find(op => op.Id === vehicleJourney.OperatorRef)?.Name
                }
              }
              tempMarkerDataList.push(currMarkerData);
            }
          }
        }
      }
    }
    this.markerDataList = tempMarkerDataList;
  }

  createFilteredMarkers(vehicleLocation: VehicleMonitoring): void {
    let tempMarkerDataList: MarkerData[] = [];
    const vehicleActivity = vehicleLocation.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity;
    if(vehicleActivity) {
      for (const activity of vehicleActivity) {
        const vehicleJourney = activity.MonitoredVehicleJourney;
        if (vehicleJourney) {
          if (vehicleJourney.PublishedLineName === this.lineControl.value) {
            const vehicleLocation = activity.MonitoredVehicleJourney?.VehicleLocation;
            if(vehicleLocation) {
              const currmarkerData: MarkerData = {
                position: {lat: +vehicleLocation.Latitude, lng: +vehicleLocation.Longitude},
                info: {
                  lineName: vehicleJourney.PublishedLineName,
                  lineRef: vehicleJourney.LineRef,
                  operatorId: vehicleJourney.OperatorRef,
                  busId: vehicleJourney.VehicleRef,
                  operatorName: this.operators.find(op => op.Id === vehicleJourney.OperatorRef)?.Name
                }
              };
              tempMarkerDataList.push(currmarkerData);
            }
          }
        }
      }
    }
    this.markerDataList = tempMarkerDataList;
  }

  openInfoWindow(marker: MapMarker, info: MarkerInfo): void {
    this.infoWindowContent = info;
    this.infoWindow.open(marker);
  }

  updateMap(): void {
    console.log(this.lineControl);
    const IBusLineOpId = this.busLines.find(line => line.Name === this.lineControl.value)?.OperatorRef;
    if (IBusLineOpId) {
      const matchVehicleLoc = this.vehicleLocations.find(vehicleLoc => vehicleLoc.Siri.ServiceDelivery.ProducerRef === IBusLineOpId);
      matchVehicleLoc ? this.createFilteredMarkers(matchVehicleLoc) : this.markerDataList = [];
    }
  }

  reset(): void {
    this.lineControl.setValue('');
    this.createMarkers();
  }

  trackByFn(index: number, item: MarkerData) {
    return index;
}

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.lineNames.filter(lineName => lineName.toLowerCase().includes(filterValue));
  }
}
