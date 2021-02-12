require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = process.env.TOKEN;
var tanks = [
  {id: "143303189670789120", userName: "Joakim"},
];

var healers = [
  {id: "142705190183632896", userName: "Henrik"},
];

var dpsers = [
  {id: "92609056048443392", userName: "DP"},
  {id: "141986304513671168", userName: "Erik"},
  {id: "142948997273878528", userName: "Einar"},
  {id: "194451910596493312", userName: "Bernie"},
  {id: "143121616031842304", userName: "Adde"},
  {id: "228557389555695617", userName: "Kristoffer"},
];

var reaction_numbers = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"]

var emojis = [
  {name: "1", text: "onsdag kväll", kväll: true},
  {name: "2", text: "torsdag kväll", kväll: true},
  {name: "3", text: "fredag efter raid", kväll: true},
  {name: "4", text: "lördag dag", kväll: false},
  {name: "5", text: "lördag kväll", kväll: true},
  {name: "6", text: "söndag dag", kväll: false},
  {name: "7", text: "söndag kväll", kväll: true},
  {name: "8", text: "måndag kväll", kväll: true},
  {name: "9", text: "tisdag kväll", kväll: true},
]

client.login(TOKEN);

client.on('ready', () => {
    sendWeekMessage(); // send the message once
    var weekMillseconds = 1000 * 60 * 60 * 24 * 7;
    setInterval(function(){ // repeat this every 24 hours
      sendWeekMessage();
    }, weekMillseconds)
})

function sendWeekMessage(){
  client.channels.find("name","mythic").send("Onsdag kväll? 1 \n Torsdag kväll? 2 \n Fredag efter raid? 3 \n Lördag dag(13-17)? 4 \n Lördag kväll(17->)? 5 \n Söndag dag(13-17)? 6 \n Söndag kväll(17->)? 7 \n Måndag kväll? 8 \n Tisdag kväll? 9")
    .then(function (message) {
      message.react(reaction_numbers[1])
        .then(() => message.react(reaction_numbers[2]))
        .then(() => message.react(reaction_numbers[3]))
        .then(() => message.react(reaction_numbers[4]))
        .then(() => message.react(reaction_numbers[5]))
        .then(() => message.react(reaction_numbers[6]))
        .then(() => message.react(reaction_numbers[7]))
        .then(() => message.react(reaction_numbers[8]))
        .then(() => message.react(reaction_numbers[9]))
    })
    .catch(function() {
      //Something
    });
}

client.on('messageReactionAdd', async (reaction, user) => {
  if(user.bot == true){
    return;
  }
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
      await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
  }
  var tankSigned = false;
  var healerSigned = false;
  var dpsersSigned = 0;
  tanks.forEach(tank => {
    if(reaction.users.get(tank.id)){
      tankSigned = true;
    }
  });
  healers.forEach(healer => {
    if(reaction.users.get(healer.id)){
      healerSigned = true;
    }
  });
  dpsers.forEach(dpser => {
    if(reaction.users.get(dpser.id)){
      dpsersSigned++;
    }
  });
  if(tankSigned && healerSigned && dpsersSigned >= 3){
    sendDayMessage(reaction.emoji.name);
  }
});

function sendDayMessage(Emoji){
  emojis.forEach(emoji => {
    if(Emoji.startsWith(emoji.name)){
      if(emoji.name === "3"){
        client.channels.find("name", "mythic").send("Tillräckligt med folk kan efter raiden på fredag");
      }
      else if(emoji.kväll) {
        client.channels.find("name", "mythic").send("Från tid på " + emoji.text + " (Räcker med en reaction)?")
        .then(function (message) {
          message.react(reaction_numbers[5])
           .then(() => message.react(reaction_numbers[6]))
           .then(() => message.react(reaction_numbers[7]))
           .then(() => message.react(reaction_numbers[8]))
           .then(() => message.react(reaction_numbers[9]));
        }).catch(function() {
          //Something
        });
      }
      else{
        client.channels.find("name", "mythic").send("Från tid på " + emoji.text + " (reagera på de hela timmar ni kan?")
        .then(function (message) {
          message.react(reaction_numbers[1])
           .then(() => message.react(reaction_numbers[2]))
           .then(() => message.react(reaction_numbers[3]))
           .then(() => message.react(reaction_numbers[4]));
        }).catch(function() {
          //Something
        });
      }
    }
  });
}