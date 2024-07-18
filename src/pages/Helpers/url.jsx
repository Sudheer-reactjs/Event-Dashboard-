const BASE_URL = 'http://51.20.72.60:3002/admin/';

export const getApiUrl = (endpoint) => `${BASE_URL}${endpoint}`;

export const LOGIN = getApiUrl('loginuser');
export const COUNTRIES = getApiUrl('countries');
export const SIGNUPCODESEND = getApiUrl('signupcodesend');
export const SIGNUPCODEMATCH = getApiUrl('signupcodematch');
export const CHANGEPASSWORD = getApiUrl('changepassword');
export const USERDATA = getApiUrl('userdata');
export const HOMEDATA = getApiUrl('home_data');
export const DELETEEVENT = getApiUrl('deleteevent');
export const GETEVENT = getApiUrl('getevent');
export const EVENTSEARCH = getApiUrl('eventsearch');
export const EVENT = getApiUrl('event');
export const GETEVENTTYPE = getApiUrl('geteventtype');
export const EVENTTYPE = getApiUrl('eventtype');
export const UPDATEVENTTYPES = getApiUrl('updateventtypes');
export const DELETEVENTTYPE = getApiUrl('deleteventtype');
export const CREATEVENTTYPES = getApiUrl('createventtypes');
export const GETVENUE = getApiUrl('getvenue');
export const GETMUSICSTYLE = getApiUrl('getmusicstyle');
export const GETUSERS = getApiUrl('getusers');
export const BLOCKACCOUNT = getApiUrl('blockaccount');
export const DEACTIVATEACCOUNT = getApiUrl('deactivateaccount');
export const USER = getApiUrl('user');
export const USERTABING = getApiUrl('usertabing');