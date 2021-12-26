export const BASEURL = "https://superiorsix.co.uk/webapis/supersix";

// game web apis
export const MATCHESURL = BASEURL + "/game/livematches";
// export const MATCHESURL = "matches.json"
export const SCORESURL = BASEURL + "/game/livescores";
// export const SCORESURL = "scores.json";
export const METAURL = BASEURL + "/game/meta";
// export const METAURL = "meta.json";
export const CURRENTROUNDURL = BASEURL + "/game/currentround";
// export const CURRENTROUNDURL = "currentround.json";

export const AGGREGATESTATSURL = BASEURL + "/stats/aggregate";
// export const AGGREGATESTATSURL = "stats.json";

export const SPECIALMESSAGEURL = BASEURL + "/game/specialmessage";
// export const SPECIALMESSAGEURL = "specialmessage.json";

export const GETMATCHDETAILURL = BASEURL + "/game/matchdetail";

// user web apis
export const GETPREDICTIONURL = BASEURL + "/user/getprediction";
export const ADDPREDICTIONURL = BASEURL + "/user/addprediction";
export const UPDATEDETAILSURL = BASEURL + "/user/updatedetails";

// access control web apis
const ACCESSCONTROLURL = BASEURL.substring(0, BASEURL.length - 17) + "/accesscontrol/api"
export const LOGGEDINURL = ACCESSCONTROLURL + "/checkuser";
// export const LOGGEDINURL = "checkuser.json";
export const LOGINURL = ACCESSCONTROLURL + "/login";
export const LOGOUTURL = ACCESSCONTROLURL + "/logout";
export const FORGOTPASSWORDURL = ACCESSCONTROLURL + "/forgotpassword";

// special web apis
export const BANKHOLIDAYSURL = "https://www.gov.uk/bank-holidays.json"
