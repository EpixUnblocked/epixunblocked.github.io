import {
    anonymousLogin,
    getLeaderboard,
    initialize,
    loadUser,
    logEvent,
    saveScore,
    updateUser

} from "./dinostruct.js";

function loadScript(scriptUrl, scriptType = "text/javascript")
{
    return new Promise((resolve, reject) =>
    {
        const script = document.createElement("script");

        script.async = true;
        script.defer = true;
        script.src = scriptUrl;
        script.type = scriptType;

        script.onload = () => resolve();
        script.onerror = () => reject();

        document.body.appendChild(script);
    });
}

const scriptsInEvents = {

	async Ev_transition_Event16_Act2(runtime, localVars)
	{
		const inst = runtime.objects.f_Box_transition.getFirstPickedInstance();
		inst.behaviors.Box_Tween.startTween("x", inst.instVars.originalX, inst.instVars.Time_In, inst.instVars.Ease_In,{
			tags: "in"
		});
	},

	async Ev_transition_Event17_Act2(runtime, localVars)
	{
		const inst = runtime.objects.f_Box_transition.getFirstPickedInstance();
		inst.behaviors.Box_Tween.startTween("x", inst.instVars.originalX, inst.instVars.Time_In, inst.instVars.Ease_In,{
			tags: "in"
		});
	},

	async Ev_transition_Event18_Act2(runtime, localVars)
	{
		const inst = runtime.objects.f_Box_transition.getFirstPickedInstance();
		inst.behaviors.Box_Tween.startTween("y", inst.instVars.originalY, inst.instVars.Time_In, inst.instVars.Ease_In,{
			tags: "in"
		});
	},

	async Ev_transition_Event19_Act2(runtime, localVars)
	{
		const inst = runtime.objects.f_Box_transition.getFirstPickedInstance();
		inst.behaviors.Box_Tween.startTween("y", inst.instVars.originalY, inst.instVars.Time_In, inst.instVars.Ease_In,{
			tags: "in"
		});
	},

	async Ev_transition_Event20_Act3(runtime, localVars)
	{
		const inst = runtime.objects.f_Box_transition.getFirstPickedInstance();
		inst.behaviors.Box_Tween.startTween("size", [inst.instVars.originalWidth, inst.instVars.originalHeight], inst.instVars.Time_In, inst.instVars.Ease_In,{
			tags: "in"
		});
	},

	async Ev_transition_Event25_Act1(runtime, localVars)
	{
		const inst = await runtime.objects.f_Box_transition.getFirstPickedInstance();
		inst.behaviors.Box_Tween.startTween("x", inst.instVars.originalX+inst.instVars.moveAmount, inst.instVars.Time_Out, inst.instVars.Ease_Out,{
			tags: "out"
		});
	},

	async Ev_transition_Event26_Act1(runtime, localVars)
	{
		const inst = await runtime.objects.f_Box_transition.getFirstPickedInstance();
		inst.behaviors.Box_Tween.startTween("x", inst.instVars.originalX-inst.instVars.moveAmount, inst.instVars.Time_Out, inst.instVars.Ease_Out,{
			tags: "out"
		});
	},

	async Ev_transition_Event27_Act1(runtime, localVars)
	{
		const inst = await runtime.objects.f_Box_transition.getFirstPickedInstance();
		inst.behaviors.Box_Tween.startTween("y", inst.instVars.originalY-inst.instVars.moveAmount, inst.instVars.Time_Out, inst.instVars.Ease_Out,{
			tags: "out"
		});
	},

	async Ev_transition_Event28_Act1(runtime, localVars)
	{
		const inst = await runtime.objects.f_Box_transition.getFirstPickedInstance();
		inst.behaviors.Box_Tween.startTween("y", inst.instVars.originalY+inst.instVars.moveAmount, inst.instVars.Time_Out, inst.instVars.Ease_Out,{
			tags: "out"
		});
	},

	async Ev_transition_Event29_Act1(runtime, localVars)
	{
		const inst = await runtime.objects.f_Box_transition.getFirstPickedInstance();
		inst.behaviors.Box_Tween.startTween("size", [1, 1], inst.instVars.Time_Out, inst.instVars.Ease_Out,{
			tags: "in"
		});
	},

	async Ev_tools_Event6_Act1(runtime, localVars)
	{
function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})$/;
    return regex.test(email);
}
if(isValidEmail(localVars.email)){
localVars.result = 1;
}else{localVars.result = 0};
	},

	async Ev_tools_Event8_Act1(runtime, localVars)
	{
		// Functions declaration
		function containsSubstring(string, substrings) {
		    string = string.toLowerCase();
		    for (let i = 0; i < substrings.length; i++) {
		        if (string.includes(substrings[i].toLowerCase())) {
		            return true;
		        }
		    }
		    return false;
		}
		
		function stringToList(string) {
		    return string.split(",");
		}
		function stringToArray(string) {
		    return JSON.parse(string);
		}
		//console.log(stringToList(localVars.array));
		
		if(containsSubstring(localVars.string, stringToList(localVars.array))){
			localVars.result = 1;
		}else{
			localVars.result = 0;
		}
	},

	async Ev_buttons_Event29_Act1(runtime, localVars)
	{
		window.open(runtime.globalVars.discordUrl);
	},

	async G_sdk_ev_Event3_Act1(runtime, localVars)
	{
		await loadScript("https://sdk.crazygames.com/crazygames-sdk-v3.js");
		await window.CrazyGames.SDK.init();
	},

	async G_sdk_ev_Event6_Act1(runtime, localVars)
	{
		const user = await window.CrazyGames.SDK.user.getUser();
		
		if (await user) {
			runtime.globalVars.username = user.username;
			runtime.globalVars.sdkUsername = user.username;
			console.log("C3 SDK username esiste: "+user.username);
		}
	},

	async G_sdk_ev_Event10_Act1(runtime, localVars)
	{
		const reward = localVars.reward;
		
		const callbacks = {
		  adFinished: () => runtime.callFunction("SDK_RewardedCallback", true, reward),
		  adError: (error) => runtime.callFunction("SDK_RewardedCallback", false, reward),
		  adStarted: () => console.log("Start rewarded ad"),
		};
		window.CrazyGames.SDK.ad.requestAd("rewarded", callbacks);
	},

	async G_sdk_ev_Event22_Act1(runtime, localVars)
	{
		const callbacks = {
		  adFinished: () => runtime.callFunction("SDK_InterstitialCallback", true),
		  adError: (error) => runtime.callFunction("SDK_InterstitialCallback", false),
		  adStarted: () => console.log("Start interstitial ad"),
		};
		window.CrazyGames.SDK.ad.requestAd("midgame", callbacks);
	},

	async G_sdk_ev_Event32_Act1(runtime, localVars)
	{
		window.CrazyGames.SDK.game.gameplayStart();
	},

	async G_sdk_ev_Event33_Act1(runtime, localVars)
	{
		window.CrazyGames.SDK.game.gameplayStop();
	},

	async G_sdk_ev_Event37_Act1(runtime, localVars)
	{
		window.CrazyGames.SDK.game.happytime();
	},

	async G_sdk_ev_Event41_Act1(runtime, localVars)
	{
		window.CrazyGames.SDK.game.showInviteButton({ roomId: localVars.roomId, p: (localVars.isPublic == 1 ? "public" : "private")});
	},

	async G_sdk_ev_Event45_Act1(runtime, localVars)
	{
		window.CrazyGames.SDK.game.hideInviteButton();
	},

	async G_sdk_ev_Event49_Act1(runtime, localVars)
	{
		if( window.CrazyGames.SDK.game.getInviteParam("roomId") ){
		
			localVars.roomId = window.CrazyGames.SDK.game.getInviteParam("roomId");
			
		}else{
		
			localVars.roomId = "";
		
		}
	},

	async G_sdk_ev_Event53_Act1(runtime, localVars)
	{
		if( window.CrazyGames.SDK.game.getInviteParam("p") ){
		
			localVars.isPublic = window.CrazyGames.SDK.game.getInviteParam("p");
			
		}else{
		
			localVars.isPublic = "";
			
		}
	},

	async G_storagemanager_ev_Event9_Act4(runtime, localVars)
	{
		var tutorial_done = window.CrazyGames.SDK.data.getItem("tutorial_done");
		if (tutorial_done) {
			runtime.globalVars.tutorialDone = tutorial_done;
		}
		
		var player_username = window.CrazyGames.SDK.data.getItem("player_username");
		if (player_username) {
			runtime.globalVars.username = player_username;
		}
		
		var player_balance = window.CrazyGames.SDK.data.getItem("player_balance");
		if (player_balance) {
			runtime.globalVars.balance = player_balance;
		}
		
		var player_helmet = window.CrazyGames.SDK.data.getItem("player_helmet");
		if (player_helmet) {
			runtime.globalVars.skinHelmet = player_helmet;
		}
		
		var player_frame = window.CrazyGames.SDK.data.getItem("player_frame");
		if (player_frame) {
			runtime.globalVars.skinFrame = player_frame;
		}
		
		var player_wheels = window.CrazyGames.SDK.data.getItem("player_wheels");
		if (player_wheels) {
			runtime.globalVars.skinWheels = player_wheels;
		}
		
		var player_smoke = window.CrazyGames.SDK.data.getItem("player_smoke");
		if (player_smoke) {
			runtime.globalVars.skinSmoke = player_smoke;
		}
		
		var player_horn = window.CrazyGames.SDK.data.getItem("player_horn");
		if (player_horn) {
			runtime.globalVars.skinHorn = player_horn;
		}
		
		var player_purchasedSkins = window.CrazyGames.SDK.data.getItem("player_purchasedSkins");
		if (player_purchasedSkins) {
			runtime.globalVars.tempJsonPurchasedSkins = player_purchasedSkins;
		}
	},

	async G_storagemanager_ev_Event16_Act1(runtime, localVars)
	{
		window.CrazyGames.SDK.data.setItem("player_balance", runtime.globalVars.balance);
	},

	async G_storagemanager_ev_Event17_Act2(runtime, localVars)
	{
		window.CrazyGames.SDK.data.setItem("tutorial_done", runtime.globalVars.tutorialDone);
	},

	async G_storagemanager_ev_Event18_Act2(runtime, localVars)
	{
		window.CrazyGames.SDK.data.setItem("player_username", runtime.globalVars.username);
		window.CrazyGames.SDK.data.setItem("player_balance", runtime.globalVars.balance);
		window.CrazyGames.SDK.data.setItem("player_helmet", runtime.globalVars.skinHelmet);
		window.CrazyGames.SDK.data.setItem("player_frame", runtime.globalVars.skinFrame);
		window.CrazyGames.SDK.data.setItem("player_wheels", runtime.globalVars.skinWheels);
		window.CrazyGames.SDK.data.setItem("player_smoke", runtime.globalVars.skinSmoke);
		window.CrazyGames.SDK.data.setItem("player_horn", runtime.globalVars.skinHorn);
		window.CrazyGames.SDK.data.setItem("player_purchasedSkins", runtime.globalVars.tempJsonPurchasedSkins);
	},

	async G_storagemanager_ev_Event20_Act1(runtime, localVars)
	{
		window.CrazyGames.SDK.data.clear();
	},

	async Loading_ev_Event9_Act1(runtime, localVars)
	{
		var player_username = window.CrazyGames.SDK.data.getItem("player_username");
		if (player_username) {
			localVars.storedUsernameExist = true;
		}
	},

	async Loading_ev_Event23_Act1(runtime, localVars)
	{
		var instantMultiplayer = window.CrazyGames.SDK.game.isInstantMultiplayer;
		if (instantMultiplayer) {
			localVars.isInstantMultiplayer = true;
		}
	},

	async G_server_ev_Event65_Act1(runtime, localVars)
	{
initialize(runtime, {
    functions: {
        anonymousLogin: {
            onSuccess: "onAnonymousSuccess",
            onError: "onAnonymousFailed"
        },
        saveScore: { onSuccess: null }
    },
    variables: { Username: "username" },
    jsonDatas: { Leaderboard: "leaderboard" },

    storeUser: true,
    useUsername: true,
    sanitizeUsername: false,
	useAnalytics: true,
	analyticsCustomHost: `${runtime.globalVars.S_endpoint}/api/v1/log-event`
});
	},

	async G_server_ev_Event67_Act3(runtime, localVars)
	{
		anonymousLogin(runtime.globalVars.username);
	},

	async G_server_ev_Event73_Act1(runtime, localVars)
	{
		loadUser();
	},

	async G_server_ev_Event77_Act1(runtime, localVars)
	{
		saveScore(localVars.t, {
		helmet: localVars.helmet_,
		frame: localVars.frame_,
		wheels: localVars.wheels_
		});
	},

	async G_server_ev_Event79_Act1(runtime, localVars)
	{
		updateUser({
			username: localVars.newUsername
		})
	},

	async G_server_ev_Event83_Act1(runtime, localVars)
	{
		getLeaderboard();
	},

	async G_server_ev_Event89_Act1(runtime, localVars)
	{
		logEvent(localVars.log);
	},

	async G_server_ev_Event91_Act1(runtime, localVars)
	{
		logEvent(localVars.log, {
		time: runtime.globalVars.gameTime
		});
	},

	async Chunkmanager_ev_Event65_Act1(runtime, localVars)
	{

	},

	async Chunkmanager_ev_Event65_Act2(runtime, localVars)
	{
		localVars.result = 0.5 + (localVars.end - 0.5) * 
		    (Math.sin(Math.PI * (localVars.t - 0.5)) * 0.5 + 0.5);
		
	}
};

self.C3.ScriptsInEvents = scriptsInEvents;
