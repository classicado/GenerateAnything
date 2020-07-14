import 'package:flutter/material.dart';
import 'package:wcg_driver_app_mobile/app/backend/models/models.dart';

@immutable
class VehicleRouteState {
  final VehicleRoute vehicleRoute; 
  final VehicleRoute currentVehicleRoute; 
  final VehicleRouteList vehicleRouteList;
  
  VehicleRouteState({
    this.vehicleRoute,
    this.currentVehicleRoute, 
    this.vehicleRouteList});

  VehicleRouteState copyWith({
    VehicleRoute vehicleRoute,
    VehicleRoute currentVehicleRoute,
    VehicleRouteList vehicleRouteList}) {
    return VehicleRouteState(
        vehicleRoute: vehicleRoute ?? this.vehicleRoute,
        currentVehicleRoute: currentVehicleRoute ?? this.currentVehicleRoute,
        vehicleRouteList: vehicleRouteList ?? this.vehicleRouteList);
  }
}