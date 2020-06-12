# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

This is the main URLs page a logged in user might see. Only the urls created by the current logged in user are visible. User can see the shortURL, longURL, date created, number of visits, number of unique visitors and can click to edit or delete the url.
!["Screenshot of URLs page"](https://github.com/sophdubs/tinyapp/blob/master/docs/urls-page.png?raw=true)

This is the page a user will see when editing an existing tiny URL. The page displays the longURL, shortURL, date created, number of visits, number of unique visitors and a link to a detailed analytics page. It also has a form to edit the longURL associated with the tinyURL.
!["Screenshot of new URL form"](https://github.com/sophdubs/tinyapp/blob/master/docs/edit-page.png?raw=true)

This is the detailed analytics page. It shows the tinyURL creator the username and date for everytime the tinyURL was used. 
!["Screenshot of Login form"](https://github.com/sophdubs/tinyapp/blob/master/docs/analytics-page.png?raw=true)

This is the login form a user might see when they visit the login page. It is very similar to the register page.
!["Screenshot of Login form"](https://github.com/sophdubs/tinyapp/blob/master/docs/login-page.png?raw=true)


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- method-override

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Project Stack
- Web Server: Node JS
- Middleware: Express
- Template Engine: EJS
- Database: In memory object

## Customizations
- This project required us to build an Express server and handle HTTP requests according to RESTful conventions. For this, I had to use method-override to be able to use the PUT and DELETE routes. 
- I was able to ensure user security by hashing the passwords before storing them in the user database as well as encrypting the cookies.
- I decided to organise my project directory according to MVC conventions:
  - All data can be found in the models directory
  - All views can be found in the views directory
  - The controller is the express_server file
  - All helper functions have been factored out to their own file and fully tested. 
- I created a custom middleware, ensureCredentialsPresent, to handle incomming POST '/login' and POST '/register' requests. This middleware ensures the user filled out both the email and password fields before logging in or registering. If they have not, a page explaining the missing credentials is rendered. 
- I also played around with the style to keep the colors and forms more consistent. 
- I made a few additional views (not required by the project specs) to display error messages and analytics details.


## Known Issues
- All data is stored in a local object. Therefore, data is non-persistant. Every time the server is restarted, all users, urls and associated analytics is wiped clean. 
- When running the program from my vagrant machine, the time stamp seems to be off by a few hours. When running on my local machine, this issue is not present. 