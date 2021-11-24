import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Operator, Line, VehicleMonitoring } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class SfBayTransitService {

  private api_key = '52210a3b-f9a5-4b50-9991-560b9d1b42b2'

  private transitUrl = 'http://api.511.org/transit'

  constructor(private http: HttpClient) { }

  getOperators(): Observable<Operator[]> {
    const url = `${this.transitUrl}/operators?api_key=${this.api_key}`;
    return this.http.get<Operator[]>(url)
      .pipe(
        tap(() => console.log('got Operators')),
        catchError(() => of()) // create an actual error handler
      );
  }

  getLines(id: string): Observable<Line[]> {
    const url = `${this.transitUrl}/lines?api_key=${this.api_key}&operator_id=${id}`;
    return this.http.get<Line[]>(url)
      .pipe(
        tap(() => console.log(`got lines for operator id ${id}`)),
        catchError(() => of()) // create an actual error handler
      );
  }

  getVehicleLocations(op_id: string): Observable<VehicleMonitoring> {
    const url = `${this.transitUrl}/VehicleMonitoring?api_key=${this.api_key}&agency=${op_id}`;
    return this.http.get<VehicleMonitoring>(url)
      .pipe(
        tap(() => console.log('got vehicle locations')),
        catchError(() => of()) // create an actual error handler
      );
  }

}
