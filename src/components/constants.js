export const BASEURL = "https://superiorsix.co.uk/webapis/supersix";

// game web apis
export const MATCHESURL = BASEURL + "/game/livematches";
export const SCORESURL = BASEURL + "/game/livescores";
// export const METAURL = BASEURL + "/game/meta";
export const METAURL = "meta.json"
export const CURRENTROUNDURL = BASEURL + "/game/currentround";

export const AGGREGATESTATSURL = BASEURL + "/stats/aggregate";

export const SPECIALMESSAGEURL = BASEURL + "/game/specialmessage";

// export const GETPLAYERURL = BASEURL + "/player/get";
export const GETPLAYERURL = "player.json";

// access control web apis
const ACCESSCONTROLURL = BASEURL.substring(0, BASEURL.lengh - 8) + "/accesscontrol"
// export const LOGGEDINURL = ACCESSCONTROLURL + "/isloggedin";
export const LOGGEDINURL = "checkloggedin.json"
export const LOGINURL = ACCESSCONTROLURL + "/login";

// special web apis
export const BANKHOLIDAYSURL = "https://www.gov.uk/bank-holidays.json"
