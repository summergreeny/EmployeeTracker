# Project Title

## Pre-requisites and Local Development

Developers using this project should already have Python3 and pip installed on their local machines.

From the backend folder run pip install requirements.txt. All required packages are included in the requirements file.

Installing Dependencies
Python 3.9
Follow instructions to install the latest version of python for your platform in the python docs Virtual Environment.

We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organized. Instructions for setting up a virtual environment for your platform can be found in the python docs

PIP Dependencies
Once you have your virtual environment setup and running, install dependencies by navigating to the /backend directory and running:

pip install -r requirements.txt

This will install all of the required packages we selected within the requirements.txt file.

Key Dependencies
Flask is a lightweight backend microservices framework. Flask is required to handle requests and responses.

SQLAlchemy is the Python SQL toolkit and ORM we'll use handle the lightweight sqlite database. You'll primarily work in app.py and can reference models.py.

Flask-CORS is the extension we'll use to handle cross origin requests from our frontend server.

Database Setup
Development
Start by creating the database running the command brew services start mysql on macOS
Access MySQL Shell : mysql -u root -p (will require you to write you own database password)

CREATE DATABASE employeeDatabase;

flask db init
flask db migrate -m "1st migration"
Then you can simply upgrade the database.

Running Tests(TODO)
Tests can be run with the python file test_app.py
