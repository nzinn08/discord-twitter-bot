require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();
const Twit = require('twit')

const PORT = process.env.PORT || 3000;

var T = new Twit({
   consumer_key:         process.env.TWITTER_CONSUMER_KEY,
   consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
   access_token:         process.env.TWITTER_ACCESS_TOKEN,
   access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
   timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
   strictSSL:            true,     // optional - requires SSL certificates to be valid.
 })

const insultList = ["Hey fuck you ", 
                    "You smell like absolute shit ",
                    "You look like a cum-stained-fart-shit ",
                    "Doesn't nobody like you ",
                    "Nice cock ",
                    "You look like the dog shit on the bottom of my shoe ",
                    "You look like David ",
                    "Shut the fuck up you cum-wrenching mug-spout ",
                    "I genuinely fucking hate you ",
                    "You're pretty cool ",
                    "You're a poor little peasant to me ",
                    "I'm just a bot but I still have more brain cells than you in just a microbe in my left nut ",
                    "You look like you take destroy-your-dick December seriously ",
                    "If you were anymore inbred, you'd be a sandwich ",
                    "Who asked ",
                    ]

const twitterSearchString = 'restock';

client.on('ready', () => {
   console.log(`Logged in as ${client.user.tag}!`);

   // Start the twitter stream to watch for tweets
   var stream = T.stream('statuses/filter', { follow: [process.env.TWITTER_USER_ID], track: [twitterSearchString] })
   stream.on('tweet', async (tweet) => {
      // Create the content of the message
      // Only post in discord if this is a tweet from the actual user
      const text = tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text;
      if (text.toLowerCase().search(twitterSearchString) != -1)
      {
         if (tweet.user.id_str == process.env.TWITTER_USER_ID)
         {
               var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
               try {
                  let botChannel = await client.channels.fetch(process.env.DISCORD_GRAPHICS_CHANNEL_ID);
                  botChannel.send(url);
               } catch (error) {
                  console.error(error);
               }
         }
      }
   });

   // Start the insult bot
   setTimeout(theBestFunc, 5000);
});

// This handles insulting ppl :)
const theBestFunc = async () => {
   // Get a random chosen user from the server
   let guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
   let memberList = await guild.members.fetch();
   let chosenUser = client.user;
   while(chosenUser.id == client.user.id)
   {
      chosenUser = memberList.array()[Math.floor(Math.random() * memberList.array().length)].user;
   }

   // Choose a random insult from the list
   let chosenInsult = insultList[Math.floor(Math.random() * insultList.length)]
   
   // Send the random insult to the random user in the bot channel
   let botChannel = await client.channels.fetch(process.env.DISCORD_INSULT_CHANNEL_ID);
   botChannel.send(chosenInsult + chosenUser.toString() );

   // Redo this all again in minTime to maxTime
   const minTime = 30;
   const maxTime = 90;
   const timeMultiplier = 1000 * 60;
   let timeToWait = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
   console.log("Waiting " + timeToWait + " minutes.");
   setTimeout(theBestFunc, timeToWait * timeMultiplier);
};

// Just to test if alive
client.on('message', msg => {
   if (msg.content === 'ping') {
      msg.reply('Pong!');
   }
});

client.login(process.env.DISCORD_TOKEN);