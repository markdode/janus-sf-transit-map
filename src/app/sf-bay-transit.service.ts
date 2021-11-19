import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SfBayTransitService {

  private transitUrl = 'http://api.511.org/transit'

  constructor(private http: HttpClient) { }

  getOperators(): Observable<any> {
    const url = `${this.transitUrl}/operators?api_key=52210a3b-f9a5-4b50-9991-560b9d1b42b2`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(() => console.log('got Operators')),
        catchError(() => of(false)) // create an actual error handler
      );
  }

  getLines(id: string): Observable<any> {
    const url = `${this.transitUrl}/lines?api_key=52210a3b-f9a5-4b50-9991-560b9d1b42b2&operator_id=${id}`;
    return this.http.get<any>(url)
      .pipe(
        tap(() => console.log(`got lines for operator id ${id}`)),
        catchError(() => of(false)) // create an actual error handler
      );
  }

  getVehicleLocations(op_id: string): Observable<any> {
    const url = `${this.transitUrl}/VehicleMonitoring?api_key=52210a3b-f9a5-4b50-9991-560b9d1b42b2&agency=${op_id}`;
    return this.http.get<any>(url)
      .pipe(
        tap(() => console.log('got vehicle locations')),
        catchError(() => of(false)) // create an actual error handler
      );
  }

}
