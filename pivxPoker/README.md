# INSTALLATION
download PIVX core wallet (https://github.com/PIVX-Project/PIVX/releases)
Install pivx core wallet by untar/unzipping the file and running the install-params file
run `/bin/pivxd -daemon`
(set up a restarting instance with systemd https://docs.pivx.org/wallets/pivx-core-wallet/pivx-as-a-service-linux)
create a file in ~/.pivx/pivx.conf   
**PLEASE CHANGE THE RPCUSER AND PASSWORD ON YOUR VERSION IT ALSO NEEDS TO BE CHANGE IN THE .ENV FILE**

```                               
zmqpubrawtx=tcp://127.0.0.1:28332
walletnotify
rpcuser=root
rpcpassword=password
rpcallowip=127.0.0.1
server=1
daemon=1
maxconnections=256
par=1
rpcbind=127.0.0.1
rpcport=51475
rpcclienttimeout=30
rpcthreads=5
rpcworkqueue=1000
paytxfee=.01
staking=0
enableaccounts=1
```
https://www.mongodb.com/docs/manual/administration/install-on-linux/

install nodejs (19 recommended)
https://github.com/nodesource/distributions/blob/master/README.md
Node lts also works (v 20.11 at the time of writing the frontend may require 19 depending on your os) 
Node latest is not working at the time of writing (21.x)

```
sudo apt-get install build-essential
sudo apt install node-pre-gyp 
```
`npm i` 
**If you have issues purge the package-lock and any node_modules you have and try again**
**If you still have issues try:**
`sudo apt-get install libzmq3-dev`

switching node versions OSes or anything else can cause a number of issues with node-gyp building
nodejs 19 with node-gyp compiles on debian. Each OS and version of node could have different issues and at the moment I don't have the time to support every platform

Once your pivx Daemon syncs restart it so that it is using the settings from the config file

.env file:
```
APP_URL=
MODE=
WALLET_URL=
WALLET_PORT=
WALLET_USER=
WALLET_PASSWORD=
JWT_SECRET=
DISCORD_WEBHOOK_NEWGAME=
DNS_APP_URL=
```

The Discord Webhook env format is `ID:TOKEN`, for example (with a fake ID:Token pair):
`DISCORD_WEBHOOK_NEWGAME=9127598635710559730:0OduM5blLjRS309zzz4pQhINBFhTd-16VDzqrUS5JlqHth7cWRI5Q7uvyCzApXzhT47Y`

If omitted, the Discord Webhook will simply be disabled.

To properly link to the new game you also need to set the DNS_APP_URL to the correct base dns for your website

---

remember when using a reverse proxy to enable websockets for example with nginx:
```
      # WebSocket support
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
```

I recommend the latest version of node v20.x at the time of writing

The only vulnerabilities left do not effect anything for the time being and will be fixed later

# Running it
## development
` npm run dev `
or
` node index.js `
## production
` npm run build `


Tests are handled with jest and all code is under the /test/ folder

**The uploads folder needs to include an avatars file otherwise avatars will not work and it won't give you a good error to understand why they aren't working.**

Database is mongoose and all the model files are stored /models/

The utils file is a little under utilized but includes a bunch of files that can be helpful and sometimes get included in other areas of the site.

The /configs/ file contains only Rakes at this point in an array of objects which connects the blinds to the rakes for a match

When creating a new frontend you need to put the build file from the frontend into this the pivxPoker file, that is what the server serves to the user

For hooking up the discord notifications you need to set the DISCORD_WEBHOOK_NEWGAME with the webhook