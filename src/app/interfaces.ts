export interface Operator {
  Id: string;
  Name: string;
  ShortName: string;
  SiriOperatorRef: string;
  TimeZone: string;
  DefaultLanguage: string;
  ContactTelephoneNumber: string;
  Website: string;
  PrimaryMode: string;
  PrivateCode: string;
  Monitored: boolean;
  OtherModes: string;
}

export interface Line {
  Id: string;
  Name: string;
  TransportMode: string;
  PublicCode: string;
  SiriLineRef: string;
  Monitored: boolean;
  OperatorRef: string;
}

export interface VehicleMonitoring {
  Siri: {
    ServiceDelivery: {
      ResponseTimestamp: string;
      ProducerRef: string;
      Status: boolean;
      VehicleMonitoringDelivery: {
        version: number;
        ResponseTimeStamp: string;
        VehicleActivity?: Array<VehicleActivity>;
      }
    }
  }
}

export interface VehicleActivity {
  RecordedAtTime: string;
  ValidUntilTime: string;
  MonitoredVehicleJourney?: {
    LineRef: string;
    DirectionRef: string;
    FramedVehicleJourneyRef: {
      DataFrameRef: string;
      DatedVehicleJourneyRef: string;
    };
    PublishedLineName: string;
    OperatorRef: string;
    OriginRef?: string;
    OriginName?: string;
    DestinationRef?: string;
    DestinationName?: string;
    Monitored: boolean;
    InCongestion?: any;
    VehicleLocation?: {
      Longitude: number;
      Latitude: number;
    };
    Bearing?: number;
    Occupancy?: string;
    VehicleRef?: string;
    MonitoredCall?: object;
    OnwardCalls?: object;
    PreviousCalls?: object;
    ProgressStatus?: any;
  };
}

export interface MarkerData {
  position: google.maps.LatLngLiteral;
  info: MarkerInfo;
}

export class MarkerInfo {
  lineName: string = '';
  operatorId: string = '';
  operatorName?: string = '';
  lineRef: string = '';
  busId?: string = '';
}
