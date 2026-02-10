LUNEX

Lunex is a full-stack social media platform built with Django REST Framework, React.js, and PostgreSQL.
It allows users to create posts, follow others, like and comment, and interact in a modern social networking environment.

🚀 Features

Secure user authentication using JWT

Create posts with images and captions
Like and unlike posts
Add and view comments
Follow / Unfollow users
Personalized user feed
User profile management
Search functionality
Admin dashboard for managing users and content
Fully responsive UI for desktop and mobile

🛠 Tech Stack

Frontend: React.js, Tailwind CSS, Axios, React Router, Lucide Icons
Backend: Django, Django REST Framework, Python
Database: PostgreSQL
Authentication: JWT
Tools: Git, GitHub, Postman, VS Code
Architecture: RESTful API

⚙ How It Works

The frontend is built using React.js and communicates with the backend through REST APIs.

Django REST Framework handles all API requests and business logic.

PostgreSQL is used for storing user data, posts, comments, and relationships.

JWT authentication secures user login and protected routes.

📌 Purpose

This project was developed as a portfolio application to demonstrate full-stack development skills, including:

Building REST APIs

Database integration

Authentication systems

Responsive UI design

End-to-end web application development

👨‍💻 Developer

Shalon Rodrigs
 ⚙ Setup

 Backend
```bash
cd backend
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Frontend
```bash
 cd frontend
 npm install
 npm run dev
