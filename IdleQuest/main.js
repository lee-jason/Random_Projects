$(document).ready(function(){
	var debug = 1;
	var $debugConsole = $('#debugConsole');
	//give the debug console a writeline function
	var console = {
		writeln: function(newLine, color){
			var color = color || '#000';
			if(debug == 1){$debugConsole.append($('<p>').html(newLine).css('color', color));}
		}
	}
	/**********************************
	*	helper object, for silly tasks*
	***********************************/
	var helper = {
		//min inclusive, max exclusive
		getRandomInt: function(min, max) {
		  return Math.floor(Math.random() * (max-1 - min + 1) + min);
		},
		getRandomFloat: function (min, max, decimalLength) {
			//defaul the decimal length to 2 if none inserted
			decimalLength = decimalLength || 2;
			return parseFloat((Math.random() * (max - min) + min).toFixed(decimalLength));
		},
		getRandomIntWVariance: function(point, variance){
			var variance = this.getRandomInt(0, variance);
			//if 0, subtract variance, if 1 add variance.
			if(this.getRandomInt(0, 2) == 0)
			{
				return point-variance;
			}
			else
			{
				return point+variance;
			}
		},
		getRandomFloatWVariance: function(point, variance){
			var variance = this.getRandomFloat(0, variance, 2);
			if(this.getRandomInt(0, 2) == 0)
			{
				return point-variance;
			}
			else
			{
				return point+variance;
			}
		}
	}
	
	//formulas are in its own section because this is some game balance shit that I would want to change all the time.
	var formulas = {
		expToLevel: function(x){
			return 20*Math.pow(x, 2);
		}, //where level threshold is x
		goldPerFight: function(x){
			return Math.pow(x, 2)/150 + 10; //where x is current hero level
		}, 
		expPerFight: function(x){
			return 12*x - 10;
		},
		heroAttackSpeed: function(agility, weaponSpeed){
			var cumulativeAgility = agility + weaponSpeed;
			if(cumulativeAgility < 1000)
			{
				return (-.001*cumulativeAgility)+2;
			}
			else if(cumulativeAgility < 10000)
			{
			
			}
			else if(cumulativeAgility < 50000)
			{
			
			}
		},
		heroDamage: function(strength, weaponDamage){
			return strength + weaponDamage;
		},
		//where the varaince would start at 1 second and linearly reduce to 0 at 100000;
		heroAttackSpeedVariance: function(x){
			return (-x/100000)+1
		},
		//where variance remains positively linear
		heroDamageVariance: function(x){
			return x;
		},
		//TODO: determine how the monsters stats should be calculated given a certain hero level.
		monsterStats: function(x){
		
		},
		//where at level 100000 the amount of stats that can be shared is 1000000 and at level 1 it would be 20?
		//TODO: finish up this function, what should it really return... total shared stats or a strength + agility grouping?
		itemStats: function(x){
			var sharedStats = 5*x;
			var strength = helper.getRandomInt(0, 5);
			var agility = sharedStats - strength;
		},
		itemStatsVariance: function(x){
			
		},
		itemPrice: function(x){
			
		}
		
	}
	
	/*******************************
	*	Objects/Items Constructors *
	********************************/
	var Monster = function(type, hp, attack, agility){
		this.type = type || "";
		this.hp = hp || 0;
		this.attack = attack || 0;
		this.agility = agility || 0;
		this.toString = function(){
			return "Monster, [type: "+this.type+"][hp: "+this.hp+"]";
		}
	}
	
	var Weapon = function(type, name, agility, damage){
		this.type = type || "";
		this.name = name || "basic weapon";
		this.agility = agility || 1;
		this.damage = damage || 1;
		this.toString = function(){
			return "Weapon, [type: "+this.type+"][name: "+this.name+"][agility: "+this.agility+"][damage: "+this.damage+"]";
		}
	}
	//armor here just to give each armor piece a common parent
	var Armor = function(name, defense, strength, agility){
		this.name = name || "";
		this.defense = defense || 0;
		this.strength = strength || 0;
		this.agility = agility || 0;
	}
	var Helm = function(name, defense){
		this.toString = function(){
			return "Helm, [type: "+this.type+"][name: "+this.name+"][defense: "+this.defense+"]";
		}
	}
	var Chest = function(name, defense){
		this.toString = function(){
			return "Chest, [type: "+this.type+"][name: "+this.name+"][defense: "+this.defense+"]";
		}
	}
	var Gloves = function(name, defense){
		this.toString = function(){
			return "Gloves, [type: "+this.type+"][name: "+this.name+"][defense: "+this.defense+"]";
		}
	}
	var Boots = function(name, defense){
		this.toString = function(){
			return "Boots, [type: "+this.type+"][name: "+this.name+"][defense: "+this.defense+"]";
		}
	}
	var Pants = function(name, defense){
		this.toString = function(){
			return "Pants, [type: "+this.type+"][name: "+this.name+"][defense: "+this.defense+"]";
		}
	}
	
	/**start inheritance code**/
	//inherit from Armor
	Helm.prototype = new Armor();
	Chest.prototype = new Armor();
	Gloves.prototype = new Armor();
	Pants.prototype = new Armor();
	Boots.prototype = new Armor();
	
	//Carry over the inherited stuff that Armor inherits to its children
	// Helm.prototype = Object.create(Armor.prototype);
	// Chest.prototype = Object.create(Armor.prototype);
	// Gloves.prototype = Object.create(Armor.prototype);
	// Pants.prototype = Object.create(Armor.prototype);
	// Boots.prototype = Object.create(Armor.prototype);
	
	//allows for 'instanceof' to work
	Helm.prototype.constructor = Armor;
	Chest.prototype.constructor = Armor;
	Gloves.prototype.constructor = Armor;
	Pants.prototype.constructor = Armor;
	Boots.prototype.constructor = Armor;
	/**end inheritance code**/
	
	var Loot = function(type, name, count, value){
		this.type = type || "";
		this.name = name || "";
		this.count = count || 0;
		this.value = value || 0;
		this.toString = function(){
			return "Loot, [type: "+this.type+"][name: "+this.name+"][value: "+this.value+"]";
		}
	}
	
	var Area = function(name, level){
		this.name = name || "";
		this.level = level || 0;
		this.toString = function(){
			return "Area, [name: "+this.name+"][level: "+this.level+"]";
		}
	}
	
	//level and xp are to be inserted when you're loading a new character..
	var Hero = function(type, name, hp, defense, endurance, strength, agility, level, xp){
		//var hero to be used in deeper functions 
		var hero = this;
		
		this.level = level || 1;
		this.xp = xp || 0;
		this.type = type || "";
		this.name = name || "";
		this.hp = hp || 0;
		this.defense = defense || 0;
		this.endurance = endurance || 0;
		this.strength = strength || 0;
		this.agility = agility || 0;
		this.weapon = new Weapon || null;
		this.helm = new Helm() || null;
		this.chest = new Chest() || null;
		this.gloves = new Gloves() || null;
		this.boots = new Boots() || null;
		this.pants = new Pants() || null;
		this.damage = formulas.heroDamage(this.strength, this.weapon.damage);
		this.attackspeed = formulas.heroAttackSpeed(this.agility, this.weapon.agility);
		this.inventory = {
			gold: 0,
			encumbrance: 0,
			sellAll: function(){
			
			},
			addToStash: function(item){
			
			},
			getEncumbrance: function(){
			
			},
			addGold: function(goldToAdd){
			
			},
			getGold: function(){
				return gold;
			}
		}
		
		//any time equiment is changed, recalculate character stats
		this.recalculateCharacter = function(){
		
		}
		
		//any time there is a shop transaction, recalculate gold
		this.recalculateGold = function(){
		
		}
		
		this.equip = function(item, object){
			switch(item){
				case "weapon":
					hero.agility = object.agility + hero.agility;
					hero.strength = object.damage + hero.strength;
					weapon = object;
					break;
				case "helm":
					hero.helm = object;
					break;
				case "chest":
					hero.chest = object;
					break;
				case "gloves":
					hero.gloves = object;
					break;
				case "boots":
					hero.boots = object;
					break;
				case "pants":
					hero.pants = object;
					break;
				default:
					break;
			}
			if(object instanceof Armor){
				hero.defense = object.defense + hero.defense;
			}
		}
		
		//unequiping items leaves the spot as value of null
		this.dequip = function(item){
			var isArmor = false;
			switch(item){
				case "weapon":
					hero.agility = hero.agility - hero.weapon.agility;
					hero.strength = hero.strength - hero.weapon.damage;
					break;
				case "helm":
					hero.helm = null;
					isArmor = true;
					break;
				case "chest":
					hero.chest = null;
					isArmor = true;
					break;
				case "gloves":
					hero.gloves = null;
					isArmor = true;
					break;
				case "boots":
					hero.boots = null;
					isArmor = true;
					break;
				case "pants":
					hero.pants = null;
					isArmor = true;
					break;
			}
			if(isArmor){
				hero.defense = hero.defense - object.defense;
			}
		}
		
		this.toString = function(){
			
		}
	}
	
	/**************************
	* Names and Such		  *
	***************************/
	
	var names = {
		monsters: ["herp", "derp"],
		weapons: ["rapier"],
		armor: ["studded leather"], 
		hero: ["champion"]
	}
	
	var types = {
		monsters: ["ogre", "imp", "witch", "rat"],
		weapons: ["hammer", "mace", "dagger", "sword"],
		armor: ["helm", "chest", "gloves", "boots", "pants"],
		hero: ["assassin", "thief", "warrior", "bard"]
	}

	
	
	//randomly generate an object based off a level
	//higher the level higher the stats
	function generateObject(item, lvl)
	{
		switch(item){
			case "monster":
				var monsterType = types.monsters[helper.getRandomInt(0, types.monsters.length)];
				var monsterHp = helper.getRandomInt(10, 20);
				return new Monster(monsterType, monsterHp);
				break;
			case "weapon":
				var weaponType = types.weapons[helper.getRandomInt(0, types.weapons.length)];
				var weaponName = nameGenerator(item);
				var weaponSpeed = helper.getRandomFloat(0, 2, 2);
				var weaponDamage = helper.getRandomFloat(1, 5, 2);
				return new Weapon(weaponType, weaponName, weaponSpeed, weaponDamage);
				break;
			case "helm":
				var helmName = nameGenerator("helm");
				var helmDefense = helper.getRandomInt(1, 10);
				return new Helm(helmName, helmDefense);
			case "chest":
				return new Chest;
				break;
			case "boots":
				return new Boots;
				break;
			case "gloves":
				return new Gloves;
				break;
			case "pants":
				return new Pants;
				break;
			case "loot":
				return new Loot;
				break;
			case "hero":
				return new Hero("human", "new hero", 100, 3, 50, 2, 5);
				break;
			case "area":
				return new Area;
				break;
		}
		
		//generate a name for your item
		function nameGenerator(item)
		{
			switch(item){
				case "monster":
					return "monster";
					break;
				case "weapon":
					return "weapon";
					break;
				case "armor":
					return "armor";
					break;
				case "loot":
					return "loot";
					break;
				case "hero":
					return "hero";
					break;
				case "area":
					return "area";
					break;
			}
		}
	}
	
	/*****************
	* battle stuff   *
	******************/
	//new battlestates to be made for each encounter.
	function BattleState(){
		var battleState = this;
		var enemies = [];
		var battleOver = 0;
		var heroTimeoutID = 0;
		var monsterTimeoutID = 0;

		//declare the end of battle,
		//stop attack timeouts
		//pass out the loot ?
		var endBattle = function(){
			battleOver = 1;
			clearTimeout(heroTimeoutID);
			clearTimeout(monsterTimeoutID);
		}
		this.setEnemies = function(enem){
			//takes in an array of enemies ?
			enemies = enem;
		}
		this.beginBattle = function(){
			console.writeln("battle start!");
			console.writeln(battleState.toString());
			recurseAttacks("hero");
			recurseAttacks("monster");
		}
		this.toString = function(){
			console.writeln("enemies: " + enemies.toString());
			console.writeln("hero: hp:" + gameState.hero.hp);
		}
		
		var recurseAttacks = function(character){
			if(battleOver == 0)
			{
				if(character == "hero")
				{
					if(enemies.length > 0)
					{
						//TODO: determine the amount of time taken between attacks based on heroe's agility, and a level of variance, the greater the heroes's level the greater the variance?
						//TODO: determine the amount of damage given for each attack based on heroes's damage attribute and the amount of variance based on the heroes's current level,
						//the higher the current level, the greater the variance?
						
						heroTimeoutID = setTimeout(function(){
							attack("monster", gameState.hero.damage);
							
							battleState.toString();
							recurseAttacks("hero");
						}, helper.getRandomInt(1,5) * 650);
					}
					else{
						//hero wins!
						console.writeln("hero wins!");
						endBattle();
					}
				}
				else if(character == "monster")
				{
					if(gameState.hero.hp > 0)
					{
						//TODO: for each enemy, determine the amount of time taken between each enemies' attacks based on their agility
						//TODO: for each enemy, determine the amount of damage they do based on their strength alone? Since they don't wield weapons.
						monsterTimeoutID = setTimeout(function(){
							var attackPower = helper.getRandomInt(8,16);
							attack("hero", attackPower);
							
							battleState.toString();
							recurseAttacks("monster");
						}, helper.getRandomInt(1,5) * 650);
					}
					else{
						//game Obera
						console.writeln("monsters win!");
						endBattle();
					}
				}
			}
		};
		
		var attack = function(character, attackpoints){
			//if there's more than 1 enemy, then randomly pick and attack one.
			if(character == "monster" && enemies.length > 0)
			{	
				var randomEnemy = helper.getRandomInt(0,enemies.length);
				enemies[randomEnemy].hp = enemies[randomEnemy].hp - attackpoints;
				console.writeln("hero attacks " + enemies[randomEnemy].type + " for " + attackpoints + " damage", 'blue');
				if(enemies[randomEnemy].hp <= 0)
				{
					console.writeln(enemies[randomEnemy].type + " is slain!");
					enemies.splice(randomEnemy, 1);
				}
			}
			else if(character == "hero" && gameState.hero.hp > 0)
			{
				gameState.hero.hp = gameState.hero.hp - attackpoints;
				console.writeln("monster attacks hero for " + attackpoints + " damage", 'red');
			}
		};
	}

	/******************
	*    game state   *
	*******************/
	//should only have 1 gamestate with 1 hero for each game.
	function GameState(hero){
		var gameState = this;
		var hero = hero;
		this.hero = hero;
	}
	
	/******************
	*       init      *
	*******************/
	function init(){
		var hero = generateObject("hero");
		gameState = new GameState(hero);
		var battleState = new BattleState(hero);
	
		var weapon = generateObject("weapon");
		var helm = generateObject("helm");
		
		var monst1 = generateObject("monster");
		var monst2 = generateObject("monster");
		battleState.setEnemies([monst1, monst2]);
		battleState.beginBattle();
	}
	
	function run(){

	}
	
	//gamestate to be filled in init with hero information
	var gameState = null;
	init();
	run();
});