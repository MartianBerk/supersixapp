export const BASEURL = "https://superiorsix.co.uk/webapis/supersix";

// game web apis
export const MATCHESURL = BASEURL + "/game/livematches";
export const SCORESURL = BASEURL + "/game/livescores";
export const METAURL = BASEURL + "/game/meta";
export const CURRENTROUNDURL = BASEURL + "/game/currentround";

export const AGGREGATESTATSURL = BASEURL + "/stats/aggregate";

export const SPECIALMESSAGEURL = BASEURL + "/game/specialmessage";

export const GETMATCHDETAILURL = BASEURL + "/game/matchdetail";

// user web apis
export const GETPREDICTIONURL = BASEURL + "/user/getprediction";
export const ADDPREDICTIONURL = BASEURL + "/user/addprediction";
export const UPDATEDETAILSURL = BASEURL + "/user/updatedetails";

// access control web apis
const ACCESSCONTROLURL = BASEURL.substring(0, BASEURL.length - 17) + "/accesscontrol/api"
// export const LOGGEDINURL = ACCESSCONTROLURL + "/checkuser";
export const LOGGEDINURL = "user.json";
export const LOGINURL = ACCESSCONTROLURL + "/login";
export const LOGOUTURL = ACCESSCONTROLURL + "/logout";

// special web apis
export const BANKHOLIDAYSURL = "https://www.gov.uk/bank-holidays.json"
