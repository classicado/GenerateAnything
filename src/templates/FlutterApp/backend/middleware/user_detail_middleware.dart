import 'dart:convert';
import 'dart:io';
import 'package:device_info/device_info.dart';
import 'package:wcg_driver_app_mobile/app/backend/actions/actions.dart';
import 'package:wcg_driver_app_mobile/app/backend/models/user_details_model.dart';
import 'package:wcg_driver_app_mobile/app/backend/repositories/app_repository.dart';
import 'package:wcg_driver_app_mobile/app/backend/states/states.dart';
import 'package:logging/logging.dart';
import 'package:redux/redux.dart';
import 'package:wcg_driver_app_mobile/app/components/components.dart';

final Logger _log = new Logger('UserDetailMiddleware');

class UserDetailMiddleware {
  static Middleware<AppState> loadUserDetail(AppRepository repository) {
    _log.info('_loadUserDetail $repository');
    return (Store<AppState> store, action, NextDispatcher next) {
      next(action);
      repository.userDetailWebService
          .getUserDetail(store, null, action.cognitoUserDetails.name, null)
          .then((res) {
        if (res.isError) {
          store.dispatch(GetUserDetailFailureAction());
        } else {
          store.dispatch(GetUserDetailSuccessAction(
              UserDetail.fromJson(json.decode(res.response))));
        }
      }).catchError((onError) {
        _log.shout('Exception error loadUserDetail');
        _log.shout(onError);
        GetUserDetailFailureAction();
      });
    };
  }

  static Middleware<AppState> createUser(AppRepository repository) {
    _log.info('createUser $repository');
    return (Store<AppState> store, action, NextDispatcher next) {
      next(action);

      getDeviceInfo().then((deviceInfo) {
        repository.userDetailWebService
            .create(
                store,
                action.userDetails.name,
                action.userDetails.surname,
                action.userDetails.idOrPassport,
                action.userDetails.mobile,
                action.userDetails.email,
                action.userDetails.vehicleReg,
                action.userDetails.gender,
                action.userDetails.addressLine1,
                action.userDetails.city,
                action.userDetails.addressLine1Code,
                action.userDetails.countryOfOrigin,
                action.userDetails.dateOfBirth,
                deviceInfo.deviceId,
                deviceInfo.os,
                action.userDetails.tocVersionAccepted)
            .then((res) {
          if (res.isError) {
            store.dispatch(SaveUserDetailFailureAction());
          } else {
            store.dispatch(SaveUserDetailSuccessAction(
                UserDetail.fromJson(json.decode(res.response))));
          }
        });
      }).catchError((onError) {
        _log.shout('Failed to create user');
        _log.shout(onError);
        store.dispatch(SaveUserDetailFailureAction());
      });
    };
  }

  static Middleware<AppState> updateUser(AppRepository repository) {
    _log.info('updateUser $repository');
    return (Store<AppState> store, action, NextDispatcher next) {
      next(action);

      getDeviceInfo().then((deviceInfo) {
        repository.userDetailWebService
            .update(
                store,
                action.userDetails.id,
                action.userDetails.name,
                action.userDetails.surname,
                action.userDetails.idOrPassport,
                action.userDetails.mobile,
                action.userDetails.email,
                action.userDetails.vehicleReg,
                action.userDetails.gender,
                action.userDetails.addressLine1,
                action.userDetails.city,
                action.userDetails.addressLine1Code,
                action.userDetails.countryOfOrigin,
                action.userDetails.dateOfBirth,
                deviceInfo.deviceId,
                deviceInfo.model,
                action.userDetails.tocVersionAccepted)
            .then((res) {
          if (res.isError) {
            store.dispatch(UpdateUserDetailFailureAction());
          } else {
            UserDetail detail = UserDetail.fromJson(json.decode(res.response));
            store.dispatch(UpdateUserDetailSuccessAction(userDetails: detail));
            GlobalSnackBar.show(
                action.context, 'Successfully update details', 4);
          }
        });
      }).catchError((onError) {
        _log.shout('Failed to create user');
        _log.shout(onError);
        store.dispatch(UpdateUserDetailFailureAction());
      });
    };
  }

  static Future<DeviceInfo> getDeviceInfo() async {
    DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
    DeviceInfo myDeviceInfo = new DeviceInfo();
    if (Platform.isAndroid) {
      AndroidDeviceInfo androidInfo = await deviceInfo.androidInfo;
      myDeviceInfo.deviceId = androidInfo.androidId;
      myDeviceInfo.os = androidInfo.version.baseOS;
      myDeviceInfo.model = androidInfo.model;
    } else if (Platform.isIOS) {
      IosDeviceInfo iosInfo = await deviceInfo.iosInfo;
      myDeviceInfo.deviceId = iosInfo.identifierForVendor;
      myDeviceInfo.os = iosInfo.systemName;
      myDeviceInfo.model = iosInfo.model;
    }
    return myDeviceInfo;
  }
}

class DeviceInfo {
  String deviceId;
  String os;
  String model;
  DeviceInfo();
}
