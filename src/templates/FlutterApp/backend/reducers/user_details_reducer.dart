
import 'package:wcg_driver_app_mobile/app/backend/actions/actions.dart';
import 'package:wcg_driver_app_mobile/app/backend/models/user_details_model.dart';
import 'package:redux/redux.dart';
import 'package:logging/logging.dart';

final Logger _log = new Logger('UserDetailsReducer');

final userDetailReducer = combineReducers<UserDetail>([
  TypedReducer<UserDetail, GetUserDetailAction>(_loadUserDetail),
  TypedReducer<UserDetail, GetUserDetailSuccessAction>(_userDetailReceived),
  TypedReducer<UserDetail, GetUserDetailFailureAction>(_userDetailFailure), 

  TypedReducer<UserDetail, SaveUserDetailAction>(_saveUserDetail),
  TypedReducer<UserDetail, SaveUserDetailSuccessAction>(_saveUserDetailReceived),
  TypedReducer<UserDetail, SaveUserDetailFailureAction>(_saveUserDetailFailure),

  TypedReducer<UserDetail, UpdateUserDetailAction>(_updateUserDetail),
  TypedReducer<UserDetail, UpdateUserDetailSuccessAction>(_updateUserDetailReceived),
  TypedReducer<UserDetail, UpdateUserDetailFailureAction>(_updateUserDetailFailure),
]);

UserDetail _loadUserDetail(UserDetail state, GetUserDetailAction action) {
  _log.info('UserDetailReducer _loadUserDetail');
  return state;
}

UserDetail _userDetailReceived(UserDetail state, GetUserDetailSuccessAction action) {
  _log.info('UserDetailReducer _UserDetailReceived');
  return action.userDetails;
}

UserDetail _userDetailFailure(UserDetail state, GetUserDetailFailureAction action) {
  _log.info('UserDetailReducer _UserDetailFailure');
  return new UserDetail();
}


UserDetail _saveUserDetail(UserDetail state, SaveUserDetailAction action) {
  _log.info('UserDetailReducer _loadUserDetail');
  return state;
}

UserDetail _saveUserDetailReceived(UserDetail state, SaveUserDetailSuccessAction action) {
  _log.info('UserDetailReducer _UserDetailReceived');
  return action.userDetails;
}

UserDetail _saveUserDetailFailure(UserDetail state, SaveUserDetailFailureAction action) {
  _log.info('UserDetailReducer _UserDetailFailure');
  return state;
}

UserDetail _updateUserDetail(UserDetail state, UpdateUserDetailAction action) {
  _log.info('UserDetailReducer _loadUserDetail');
  return state;
}

UserDetail _updateUserDetailReceived(UserDetail state, UpdateUserDetailSuccessAction action) {
  _log.info('UserDetailReducer _UserDetailReceived');
  return action.userDetails;
}

UserDetail _updateUserDetailFailure(UserDetail state, UpdateUserDetailFailureAction action) {
  _log.info('UserDetailReducer _UserDetailFailure');
  return state;
}