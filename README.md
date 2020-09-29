# MailerLite Task

>Your main task is to create an HTTP API backend service for managing two resources and their relations: subscribers and fields... Also we ask you to provide a tiny UI that is a client of your created API for managing described resources.

# Requirements

* When creating a subscriber email must be in valid format and host domain must be active
No frameworks/microframeworks but you can use helper packages like dependency injection, Symfony\Request, Illuminate\Http\Request etc. (But not complete solutions like Eloquent/Doctrine)
* HTTP JSON API
* MySQL
* Use of relationships
* Validate request before calling the controller
* Instructions how to run a project on local environment
* PSR-12 compliant source code
* Optional: Redis for caching
* Optional: Write some tests

# Installation

You have to navigate to the desired folder in your operating system and execute the following command in the CLI:

```
git clone git@github.com:avkrastev/mailerlite.git mailerlite
```

This will clone the project in the folder /mailerlite. Then you need to navigate into the newly created folder and execute the commands that will download the additional packages:

```
cd mailerlite/
composer install

cd ui/
npm install
```
This will take a while...

## Database setup

After the downloading of the packages we should setup the database. The DDL file is in `mailerlite/staging/db/mailerlite.sql`.
You can execute them directly in the workbench (I use HeidiSQL) or you can run them in the CLI:

```
mysql -u USERNAME -p -h IP_ADDRESS
```
You will be prompted to enter the password for the MySQL service. Then you need to create new database and pass the .sql file.

```
CREATE DATABASE mailerlite;
USE mailerlite;
SET autocommit=0; source mailerlite.sql; COMMIT;
```
In the `source` you need to specify the path to the .sql file on your OS. In my case this was: `/mnt/d/Projects/mailerlite/staging/db/mailerlite.sql`.

Then we need to create the `.env` file within the project. You can copy the `.env.example`, modify it to your configuration and save it as `.env`.

## HTTP API setup

You need to create a new entry for then new virtual host.

### Linux
On Linux you need to navigate to `cd /etc/apache2/sites-available/`. Then in my case I have `projects.conf`. There we need to add the following configuration:

### Windows 
On Windows, first we need to tell Apache2 that we will use virtual hosts. In the `\Apache2\conf\httpd.conf` you need to uncomment the following line: 
```
Include conf/extra/httpd-vhosts.conf
```
Then, you shoul navigate to `\Apache2\conf\extra\httpd-vhosts.conf` and the the following configuration:

```
<VirtualHost *:80>
    DocumentRoot "/mnt/d/Projects/mailerlite/public"
    ServerName mailerlite.me
    <Directory "/mnt/d/Projects/mailerlite/">
       AllowOverride All
    </Directory>
    Options -Indexes
</VirtualHost>
```
*This configuration is the same for Linux & Windows.

After the configuration is completed we need to map the `ServerName mailerlite.me` to actual server. So, we need to navigate to the `hosts` file and add it.

For Linux: `nano /etc/hosts`

For Windows: Open Notepad as Administrator and navigate to `C:\Windows\System32\drivers\etc`.

The following line must be added: `127.0.0.1	mailerlite.me`

With these changes added we need to restart/reload the Apache service:

For Linux: `service apache2 reload`

For Windows: Navigate to Services and search for the Apache2 service. Click on it with the right mouse button and choose Restart.

## React UI

Navigate to the ui folder inside the project `cd /mailerlite/ui` and run `npm start`.

You should now see the empty table of subscribers.

# Libraries

### Backend

* [Symfony Dotenv](https://github.com/symfony/dotenv)
* [pecee/simple-router](https://packagist.org/packages/pecee/simple-router)
* [php-di](https://github.com/PHP-DI/PHP-DI)

### Frontend

* [React](https://github.com/facebook/react) 
* [React-dom](https://www.npmjs.com/package/react-dom) 
* [React-router](https://www.npmjs.com/package/react-router) 
* [React-router-dom](https://www.npmjs.com/package/react-router-dom)
* [React-scripts](https://www.npmjs.com/package/react-scripts)
* [React-modal](https://www.npmjs.com/package/react-modal)
* [Bootstrap](https://www.npmjs.com/package/bootstrap) 
* [Fontawesome](https://www.npmjs.com/package/@fortawesome/fontawesome-svg-core) 



 
