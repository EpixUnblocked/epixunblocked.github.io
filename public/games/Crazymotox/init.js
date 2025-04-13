if (typeof globalThis.sparshaFirebase === "undefined") {
    globalThis.sparshaFirebase = {};

    globalThis.sparshaFirebase._res = {};
    //Results

    globalThis.sparshaFirebase.myApp = {};
    //User's initialised apps
    globalThis.sparshaFirebase.myAppcheck = {};

    globalThis.sparshaFirebase.myAuth = {};
    globalThis.sparshaFirebase.myDatabase = {};
    globalThis.sparshaFirebase.myFirestore = {};
    globalThis.sparshaFirebase.myStorage = {};
    globalThis.sparshaFirebase.myAnalytics = {};
    globalThis.sparshaFirebase.myRemoteconfig = {};
    globalThis.sparshaFirebase.myPerformance = {};
    


    globalThis.sparshaFirebase._loadedApp = {};
    //Apps that have been loaded, used for auth enable projects
    globalThis.sparshaFirebase._LoginByEvent = {};

    //globalThis.sparshaFirebase._TrigNotEvent = {};

    globalThis.sparshaFirebase._AuthProEnabled = {};

    globalThis.sparshaFirebase._CaptchaVerifier = null;

    globalThis.sparshaFirebase._RecaptchaWidgetId = null;

    globalThis.sparshaFirebase._ConfirmationResult = null;
    
    globalThis.sparshaFirebase._PerfCustomTrace = {};


    globalThis.sparshaFirebase.app = {};
    globalThis.sparshaFirebase.appcheck = {};
    globalThis.sparshaFirebase.auth = {};
    globalThis.sparshaFirebase.database = {};
	globalThis.sparshaFirebase.firestore = {};
	globalThis.sparshaFirebase.storage = {};
    globalThis.sparshaFirebase.analytics = {};
    globalThis.sparshaFirebase.remoteconfig = {};
    globalThis.sparshaFirebase.performance = {};


    globalThis.sparshaFirebase._isLoaded = 0;

    globalThis.sparshaFirebase._dbDetailLog = 0;
    
    globalThis.sparshaFirebase._firestoreSyncSnaps= {};

    globalThis.sparshaFirebase._GetAuthMapData = function (user, sdkName) {
        var authExpBasic = {};
        var authExpPro = {};
        authExpPro.TrigNotEvent = 0;
        if (user) {
        	if(!globalThis.sparshaFirebase._LoginByEvent[sdkName]) authExpPro.TrigNotEvent = 1;
            globalThis.sparshaFirebase._res[sdkName].user = user;
            authExpBasic["isSignedIn"] = 1;
            authExpBasic["myUID"] = user["uid"];
            authExpBasic["isEmailVerified"] = user["emailVerified"];
            authExpPro["isAnonymPro"] = user["isAnonymous"];
            authExpPro["userCreatnTime"] = user.metadata["createdAt"];
            authExpPro["userLastSign"] = user.metadata["lastLoginAt"];
			
            if (user["providerData"].length != 0) {
                authExpPro["providerSDPro"] = user["providerData"];
                authExpPro["countProviderPro"] = authExpPro["providerSDPro"].length;
                if (user["providerData"][0]["providerId"] != null) authExpBasic["providerID"] = user["providerData"][0]["providerId"];
            }
            else if (user["isAnonymous"]) {
                authExpBasic["providerID"] = "anonymous";
                authExpPro["providerSDPro"] = [];
                authExpPro["providerSDPro"][0] = [];
                authExpPro["providerSDPro"][0]["providerId"] = "anonymous";
                authExpPro["countProviderPro"] = 1;
            }

            if (user["displayName"] != null) authExpBasic["username"] = user["displayName"];
            else authExpBasic["username"] = "";

            if (user["photoURL"] != null) authExpBasic["photoURL"] = user["photoURL"];
            else authExpBasic["photoURL"] = "";

            if (user["email"] != null) authExpBasic["myEmail"] = user["email"];
            else authExpBasic["myEmail"] = "";

            if (user["phoneNumber"] != null) authExpBasic["phoneNo"] = user["phoneNumber"];
            else authExpBasic["phoneNo"] = "";
        }
        else {
        	authExpPro.TrigNotEvent = 0;
            authExpBasic["isSignedIn"] = 0;
            authExpBasic["username"] = "";
            authExpBasic["myUID"] = "";
            authExpPro["isAnonymPro"] = false;
            authExpPro["userCreatnTime"] = "";
            authExpPro["userLastSign"] = "";
            authExpBasic["photoURL"] = "";
            authExpBasic["myEmail"] = "";
            authExpBasic["phoneNo"] = "";
            authExpBasic["isEmailVerified"] = false;
        }
        return { authExpBasic: authExpBasic, authExpPro: authExpPro };
    }
}