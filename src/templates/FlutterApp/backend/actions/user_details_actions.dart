import 'package:wcg_driver_app_mobile/app/backend/models/user_details_model.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

// Create
class SaveUserDetailAction {
  final UserDetail _userDetails;

  SaveUserDetailAction({@required this._userDetails});
}

class SaveUserDetailSuccessAction {
  final UserDetail _userDetails;
  SaveUserDetailSuccessAction(this._userDetails);
}

class SaveUserDetailFailureAction {}

// Retrieve
class GetUserDetailAction {
  final UserDetail _userDetails;

  GetUserDetailAction({this._userDetails});
}

class GetUserDetailSuccessAction {
  final UserDetail _userDetails;
  GetUserDetailSuccessAction(this._userDetails);
}

class GetUserDetailFailureAction {}

// Update
class UpdateUserDetailAction {
  final UserDetail _userDetails;
  final BuildContext context;
  UpdateUserDetailAction({@required this._userDetails, @required this.context});
}

class UpdateUserDetailSuccessAction {
  final UserDetail _userDetails;

  UpdateUserDetailSuccessAction({@required this._userDetails});
}

class UpdateUserDetailFailureAction {}
