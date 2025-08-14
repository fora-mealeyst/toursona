# Project Requirements:

## Quiz Admin:
* Create an admin user interface that allows for the creation of a new travel quiz
  * Quiz can be broken up into steps with one or more HTML form elements on a given step
* Update an existing quiz based on a quiz id
* Delete a quiz
* Shows the list of existing travel quizes

## Quiz Viewer:
* Create a client facing page where a user can interact with a quiz based on the form that was built in the quiz admin given a specific ID.

## Server:
* Utilizes Express
* POST API endpoint to create a quiz that accepts an object that describes a form that will then be rendered out when a user visits the quiz viewer.
  * The data for the quiz should be stored in MongoDB
* GET API endpoint to fetch the result of a given quiz given a unique identifier
  * Data for the quiz should be fetched from the MongoDB quiz 
* DELETE API endpoint that removes the quiz configuration data from Mongo.
* PATCH API endpoint that allows for a partial update of an existing quiz
