import 'package:wcg_driver_app_mobile/app/backend/states/states.dart';
import 'package:logging/logging.dart';
import 'package:redux/redux.dart';
import 'dart:convert';
import 'dart:async';
import 'package:intl/intl.dart';
import 'base.dart';

final Logger _log = new Logger('UserDetailWebService');
var dateFormat = new DateFormat('yyyy-MM-ddTHH:mm:ss');

class UserDetailWebService extends BaseWebservices {
  const UserDetailWebService() : super();

  @override
  String serviceName() {
    return 'UserDetail';
  }

  Future<WebServiceResponse> getUserDetail(Store<AppState> store,
      String idorPassport, String name, String id) async {

    var data = jsonEncode({
      "PkUserDetailId": 0,
      "name": name,
      "surname": null,
      "idOrPassport": idorPassport,
      "mobile": null,
      "email": null,
      "vehicleReg": null,
      "gender": null,
      "addressLine1": null,
      "city": null,
      "addressLine1Code": null,
      "countryOfOrigin": null,
      "dateOfBirth": null,
      "deviceId": null,
      "os": null,
      "tocVersionAccepted":null
    });

    try {
      final WebServiceResponse response = await super
          .postMethod(store, 'getUserDetails', body: data, secure: false);

      return response;
    } catch (error) {
      _log.shout('Try catch ');
      _log.shout(error);
      return WebServiceResponse(-1, error, isError: true);
    }
  }

  Future<WebServiceResponse> create(
      Store<AppState> store,
      String name,
      String surname,
      String idOrPassport,
      String mobile,
      String email,
      String vehicleReg,
      String gender,
      String addressLine1,
      String city,
      String addressLine1Code,
      String countryOfOrigin,
      DateTime dateOfBirth,
      String deviceId,
      String os,
      int tocVersionAccepted) async {
    var data = jsonEncode({
      "PkUserDetailId": 0,
      "name": name,
      "surname": surname,
      "idOrPassport": idOrPassport,
      "mobile": mobile,
      "email": email,
      "vehicleReg": vehicleReg,
      "gender": gender,
      "addressLine1": addressLine1,
      "city": city,
      "addressLine1Code": addressLine1Code,
      "countryOfOrigin": countryOfOrigin,
      "dateOfBirth": null,
      "deviceId": deviceId,
      "os": os,
      "tocVersionAccepted":tocVersionAccepted
    });

    try {
      final WebServiceResponse response =
          await super.postMethod(store, 'createUserDetails', body: data, secure: false);

      return response;
    } catch (error) {
      _log.shout('Try catch ');
      _log.shout(error);
      return WebServiceResponse(-1, error, isError: true);
    }
  }

    Future<WebServiceResponse> update(
      Store<AppState> store,
    int id,
      String name,
      String surname,
      String idOrPassport,
      String mobile,
      String email,
      String vehicleReg,
      String gender,
      String addressLine1,
      String city,
      String addressLine1Code,
      String countryOfOrigin,
      DateTime dateOfBirth,
      String deviceId,
      String os,
      int tocVersionAccepted) async {
    var data = jsonEncode({
      "PkUserDetailId": id,
      "name": name,
      "surname": surname,
      "idOrPassport": idOrPassport,
      "mobile": mobile,
      "email": email,
      "vehicleReg": vehicleReg,
      "gender": gender,
      "addressLine1": addressLine1,
      "city": city,
      "addressLine1Code": addressLine1Code,
      "countryOfOrigin": countryOfOrigin,
      "dateOfBirth": dateFormat.format(dateOfBirth),
      "deviceId": deviceId,
      "os": os,
      "tocVersionAccepted":tocVersionAccepted.toString()
    });

     _log.info(data);

    try {
      final WebServiceResponse response =
          await super.postMethod(store, 'updateUserDetails', body: data, secure: false);

      return response;
    } catch (error) {
      _log.shout('Try catch ');
      _log.shout(error);
      return WebServiceResponse(-1, error, isError: true);
    }
  }
}
