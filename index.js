#!/usr/bin/env node
'use strict';
var chalk       = require('chalk');
var clear       = require('clear');
var CLI         = require('clui');
var figlet      = require('figlet');
var inquirer    = require('inquirer');
var vorpal 		= require('vorpal')(), username = "";


var files 		= require('../bc-18-quizapplication-console/files.js');
var qz 			= require('../bc-18-quizapplication-console/quizzes.js');
var usr 		= require('../bc-18-quizapplication-console/users.js');
var oq	 		= require('../bc-18-quizapplication-console/onlinequizzes.js');

var showVorpal = function()
{
	vorpal.show();
}
var tkQuiz = function(quizName,username)
{
	var q = new qz.Quizzes();
	var rp = q.takeQuiz(quizName, username, showVorpal);
	return rp;
}

var importQuiz = function(quizPath)
{
	var q = new qz.Quizzes();
	var rp = q.importToLib(quizPath,false);
	return rp;
}
/*var obj = files.getObjectFromFile("quizzes.json");
console.log(obj[0].name);
var q = new qz.Quizzes();
q.takeQuiz("physics");*/
var listQuizzes = function()
{
	var q = new qz.Quizzes();
	return q.getQuizzes();
}
var getUsername = function(username)
{
	var user = new usr.User(username);
	var chk = user.checkUserExist();
	if (chk)
	{
		return "\t\tWelcome back " + username;
	}
	else
	{
		var success = user.createUser();
		if (success)
		{
			return "\t\tSeems you are a new user, we have created an account for you.";
		}
		else
		{
			return "\t\tUser account cannot be created at this time, try again later";
		}
	}
}

clear();
console.log(
  chalk.yellow(
    figlet.textSync('--A-QUIZ--', { horizontalLayout: 'full' })
  )
);
console.log(
	chalk.green("\t\t\tWelcome to Andela Quiz!\n \t\tEnter help to see a list of command to assist you."))
vorpal
    .delimiter('a-quiz$')
    .show();
vorpal
      .command('user [name]', 'get yoor username')
      .action(function(args, callback) {
      	if(args.name === undefined)
      	{
      		this.log("\t\tYou need to enter a username with that command.");
      		vorpal.execSync('help');
      	}
      	else
      	{
      		username = args.name;
        	this.log(getUsername(username));
    	}
        callback();
      });
vorpal
      .command('takequiz [quizname]', 'take a quiz')
      .action(function(args, callback) {
      	if (args.quizname !== undefined)
      	{
      		if (username !== "") 
  			{
  				vorpal.hide();
  				if (tkQuiz(args.quizname,username) !== false)
  				{
	      			//this.log(report);
	      			//vorpal.show();
	      		}
	      		else
	      		{
	      			this.log("\t\tYou need to enter a quiz name from the list of quizzes in the local storage.");
	      			vorpal.execSync('listquizzes');
	      			vorpal.show();
	      		}
  			}
  			else
  			{
  				this.log("\t\tYou need to enter your username before you can take a quiz.");
  			}
      	}
      	else
      	{
      		this.log("\t\tYou need to enter a quiz name with the command.");
      		vorpal.execSync('help');
      	}
        callback();
      });
vorpal
      .command('listquizzes', 'list the quizzes available in local storage')
      .action(function(args, callback) {
      	this.log(listQuizzes());
        callback();
      });
vorpal
      .command('importquiz [filepath]', 'Import a quiz into the local storage.')
      .action(function(args, callback) {
      	if (args.filepath !== undefined)
      	{
      		if(importQuiz(args.filepath))
      		{
      			this.log("\t\tQuiz has been successfully imported.");
      		}
      		else
      		{
      			this.log("\t\tInvalid file path or unsupported format.");
      		}
      	}
      	else
      	{
      		this.log("\t\tYou need to enter a file path.");
      		vorpal.execSync('help');
      	}
        callback();
      });
vorpal
      .command('listquizzes online', 'list the quizzes available online')
      .action(function(args, callback) {
      	var list = oq.getQuizzes();
      	if (list === false)
      	{
      		this.log("\n\t\t\t Unable to retrieve quizzes! \n");
      	}
      	else
      	{
      		this.log(list);
      	}
        callback();
      });
vorpal
      .command('uploadquiz [quizName]', 'Upload selected quiz from local storage to online repo.')
      .action(function(args, callback) {
      	if (args.quizName !== undefined)
      	{
      		if(oq.uploadQuiz(args.quizName))
      		{
      			this.log("\t\tQuiz has been successfully uploaded.\n");
      		}
      		else
      		{
      			this.log("\t\tQuiz not found or already existed online.");
      		}
      	}
      	else
      	{
      		this.log("\t\tYou need to enter a quiz name.");
      		vorpal.execSync('help');
      	}
        callback();
      });
vorpal
      .command('downloadquiz [quizName]', 'Download selected quiz from oniine repo to local storage.')
      .action(function(args, callback) {
      	if (args.quizName !== undefined)
      	{
      		if(oq.downloadQuiz(args.quizName))
      		{
      			this.log("\t\tQuiz has been successfully downloaded.\n");
      		}
      		else
      		{
      			this.log("\t\tQuiz not found or already existed in local storage.");
      		}
      	}
      	else
      	{
      		this.log("\t\tYou need to enter a quiz name.");
      		vorpal.execSync('help');
      	}
        callback();
      });
