app.controller('mainController', [
	'$scope',
	'$q',
	'$http',
	'hashStorage',

function($scope, $q, $http, hashStorage) {
	
	// ================================================================
	// = Space
	// ================================================================
	
	$scope.hashStorage = hashStorage;

	$scope.display = {};

	$scope.skillsCalculator = new SkillsCalculator;

	$scope.perkDecksCalculator = new PerkDecksCalculator;

	$scope.infamyCalculator = new InfamyCalculator;
	

	// ================================================================
	// = Load
	// ================================================================

	var promises = [];
	
	promises.push(getConfigFiles("skills/config.json",
		
		function(files, config) {
			$scope.skillsCalculator = new SkillsCalculator(files, config.property);
			/*
			$scope.skillsCalculator = new SkillsCalculator(
				(function setupTierConfig(trees, treeConfig) {
					trees.forEach(function(tree) {
						tree.tiers.forEach(function(tier) {
							var info = treeConfig.property[tier.tier];
							for (var attr in info) {
								tier[attr] = info[attr];
							}
						});
					});

					return trees;
				})(files, config)
			);
			*/
			console.log($scope.skillsCalculator);
		}
	));

	promises.push(getConfigFiles("perks/config.json",
		function(files, config) {

			$scope.perkDecksCalculator = new PerkDecksCalculator(
				(function setupPerksConfig(perks, config) {
					perks.forEach(function (perk) {
						perk.decks = [
							perk.decks[0],
							config.decksInfo[0],
							perk.decks[1],
							config.decksInfo[1],
							perk.decks[2],
							config.decksInfo[2],
							perk.decks[3],
							config.decksInfo[3],
							perk.decks[4]
						];
					});

					return perks;
				})(files, config)
			);
		}
	));

	promises.push(getFile("infamy/infamy.json").then(
		function(file) {
			$scope.infamyCalculator = new InfamyCalculator(file);
		}
	));

	$q.all(promises).then(function(data) {
		
		$scope.infamyCalculator.setSkillsCalculator($scope.skillsCalculator);
		$scope.infamyCalculator.load($scope.hashStorage);
		
		$scope.skillsCalculator.load($scope.hashStorage);
		$scope.perkDecksCalculator.load($scope.hashStorage);
		
		$scope.hashStorage.clear();

		$scope.skillsCalculator.save($scope.hashStorage);
		$scope.perkDecksCalculator.save($scope.hashStorage);
		$scope.infamyCalculator.save($scope.hashStorage);
	});


	// ================================================================
	// = Method
	// ================================================================

	$scope.set = function(name, value) {
		return $scope[name] = value;
	}
	

	// ================================================================
	// = Funs
	// ================================================================

	function getConfigFiles(path, callback) {

		return $q(function(resolve, reject) {

			getFile(path).then(function(config) {
				var files = config.files;

				var promises = files.map(function(file, index) {
					return getFile(file);
				});

				$q.all(promises).then(function(files) {
					resolve(callback(files, config));
				});
			});
		});
		
	}

	function getFile(file) {
		return $q(function(resolve, reject) {
			$http.get(file)
				.success(function(data) {
					resolve(data);
				})
				.error(function(data) {
					reject(data);
				});
		});
	}	

}]);