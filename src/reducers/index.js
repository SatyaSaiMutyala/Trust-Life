import { combineReducers } from 'redux';
import CurrentAddressReducer from './CurrentAddressReducer.js';
import AppointmentReducer from './AppointmentReducer.js';
import PharmOrderReducer from './PharmOrderReducer.js';
import LabOrderReducer from './LabOrderReducer.js';
import PrescriptionOrderReducer from './PrescriptionOrderReducer.js';
import PaymentReducer from './PaymentReducer.js';
import LabReportsReducer from '../redux/reducers/LabReportsReducer.js';
import OrdersReducer from '../redux/reducers/OrdersReducer.js';
import CustomerAuthReducer from '../redux/reducers/CustomerAuthReducer.js';
import CartReducer from '../redux/reducers/CartReducer.js';
import HomeReducer from '../redux/reducers/HomeReducer.js';
import NotificationsReducer from '../redux/reducers/NotificationsReducer.js';
import LabCartItemsReducer from '../redux/reducers/LabCartItemsReducer.js';
import PatientsReducer from '../redux/reducers/PatientsReducer.js';
import LastAddressReducer from '../redux/reducers/LastAddressReducer.js';
import LabsListReducer from '../redux/reducers/LabsListReducer.js';
import AddPatientReducer from '../redux/reducers/AddPatientReducer.js';
import EditPatientReducer from '../redux/reducers/EditPatientReducer.js';
import PlaceLabOrderReducer from '../redux/reducers/PlaceLabOrderReducer.js';
import TaxListReducer from '../redux/reducers/TaxListReducer.js';
import CustomerProfileReducer from '../redux/reducers/CustomerProfileReducer.js';
import DeleteCartItemReducer from '../redux/reducers/DeleteCartItemReducer.js';
import ApplyCouponReducer from '../redux/reducers/ApplyCouponReducer.js';
import RelevanceDataReducer from '../redux/reducers/RelevanceDataReducer.js';
import AddToCartReducer from '../redux/reducers/AddToCartReducer.js';
import LabDetailsReducer from '../redux/reducers/LabDetailsReducer.js';
import ProfilesReducer from '../redux/reducers/ProfilesReducer.js';
import PackagesReducer from '../redux/reducers/PackagesReducer.js';
import TestsReducer from '../redux/reducers/TestsReducer.js';
import AllAddressReducer from '../redux/reducers/AllAddressReducer.js';
import LabPendingOrdersReducer from '../redux/reducers/LabPendingOrdersReducer.js';
import LabOrderDetailsReducer from '../redux/reducers/LabOrderDetailsReducer.js';
import UploadReportReducer from '../redux/reducers/UploadReportReducer.js';

const allReducers = combineReducers({
  current_location:CurrentAddressReducer,
  appointment:AppointmentReducer,
  order:PharmOrderReducer,
  lab_order:LabOrderReducer,
  prescription_order:PrescriptionOrderReducer,
  payment:PaymentReducer,
  lab_reports:LabReportsReducer,
  orders:OrdersReducer,
  customer_auth:CustomerAuthReducer,
  cart:CartReducer,
  home:HomeReducer,
  notifications:NotificationsReducer,
  lab_cart_items:LabCartItemsReducer,
  patients:PatientsReducer,
  last_address:LastAddressReducer,
  labs_list:LabsListReducer,
  add_patient:AddPatientReducer,
  edit_patient:EditPatientReducer,
  place_lab_order:PlaceLabOrderReducer,
  tax_list:TaxListReducer,
  customer_profile:CustomerProfileReducer,
  delete_cart_item:DeleteCartItemReducer,
  apply_coupon:ApplyCouponReducer,
  relevance_data:RelevanceDataReducer,
  add_to_cart_item:AddToCartReducer,
  lab_details:LabDetailsReducer,
  profiles:ProfilesReducer,
  packages:PackagesReducer,
  tests:TestsReducer,
  all_addresses:AllAddressReducer,
  lab_pending_orders:LabPendingOrdersReducer,
  lab_order_details:LabOrderDetailsReducer,
  upload_report:UploadReportReducer,
});

export default allReducers;