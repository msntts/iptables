iptables WEB gui

![ScreenShot](http://i.mcgl.ru/RGGJv4MAvA)

### Howto install ###

In first time you need to Download and install Node.js

### Howto use ###
* Install PAM libraries

  - Centos and RHEL
    ```sh
    yum install pam-devel
    ```
  - Debian/Ubuntu
    ```sh
    apt-get install libpam0g-dev
    ```
  - debian6/maverick/natty
    ```sh
    apt-get install libreadline5-dev
    ```
  - oneiric (and any newer, eg. Debian 7 or Ubuntu 12.04)
    ```sh
    apt-get install libreadline-gplv2-dev
    ```

* Clone repository:
```bash
git clone https://github.com/puux/iptables.git
```
* Run server:
```bash
cd iptables
# only for first time you, need to download dependancies
npm install
# and then you can start the server
node server.js
```
* Open browser and goto http://127.0.0.1:1337/

### Howto create own theme ###

* cd ./tpl/styles/
* open and change config.scss
* compile: scss --sourcemap=none style.scss ../theme/MyTheme.css
* select theme in Settings->Theme

### Default user and password ###

User: admin
Pass: (empty)

You can change this here https://github.com/puux/iptables/blob/master/handlers.js#L14
