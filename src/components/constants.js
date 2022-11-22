export const BASEURL = "https://superiorsix.co.uk/webapis/supersix";

// game web apis
export const MATCHESURL = BASEURL + "/game/livematches";
export const SCORESURL = BASEURL + "/game/livescores";
export const METAURL = BASEURL + "/game/meta";
export const CURRENTROUNDURL = BASEURL + "/game/currentround";
export const AGGREGATESTATSURL = BASEURL + "/stats/aggregate";
export const WINNERSURL = BASEURL + "/stats/winners";
export const SPECIALMESSAGEURL = BASEURL + "/game/specialmessage";
export const GETMATCHDETAILURL = BASEURL + "/game/matchdetail";

// qatar hero apis
export const QATARHEROMATCHESURL = BASEURL + "/worldcup/matches";
export const QATARHEROSCORESURL = BASEURL + "/worldcup/scores";
export const QATARHEROLISTPREDICTIONSURL = BASEURL + "/worldcup/listpredictions";
export const QATARHEROGETPREDICTIONURL = BASEURL + "/worldcup/getprediction";
export const QATARHEROADDPREDICTIONURL = BASEURL + "/worldcup/addprediction";

// user web apis
export const GETPREDICTIONURL = BASEURL + "/user/getprediction";
export const ADDPREDICTIONURL = BASEURL + "/user/addprediction";
export const UPDATEDETAILSURL = BASEURL + "/user/updatedetails";

// admin web apis
export const LISTLEAGUESURL = BASEURL + "/admin/listleagues";
export const LISTMATCHESURL = BASEURL + "/admin/listmatchesnew";
export const GETMATCHURL = BASEURL + "/admin/getmatch";
export const ADDMATCHURL = BASEURL + "/admin/addmatch";
export const DROPMATCHURL = BASEURL + "/admin/dropmatch";
export const LISTPLAYERSURL = BASEURL + "/admin/listplayers";
export const LISTPREDICTIONSURL = BASEURL + "/admin/listpredictionsnew";
export const ADDPREDICTIONADMINURL = BASEURL + "/admin/addprediction";
export const CURRENTROUNDADMINURL = BASEURL + "/admin/currentround";
export const HISTORICROUNDSURL = BASEURL + "/admin/historicrounds";
export const ADDROUNDURL = BASEURL + "/admin/addround";
export const ENDROUNDURL = BASEURL + "/admin/endround";
export const ADDPLAYERURL = BASEURL + "/admin/addplayer";
export const DROPPLAYERURL = BASEURL + "/admin/dropplayer";
export const REACTIVATEPLAYERURL = BASEURL + "/admin/reactivateplayer";
export const GETSPECIALMESSAGEURL = BASEURL + "/admin/getspecialmessage";
export const SETSPECIALMESSAGEURL = BASEURL + "/admin/setspecialmessage";
export const ENDSPECIALMESSAGEURL = BASEURL + "/admin/endspecialmessage";

// user admin web apis
const ADMINURL = BASEURL.substring(0, BASEURL.length - 17) + "/admin"
export const CHECKPERMISSIONURL = ADMINURL + "/permissions/check";

// access control web apis
const ACCESSCONTROLURL = BASEURL.substring(0, BASEURL.length - 17) + "/accesscontrol/api"
export const LOGGEDINURL = ACCESSCONTROLURL + "/checkuser";
export const LOGINURL = ACCESSCONTROLURL + "/login";
export const LOGOUTURL = ACCESSCONTROLURL + "/logout";
export const FORGOTPASSWORDURL = ACCESSCONTROLURL + "/forgotpassword";

// special web apis
export const BANKHOLIDAYSURL = "https://www.gov.uk/bank-holidays.json"
