# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product
This is the URLs page a logged in user might see. Only the urls create by the current logged in user are visible.
!["Screenshot of URLs page"](https://github.com/sophdubs/tinyapp/blob/master/docs/urls-page.png?raw=true)

This is the register form a user might see. It is very similar to the login page.
!["Screenshot of Register form"](https://github.com/sophdubs/tinyapp/blob/master/docs/register.png?raw=true)

This is the form a user will see when creating a new tiny URL.
!["Screenshot of new URL form"](https://github.com/sophdubs/tinyapp/blob/master/docs/new-url.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Project Implementation Details
- This project required us to build an Express server and handle HTTP requests according to RESTful conventions. 
- I was able to ensure user security by hashing the passwords before storing them in the user database as well as encrypting the cookies.
- I decided to organise my project directory according to MVC conventions:
  - All data can be found in the models directory
  - All views can be found in the views directory
  - The controller is the express_server file
  - All helper functions have been factored out to their own file and fully tested. 
- I created a custom middleware, ensureCredentialsPresent, to handle incomming POST '/login' and POST '/register' requests. This middleware ensures the user filled out both the email and password fields before logging in or registering. If they have not, a page explaining the missing credentials is rendered. 
- I also played around with the style to keep the colors and forms more consistent. 