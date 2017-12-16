# ForgeModelLoader
This app help you load models to Autodesk Forge **buckets**.

---
To publish your own app, you need to perform the following actions:
1. Clone this repository - ```git clone https://github.com/ZFi88/ForgeModelLoader.git```
1. Go to project directory - ```cd ForgeModelLoader```
1. Build project - ```gradlew build```
1. Sign up on Heroku and install Heroku CLI
1. Sign in by Heroku CLI - ```heroku login```
1. Install Heroku CLI Deploy plugin - ```heroku plugins:install heroku-cli-deploy```
1. Create new app - ```heroku create APP_NAME --no-remote```
1. Deploy app - ```heroku deploy:jar build/libs/modelloader-1.0.jar --app APP_NAME```
