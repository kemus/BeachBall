//Declare and Initialize Variables
var BeachBall = {};
BeachBall.incoming_ONG = 0;
BeachBall.Time_to_ONG = 1800000;
BeachBall.lootBoxes = ['boosts', 'ninj', 'cyb', 'hpt', 'bean', 'chron', 'ceil', 'drac', 'badges', 'discov', 'badgesav', 'monums', 'monumg', 'tagged'];

//Version Information
BeachBall.version = '4.0 Beta';
BeachBall.SCBversion = '3.234'; //Last SandCastle Builder version tested

//BB Options Variables
BeachBall.AudioAlertsStatus = 0;
BeachBall.audio_Bell = new Audio("http://xenko.comxa.com/Ship_Bell.mp3");
	BeachBall.audio_Bell.volume = 1;
BeachBall.audio_Chime = new Audio("http://xenko.comxa.com/Chime.mp3");
	BeachBall.audio_Chime.volume = 1;
BeachBall.BeachAutoClickCPS = 1;
BeachBall.BeachAutoClickStatus = 1;
BeachBall.CagedAutoClickStatus = 0;
BeachBall.ClickRemainder = 0;
BeachBall.description = "Error";
BeachBall.LCSolverStatus = 0;
BeachBall.MHAutoClickStatus = 0;
BeachBall.toolFactory = 1000;
BeachBall.refreshRate = 1000;
BeachBall.RKAlertFrequency = 8;
BeachBall.RKAutoClickStatus = 1;
BeachBall.RKPlayAudio = 1;

//RK Variables
BeachBall.start = -1;
BeachBall.content = "empty";
BeachBall.len = 0;
BeachBall.Logicat = 0;
BeachBall.oldRKLocation = -1;
BeachBall.oldRC = Molpy.redactedClicks - 1;
BeachBall.oldLC = Molpy.Boosts['Logicat'].power - 1;
BeachBall.RKLevel = '-1';
BeachBall.RKLocation = '123';
BeachBall.RKNew = 1;
BeachBall.RKNewAudio = 1;
BeachBall.RKTimer = Molpy.redactedToggle - Molpy.redactedCountup;

//Autoclicks the Beach
BeachBall.BeachAutoClick = function() {
	clicks = 0;
	wholeClicks = 0;
	//If the auto clicker is enabled
	if (BeachBall.BeachAutoClickStatus == 2 && Molpy.ninjad != 0 && BeachBall.Time_to_ONG >= 5) {
		//Calculates number of clicks to process this tick
		clicks = BeachBall.BeachAutoClickCPS*BeachBall.refreshRate/1000 + BeachBall.ClickRemainder;
		//If > 1, process whole clicks this tick, save the remainder for the next tick.
		if (clicks >= 1) {
			wholeClicks = Math.floor(clicks);
			BeachBall.ClickRemainder = clicks - wholeClicks;
			BeachBall.ClickBeach(wholeClicks);
		}
		//If < 1, save for next tick
		else {
			BeachBall.ClickRemainder = clicks;
		}
	}
}

BeachBall.CagedLogicat = function() {
	var i = 65;
	var LCSolution = 'A';
	do 
		{LCSolution = String.fromCharCode(i);
		i++;}
	while (Molpy.cagedPuzzleTarget != Molpy.cagedSGen.StatementValue(LCSolution));
	Molpy.ClickCagedPuzzle(LCSolution);
}

BeachBall.ClickBeach = function(number) {
	if (Molpy.Got('Temporal Rift') == 0){
		for (i = 0; i < number; i++) {
			Molpy.ClickBeach();
		}
	}
	else {
		Molpy.Notify('Temporal Rift Active, AutoClicking Disabled', 1);
	}
}

BeachBall.CagedAutoClick = function() {
//Purchases Caged Logicat
	//If Caged AutoClick is Enabled, and Caged Logicat isn't Sleeping and Caged Logicat isn't already purchased
	if (BeachBall.CagedAutoClickStatus == 1 && Molpy.Got('Caged Logicat') > 1 && Molpy.Boosts['Caged Logicat'].power == 0) {
		//Determines Logicat Cost, and if sufficient blocks available, caged logicat is purchased.
		cost = 100 + Molpy.LogiMult(25);
		if (Molpy.HasGlassBlocks(cost)) {
			Molpy.MakeCagedPuzzle(cost);
			BeachBall.CagedLogicat();
		}
	}
	
//Caged Logicat Solver is always called, as this ensures both manually purchased and autoclick purchased will be solved
//Can now define solving conditions other than availability (to maximize Temporal Duplication for instance).
	//If a Caged Logicat Problem is Available, and the Logicat Solver is Enabled, Solve the Logicat
	if (Molpy.Boosts['Caged Logicat'].power == 1 && BeachBall.LCSolverStatus == 1) {
		BeachBall.CagedLogicat();
	}
}

BeachBall.DisplayDescription = function(option, status) {
	var error = 0;
	var description = 'error';
	if (option == 'AudioAlerts') {
		if (status == 0) {description = 'Off';}
		else if (status == 1) {description = 'RK Only'; BeachBall.RKPlayAudio = 1;}
		else if (status == 2) {description = 'LC Only'; BeachBall.RKPlayAudio = 1;}
		else if (status == 3) {description = 'ONG Only';}
		else if (status == 4) {description = 'All Alerts'; BeachBall.RKPlayAudio = 1;}
		else {Molpy.Notify('Display Description Error - Audio Alerts: ' + status, 1);}
	}
	else if (option == 'BeachAutoClick') {
		if (status == 0) {description = 'Off';}
		else if (status == 1) {description = 'Keep Ninja';}
		else if (status == 2) {description = 'On: <a onclick="BeachBall.SwitchOption(\'BeachAutoClickRate\')">' + BeachBall.BeachAutoClickCPS + ' cps</a>';}
		else {Molpy.Notify('Display Description Error - BeachAutoClick: ' + status, 1);}
	}
	else if (option == 'CagedAutoClick' || option == 'LCSolver' || option == 'MHAutoClick') {
		if (status == 0) {description = 'Off';}
		else if (status == 1) {description = 'On';}
		else {Molpy.Notify('Display Description Error - ' + option + ': ' + status, 1);}
	}
	else if (option == 'RKAutoClick') {
		if (status == 0) {description = 'Off';}
		else if (status == 1) {description = 'Find RK Only'; BeachBall.RKNew = 1;}
		else if (status == 2) {description = 'On'; BeachBall.RKNew = 1;}
		else {Molpy.Notify('Display Description Error - RKAutoClick: ' + status, 1);}
	}
	else if (option == 'RefreshRate') {
		description = BeachBall.refreshRate;
	}
	else if (option == 'ToolFactory') {
		if (Molpy.Got('Tool Factory') == 1) {
			g('BBToolFactory').innerHTML = '<a onclick="Molpy.LoadToolFactory(' + status + ')"> <h4>Load Tool Factory</h4> </a> <div id="ToolFactoryDesc"></div>';
			description = 'Load: <a onclick="BeachBall.SwitchOption(\'ToolFactory\')">' + status + ' chips</a>';
		}
		else {
			g('BBToolFactory').innerHTML = '<h4>Tool Factory Locked</h4><div id="ToolFactoryDesc"></div>';
			description = '<a onclick="BeachBall.CheckToolFactory()">Check Again!!</a>';
		}
	}
	else {
		Molpy.Notify(option + ' is not a valid option.', 1);
		error = 1;
	}
		
	if (error == 0) {g(option + 'Desc').innerHTML = '<br>' + description;}
}

BeachBall.FindRK = function() {
	/*
	RV of 1 is Sand Tools
	RV of 2 is Castle Tools
	RV of 3 is Boosts Main Page
	RV of 4 is Boosts Menus, Hill People Tech, etc.
	RV of 5 is Badges Earned, Discovery, Monuments and Glass Monuments
	RV of 6 is Badges Available
	*/
	
	//Determines RK location
	BeachBall.RKLocation = '123';
	if (Molpy.redactedVisible == 6) {
		BeachBall.RKLocation = 'badgesav';
	}
	else if (Molpy.redactedVisible > 3) {
		BeachBall.RKLocation = Molpy.redactedGr;
	}

	//Opens RK location
	BeachBall.ToggleMenus(BeachBall.RKLocation);
	
	//Resets old RK variables
	BeachBall.oldRKLocation = Molpy.redactedVisible;
	BeachBall.oldRC = Molpy.redactedClicks;
	BeachBall.oldLC = Molpy.Boosts['Logicat'].power;
}

BeachBall.MontyHaul = function() {
	
	if (BeachBall.MHAutoClickStatus == 1) {
		//If Monty Haul Problem is Unlocked
		if (Molpy.Boosts['MHP'].unlocked) {
		
			//If unpurchased, then buy
			if (!Molpy.Got('MHP')) {
				Molpy.BoostsByID[31].buy();
			}
			
			//If purchased, open Door A
			else {
			Molpy.Monty('A');
			}
		}
	}
}

BeachBall.Ninja = function() {
    if (Molpy.ninjad == 0) {
        if (Molpy.npbONG != 0) {
            BeachBall.incoming_ONG = 0;
            if (BeachBall.BeachAutoClickStatus > 0) {
				BeachBall.ClickBeach(1);
				Molpy.Notify('Ninja Auto Click', 1);
			}
        }
	}
    else if (BeachBall.Time_to_ONG <= 15) {
        if (BeachBall.incoming_ONG == 0 && (BeachBall.AudioAlertsStatus == 3 || BeachBall.AudioAlertsStatus == 4)) {
			BeachBall.audio_Chime.play();
			BeachBall.incoming_ONG = 1;
        }  
    }
}

BeachBall.PlayRKAlert = function() {
	//If proper mNP and hasn't yet played this mNP (can happen if refresh Rate < mNP length)
	if (Math.floor(BeachBall.RKTimer % BeachBall.RKAlertFrequency) == 0 && BeachBall.RKPlayAudio == 1) {
		BeachBall.audio_Bell.play();
		BeachBall.RKPlayAudio = 0;
	}
	//Otherwise reset played this mNP
	else {
		BeachBall.RKPlayAudio = 1;
	}
}

BeachBall.RedundaKitty = function() {
	var content = '';
	//Refresh Timer Variable
	BeachBall.RKTimer = Molpy.redactedToggle - Molpy.redactedCountup;
	
	//If a RedundaKitty is active
	if (Molpy.redactedVisible > 0) {
	
		//Checks if RK is new
		if (BeachBall.RKNew == 1 || Molpy.redactedVisible != BeachBall.oldRKLocation || Molpy.redactedClicks > BeachBall.oldRC || Molpy.Boosts['Logicat'].power != BeachBall.oldLC) {
			BeachBall.RKNewAudio = 1;
			BeachBall.RKNew = 0;
			//Finds RK if AutoClick Enabled
			if (BeachBall.RKAutoClickStatus > 0) {	
				BeachBall.FindRK();
			}
		}
		
		//Determines if it is an RK or LC
		//If RK is visible
		if ($('#redacteditem').length) {
			$('#redacteditem').css("border","2px solid red"); //Highlights RK
			content = $('#redacteditem').html();
			//If RK contains word statement, it is a LC.
			if (content.indexOf("statement") !== -1) {
				BeachBall.Logicat = 1;
			}
			//Otherwise it is an RK
			else {
				BeachBall.Logicat = 0;
				start = content.indexOf("Show");
				if (start != -1) {
					content = content.substring(start+15,start+38);
					content = content.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
					len = content.length;
					BeachBall.RKLevel = content.substring(18,len);
					//Molpy.Notify('RedundaKitty Level is: ' + RKLevel, 1);
				}
				else {
					start = content.indexOf("iframe src=");
					content = content.substring(start-40,start-16);
					content = content.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
					len = content.length;
					BeachBall.RKLevel = content.substring(18,len);
					//Molpy.Notify('YT RedundaKitty Level is: ' + RKLevel, 1);
				}
			}
		}
		//If RK not visible, LC to 99.
		else {
			BeachBall.Logicat = 99;
		}

		//Clicks RK if AutoClick Enabled
		if (BeachBall.RKAutoClickStatus == 2 && BeachBall.Logicat == 0 ) {
			if (BeachBall.RKLevel > 9) {
				BeachBall.RKLevel = 7;
			}
			Molpy.ClickRedacted(BeachBall.RKLevel);
			//Molpy.Notify('Level: ' + BeachBall.RKLevel, 1);
			BeachBall.RKNew = 1;
			BeachBall.RKLocation = '123';
			BeachBall.ToggleMenus('123');
		}
		//Solves LC if AutoClick enabled
		else if (BeachBall.Logicat == 1 && BeachBall.LCSolverStatus == 1) {
			BeachBall.SolveLogicat();
			//Molpy.Notify('LC Clicked in ' + BeachBall.RKLocation + '.', 1);
			BeachBall.RKNew = 1;
			BeachBall.RKLocation = '123';
			BeachBall.ToggleMenus('123');
		}

		//Redundakitty Notifications for Manual Clicking (Title Bar, Audio)
		else {	
			document.title = "! kitten !";
			//If RK Audio Alerts Enabled
			if ((BeachBall.AudioAlertsStatus == 1 || BeachBall.AudioAlertsStatus == 4) && BeachBall.Logicat == 0) {
				BeachBall.PlayRKAlert();
			}	
			else if ((BeachBall.AudioAlertsStatus == 2 || BeachBall.AudioAlertsStatus == 4) && BeachBall.Logicat == 1) {
				BeachBall.PlayRKAlert();
			}
		}
	}	
	//If no RK active, update title Timer. Reset some variables.
	else {
		document.title = BeachBall.RKTimer;
		BeachBall.oldRKLocation = -1;
		BeachBall.RKNew = 1;
		BeachBall.RKPlayAudio = 0;
	}
}

BeachBall.SolveLogicat = function() {
	var i = 65;
	var LCSolution = 'A';
	do 
		{LCSolution = String.fromCharCode(i);
		i++;}
	while (Molpy.redactedPuzzleTarget != Molpy.redactedSGen.StatementValue(LCSolution));
	Molpy.ClickRedactedPuzzle(LCSolution);
}

BeachBall.SwitchOption = function(option) {
	var status = 99;
	switch (option) {
		case 'RKAutoClick':
			BeachBall.RKAutoClickStatus++;
			if (BeachBall.RKAutoClickStatus > 2) {BeachBall.RKAutoClickStatus = 0;}
			status = BeachBall.RKAutoClickStatus;
			//When AutoClick turned on, checks to make sure that Logicat solver is turned on. If not, it turns it on.
			if (status == 2) {
				if (BeachBall.LCSolverStatus == 0) {
					BeachBall.LCSolverStatus = 1;
					BeachBall.DisplayDescription('LCSolver', BeachBall.LCSolverStatus);
				}
			}
			break;
		case 'CagedAutoClick':
			BeachBall.CagedAutoClickStatus++;
			if (BeachBall.CagedAutoClickStatus > 1) {BeachBall.CagedAutoClickStatus = 0;}
			status = BeachBall.CagedAutoClickStatus;
			//When AutoClick turned on, checks to make sure that Logicat solver is turned on. If not, it turns it on.
			if (status == 1) {
				if (BeachBall.LCSolverStatus == 0) {
					BeachBall.LCSolverStatus = 1;
					BeachBall.DisplayDescription('LCSolver', BeachBall.LCSolverStatus);
				}
			}
			break;
			
		case 'LCSolver':
			if (BeachBall.CagedAutoClickStatus == 0) {
				BeachBall.LCSolverStatus++;
				if (BeachBall.LCSolverStatus > 1) {BeachBall.LCSolverStatus = 0;}
				status = BeachBall.LCSolverStatus;
			}
			else {
				status = 1;
				Molpy.Notify('Logicat solver must stay on while Logicat AutoClicker enabled', 0);
			}
			break;
			
		case 'BeachAutoClick':
			BeachBall.BeachAutoClickStatus++;
			if (BeachBall.BeachAutoClickStatus > 2) {BeachBall.BeachAutoClickStatus = 0;}
			status = BeachBall.BeachAutoClickStatus;
			break;
			
		case 'BeachAutoClickRate':
			var newRate = parseInt(prompt('Please enter your desired clicking rate per second (1 - 20):', BeachBall.BeachAutoClickCPS));
			if (newRate < 1 || newRate > 20 || isNaN(newRate)){
				Molpy.Notify('Invalid Clicking Rate', 1);
			}
			else {
				BeachBall.BeachAutoClickCPS = newRate;
			}
			option = 'BeachAutoClick';
			status = 2;
			break;
			
		case 'AudioAlerts':
			BeachBall.AudioAlertsStatus++;
			if (BeachBall.AudioAlertsStatus > 4) {BeachBall.AudioAlertsStatus = 0;}
			status = BeachBall.AudioAlertsStatus;
			break;
			
		case 'RefreshRate':
			var newRate = parseInt(prompt('Please enter your desired BeachBall refresh rate in milliseconds (500 - 3600):', BeachBall.refreshRate));
			if (newRate < 500 || newRate > 3600 || isNaN(newRate)){
				Molpy.Notify('Invalid Refresh Rate', 1);
			}
			else {
				BeachBall.refreshRate = newRate;
			}
			break;
			
		case 'MHAutoClick':
			BeachBall.MHAutoClickStatus++;
			if (BeachBall.MHAutoClickStatus > 1) {BeachBall.MHAutoClickStatus = 0;}
			status = BeachBall.MHAutoClickStatus;
			break;
			
		case 'ToolFactory':
			var newRate = parseInt(prompt('Tool Factory Loading:', BeachBall.toolFactory));
			if (isNaN(newRate)){
				Molpy.Notify('Invalid Tool Factory Loading', 1);
				status = BeachBall.toolFactory;
			}
			else {
				BeachBall.toolFactory = newRate;
				status = newRate;
			}
			break;
	}
	BeachBall.DisplayDescription(option, status);
}

BeachBall.ToggleMenus = function(wantOpen) {
	//for (var i in BeachBall.lootBoxes) {
	//var me = BeachBall.lootBoxes[i];
	for (i=0, len = BeachBall.lootBoxes.length; i < len; i++) {
		//If the current Box should be open
		if (BeachBall.lootBoxes[i] == wantOpen) {
			//If it isn't opened, open it.
			if (!Molpy.activeLayout.lootVis[BeachBall.lootBoxes[i]]) {
				Molpy.ShowhideToggle(BeachBall.lootBoxes[i]);
			}
		}
		//If the current Box should be closed
		else {
			//If it is open, then close it
			if (Molpy.activeLayout.lootVis[BeachBall.lootBoxes[i]]) {
				Molpy.ShowhideToggle(BeachBall.lootBoxes[i]);
			}
		}
	}
}

BeachBall.CheckToolFactory = function() {
	if (Molpy.Got('Tool Factory')) {
		BeachBall.DisplayDescription('ToolFactory', BeachBall.toolFactory);
		Molpy.Notify('Tool Factory Option Now Available!', 1);
	}
	else {
		Molpy.Notify('Tool Factory is still unavailable... keep playing!', 1);
	}
}

//Beach Ball Startup
//Set Settings
if (Molpy.Got('Kitnip') == 1){BeachBall.RKAlertFrequency = 10;}

//Create Menu
$('#optionsItems').append('<div id="BeachBall"></div>');
$('#BeachBall').append('<br> <div class="minifloatbox"> <h3 style="font-size:150%; color:red">BeachBall Settings</h3> <h4 style"font-size:75%">v ' + BeachBall.version + '</div> <br>');
$('#BeachBall').append('<div class="minifloatbox"> <a onclick="BeachBall.SwitchOption(\'RKAutoClick\')"> <h4>Redundakitty Auto Click</h4> </a> <div id="RKAutoClickDesc"></div></div>');
$('#BeachBall').append('<div class="minifloatbox"> <a onclick="BeachBall.SwitchOption(\'CagedAutoClick\')"> <h4>Caged Logicat Auto Click</h4> </a> <div id="CagedAutoClickDesc"></div></div>');
$('#BeachBall').append('<div class="minifloatbox"> <a onclick="BeachBall.SwitchOption(\'LCSolver\')"> <h4>Logicat Solver</h4> </a> <div id="LCSolverDesc"></div></div>');
$('#BeachBall').append('<div class="minifloatbox"> <a onclick="BeachBall.SwitchOption(\'BeachAutoClick\')"> <h4>Beach Auto Click</h4> </a> <div id="BeachAutoClickDesc"></div></div>');
$('#BeachBall').append('<div class="minifloatbox"> <a onclick="BeachBall.SwitchOption(\'AudioAlerts\')"> <h4>Audio Alerts</h4> </a> <div id="AudioAlertsDesc"></div></div>');
$('#BeachBall').append('<div class="minifloatbox"> <a onclick="BeachBall.SwitchOption(\'RefreshRate\')"> <h4>Refresh Rate</h4> </a> <div id="RefreshRateDesc"></div></div>');
$('#BeachBall').append('<div class="minifloatbox" id="BBToolFactory"> <a onclick="Molpy.LoadToolFactory(' + BeachBall.toolFactory + ')"> <h4>Load Tool Factory</h4> </a> <div id="ToolFactoryDesc"></div></div>');
$('#BeachBall').append('<div class="minifloatbox" id="BBMontyHaul"> <a onclick="BeachBall.SwitchOption(\'MHAutoClick\')"> <h4>Monty Haul AutoClick</h4> </a> <div id="MHAutoClickDesc"></div></div>');
//$('#BeachBall').append('<div class="minifloatbox"> <a onclick="BeachBall.SpawnRK()"> <h4>Spawn RK</h4> </a></div>');
//$('#BeachBall').append('<div class="minifloatbox"> <a onclick="BeachBall.SpawnRift()"> <h4>Spawn Rift</h4> </a></div>');
//$('#BeachBall').append('<div class="minifloatbox"> <a onclick="BeachBall.ToggleMenus(\'ninj\')"> <h4>Open Ninja Tab</h4> </a></div>');
BeachBall.DisplayDescription('RKAutoClick', BeachBall.RKAutoClickStatus);
BeachBall.DisplayDescription('CagedAutoClick', BeachBall.CagedAutoClickStatus);
BeachBall.DisplayDescription('LCSolver', BeachBall.LCSolverStatus);
BeachBall.DisplayDescription('BeachAutoClick', BeachBall.BeachAutoClickStatus);
BeachBall.DisplayDescription('AudioAlerts', BeachBall.AudioAlertsStatus);
BeachBall.DisplayDescription('RefreshRate', BeachBall.refreshRate);
BeachBall.DisplayDescription('MHAutoClick', BeachBall.MHAutoClickStatus);
BeachBall.DisplayDescription('ToolFactory', BeachBall.toolFactory);

//Developer Functions
BeachBall.SpawnRK = function() {
	Molpy.redactedCountup = Molpy.redactedToggle;
}

BeachBall.SpawnRift = function() {
	Molpy.GiveTempBoost('Temporal Rift', 1, 5);;
}

BeachBall.Temp = function() {
	Molpy.redactedCountup = 0;
}

//Main Program and Loop
function BeachBallMainProgram() {
	//Molpy.Notify(BeachBall.refreshRate, 0);
	BeachBall.Time_to_ONG = Molpy.NPlength - Molpy.ONGelapsed/1000;
	BeachBall.RedundaKitty();
	BeachBall.CagedAutoClick();
	BeachBall.BeachAutoClick();
	BeachBall.Ninja();
	BeachBall.MontyHaul();
	BeachBallLoop();
}

function BeachBallLoop() {
	BeachBall.Timeout = setTimeout(BeachBallMainProgram, BeachBall.refreshRate);
}

//Program Startup
BeachBallLoop();
Molpy.Notify('BeachBall version ' + BeachBall.version + ' loaded for SandCastle Builder version ' + BeachBall.SCBversion, 1);