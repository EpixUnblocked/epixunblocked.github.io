(function(){
	var clickHospital = angular.module("clickHospital", []);
	clickHospital.controller("gameController", ["$scope", "$interval", function($scope, $interval){

		$scope.tabs = [
			"Medical Staff",
			"Other Staff",
			"Upgrades",
			"Achievements",
			"Statistics"
		];

		$scope.selectedTab = $scope.tabs[0];

		$scope.data = {
			"Medical Staff": [
				{
					name: "Nurse",
					desc: "Someone has to do all the work, and it sure isn't going to be you!",
					bc: 50,
					i: 0.5
				},
				{
					name: "Resident Doctor",
					desc: "Fresh out of university and will do anything for a job.",
					bc: 250,
					i: 5
				},
				{
					name: "General Practitioner (GP)",
					desc: "Doesn't specialize in any field, but fails equally in all.",
					bc: 1000,
					i: 20
				}
			],
			"Other Staff": [],
			Upgrades: [],
			Achievements: [
				{
					name: "$1",
					desc: "Earned your first buck",
					test: function() {
						return $scope.game.earned >= 1;
					}
				},
				{
					name: "$1k",
					desc: "Earned your fist thousand",
					test: function() {
						return $scope.game.earned >= 1000;
					}
				}
			]
		};

		$scope.game = {
			money: 0,
			chanceLawsuit: 0,
			earned: 0,
			spent: 0,
			sold: 0,
			"Medical Staff": {0:0},
			"Other Staff": {0:0},
			Upgrades: {0:0},
			Achievements: {}
		};

		function buildDisplay() {
			$scope.display = [];
			var tabData = $scope.data[$scope.selectedTab];
			for (var i = 0; i < tabData.length; i++) {
				var count = $scope.game[$scope.selectedTab][i];
				if (count != undefined) {
					var obj = tabData[i];
					if (obj.bc) {
						obj.buyPrice = Math.round(obj.bc + ((obj.bc * 0.4) * count) | 0);
						obj.sellPrice = Math.round((obj.bc * 0.4) * count);
					}
					obj.own = count;
					obj.index = i;
					$scope.display.push(obj);
				}
			}
		}

		function checkAchievements() {
			var achievements = $scope.data.Achievements;
			var c = false;
			for (var i = 0; i < achievements.length; i++) {
				var unlocked = $scope.game.Achievements[i] == 1;
				if (!unlocked) {
					if (achievements[i].test()) {
						$scope.game.Achievements[i] = 1;
						c = true;
					}
				}
			}
			return c;
		}

		function tick() {
			for (var i = 0; i < 2; i++) { //only check first 2 tabs (staff)
				var tab = $scope.tabs[i];
				for (var j in $scope.game[tab]) {
					var count = $scope.game[tab][j];
					if (count > 0) {
						var income = $scope.data[tab][j].i;
						if (income) {
							//Need to check for any upgrades that change the income
							var value = income * count;
							$scope.game.money += value;
							$scope.game.earned += value;
							if (checkAchievements()) {
								buildDisplay();
							}
						}
					}
				}
			}
		}

		var a = [1000000000000000000000, 1000000000000000000, 1000000000000000, 1000000000000, 1000000000, 1000000, 1000];
		var s = ["S", "Qt", "Q", "T", "B", "M", "k"];

		$scope.formatCurrency = function(val) {
			var amt = val;
			var char = "";
			for (var i = 0; i < 7; i++) {
				if (val >= a[i]) {
					amt = val / a[i];
					char = s[i];
					break;
				}
			}
			return "$" + (Math.round(amt * 100) / 100) + char;
		};

		$scope.seePatient = function(){
			var amount = 1;
			$scope.game.money += amount;
			$scope.game.earned += amount;
			if (checkAchievements()) {
				buildDisplay();
			}
		};

		$scope.switchTab = function(tab) {
			$scope.selectedTab = tab;
			buildDisplay();
		};

		function getObjectIndex(obj) {
			var tabData = $scope.data[$scope.selectedTab];
			var index = -1;
			for (var i = 0; i < tabData.length; i++) {
				if (tabData[i].name == obj.name) {
					index = i;
					break;
				}
			}
			return index;
		}

		$scope.buyObject = function(obj) {
			var index = getObjectIndex(obj);
			if (index != -1) {
				var origObj = $scope.data[$scope.selectedTab][index];
				var count = $scope.game[$scope.selectedTab][index];
				var cost = Math.round(origObj.bc + ((origObj.bc * 0.4) * count) | 0);
				if (cost <= $scope.game.money) {
					$scope.game[$scope.selectedTab][index] += 1;
					$scope.game.money -= cost;
					$scope.game.spent += cost;
					if ($scope.game[$scope.selectedTab][index + 1] == undefined) {
						$scope.game[$scope.selectedTab][index + 1] = 0;
					}
					checkAchievements();
					buildDisplay();
				}
			}
		};

		$scope.sellObject = function(obj) {
			var index = getObjectIndex(obj);
			if (index != -1) {
				var count = $scope.game[$scope.selectedTab][index];
				if (count > 0) {
					var origObj = $scope.data[$scope.selectedTab][index];
					var sellPrice = Math.round((origObj.bc * 0.4) * count);
					$scope.game[$scope.selectedTab][index] -= 1;
					$scope.game.money += sellPrice;
					$scope.game.sold += sellPrice;
					checkAchievements();
					buildDisplay();
				}
			}
		};

		buildDisplay();

		var gameTimer = $interval(tick, 1000);
	}]);
})();
