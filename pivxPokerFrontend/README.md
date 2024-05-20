## Notes

Updated so that the system can run on nodejs v20

The only remaining vulnerablities are build based issue and will not make it into the build files. More info https://github.com/facebook/create-react-app/issues/11174

```
npm audit --production 
```

Need to enable legacy openSSL support

export NODE_OPTIONS=--openssl-legacy-provider

^ This depends on what node version you are using and hopefully we will just fix this fully soon

change urls at /src/shared/apiConfig.js
^ This is where the hardcoded files are stored, there are a few other things that are hardcoded that can be changed and as I have time I will document more
but this is the only immediate issue.

The general set up is that you have this build all the web files `npm run build` then move that build file to the main pivxPoker folder. Everything here is a self
contained react code. The general setup of how this is layed out is as follows
The App.js is the "base" for everything else, most everything else you will be working with will be in the /Pages/ file this is where the majority of the frontend code
will be, or at the very least this is where you will find where to start 95% of the time.

The /Pages/ folder includes folders that are for each of the diffrent groups, and they are relativly self explanitory. /Games/ contains all of the game pages this is where you would be sitting at the actual table.

/HomePage/ is the folder that includes code for the page that has the "create account" "log in" "guest" buttons

/LobbyPage/ contains a large amount of code and mushes a lot of the pages together that aren't "sitting" and playing the game. This is the page that shows the "details" pages for most things. This would be where you would go to change files that are under the /lobby/ slug. In the LobbyPage there is a /Modals/ file that includes a lot of the Modals for things like Profiles, affiliate, deposit, etc. Its a good place to look if you can't find what you are looking for.

The /LoginPage/ and /RegisterPage/ are pretty self explainitory outside of the typo.

The /shared/ file contains a bunch of settings that can be useful, the main one to focus on would be the apiConfig.js which if you don't put the right info in to will cause the system to not work.

/store/ contains a number of systems that are included across the website

/StyledComponenets/ is a similar situation
