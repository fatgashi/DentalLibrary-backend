# DentalLibrary-backend
@Authors : Fatjon Gashi.

##Project setup

add an 'uploads' folder at the root of the project 

add a .env file at the root of the project with some properties like:
'PORT' the port to run the server
'JWT_SECRET' for passport token 
'MONGO_URL' the database of mongodb 
'STRIPE_PRIVATE_KEY' the stripe key for payment
'CLIENT_URL' the client url for direction after a successful or failed transaction
'ENDPOINT_SECRET' stripe key for using webhooks


npm install at the root of the project

## Start Project

pm2 start ecosystem.config.js