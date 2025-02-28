# Team
 
Team Lead: Harshit Khattar<br/>
Team Member: Harshil Patel
 
# Project Goal
 
Develop a web-based tool that helps people create and organize their work in one place. It will have pages, flowcharts, and include to-do lists or planners. We will also add a feature using an LLM API (either chatgpt or gemini) so users can quickly find and retrieve information from their saved pages. We aim to develop this using the MERN stack.
 
# User Stories
 
1. As a new user, I want to sign up so that I can create and store my own pages.
 
2. As a registered user, I want to log in quickly so that I can access my stored work.
 
3. As a user, I want to create pages for notes, tasks, and plans so that I can organize and manage my ideas in one place.
    
4. As a user, I want to search and retrieve information using LLM (Chatgpt or Gemini API) so that I can find relevant content fast.
 
5. As a user, I want to able to share my pages with other registered users.
 
6. As an admin, I want to be able to track metrics and details related to user and website.
 
7. As a user, I want to receive email notifications so that I stay on top of my tasks and deadlines.
 
# UI design
Our user interface will be simple, clear, and easy to use. We will arrange the different pages under one main menu. We will use Figma or AdobeXD to design the UI, which will then be implemented using HTML, CSS, JavaScript, and React for a fully functional user interface.
 
# Project Requirement
 
1. Full-Stack Application
 
We are proposing a full-stack MERN application. This means we will have a front end (React) for the user interface and a back end (Node.js with Express) for handling data and logic.
 
2. Data Usage
 
Our app will let users create and manage different pages (notes, tasks and planners). We will store this data in a MongoDB database. We will also store any additional user information, such as their name and login credentials, so we can link them to their pages. This data will help us personalize each user’s experience and keep track of their tasks.
 
3. Authentication and Security
 
Yes, our app will have user authentication. We plan to use a secure login system with tokens or sessions like JWT or google auth. This way, only authorized users can access or edit their own data. We will also make sure to encrypt sensitive information.
 
4. REST API
 
We will set up a REST API using Express on the back end. This will let the front end talk to the database through clearly defined endpoints. For example, we will have routes for creating new pages, updating them, deleting them, and retrieving user data.
 
5. Web API Usage
 
Yes, we will consume the ChatGPT API or Gemini API so that users can search and retrieve information from their saved pages in a more fast way.
 
6. Technologies
 
    •   For the front-end we will use ReactJS for a responsive and interactive front end.
    •   Node.js and Express for the back end as they will help implement REST APIs and scalale application.
    •   MongoDB for storing the user data.
    •   ChatGPT / Gemini API will provide fast text search and summaries.