import * as Constants from "./constants";


export class Requests {
    DEVELOPMENT = false;
    OVERRIDES = {
        MATCHESURL: "matches.json",
        SCORESURL: "scores.json",
        METAURL: "meta.json",
        CURRENTROUNDURL: "currentround.json",
        AGGREGATESTATSURL: "stats.json",
        WINNERSURL: "historicrounds.json",
        SPECIALMESSAGEURL: "specialmessage.json",
        LOGGEDINURL: "checkuser.json",
        LOGINURL: "login.json",
        GETMATCHDETAILURL: "matchdetail.json",
        GETPREDICTIONURL: "prediction.json",
        CHECKPERMISSIONURL: "permission.json",
        LISTLEAGUESURL: "listleagues.json",
        LISTMATCHESURL: "listmatches.json",
        ADDMATCHESURL: "matchesadd.json",
        GETMATCHURL: "match.json",
        ADDMATCHURL: "add_match.json",
        DROPMATCHURL: "drop_match.json",
        LISTPLAYERSURL: "players.json",
        LISTPREDICTIONSURL: "list_predictions.json",
        ADDPREDICTIONADMINURL: "add_prediction_admin.json",
        CURRENTROUNDADMINURL: "currentroundadmin.json",
        HISTORICROUNDSURL: "historicrounds.json",
        GETSPECIALMESSAGEURL: "specialmessage.json",
        ADDROUNDURL: "addround.json",
        ENDROUNDURL: "addround.json",
        SETSPECIALMESSAGEURL: "addround.json",
        ENDSPECIALMESSAGEURL: "addround.json",
        ADDPLAYERURL: "addplayer.json",
        DROPPLAYERURL: "dropplayer.json",
        REACTIVATEPLAYERURL: "addplayer.json"
    };

    constructor() {
        if (this.DEVELOPMENT) {
            console.log("Running in DEVELOPMENT mode.");
        }
    }

    fetch(key, method, params, headers, body, credentials) {
        // Ensure GET is always used in dev mode
        method = this.DEVELOPMENT ? "GET" : method || "GET";
        headers = headers || {};
        body = this.DEVELOPMENT ? null : body;
        credentials = this.DEVELOPMENT ? undefined : credentials === "undefined" ? undefined : credentials || "include";

        let url = null;
        
        if (this.DEVELOPMENT && Object.keys(this.OVERRIDES).indexOf(key) > -1) {
            url = this.OVERRIDES[key];
        }
        else {
            url = Constants[key];
        }
    
        if (!this.DEVELOPMENT && params) {
            url = url + "?";

            Object.keys(params).forEach(key => {
                url = url + `${key}=${params[key]}&`;
            });
        }

        return new Promise((resolve, reject) => (
            fetch(url,
            {
                method: method,
                headers: headers,
                credentials: credentials,
                body: body ? JSON.stringify(body) : null
            })
            .then(res => {
                return resolve(res)
            })
            .catch(err => {
                return reject(err)
            })
        ))   
    }
}
