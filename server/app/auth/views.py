from flask import Blueprint, request, jsonify, session
from flask_login import login_required, login_user, logout_user,current_user
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)
from datetime import datetime, timedelta
from app.models import Employee
from app import db

from . import auth


@auth.route('/register',methods = ['POST'])
def register():
    """
    Handle requests to the /register route
    Add an employee to the database 
    """
    data = request.get_json()
    email_data = data['email']
    password_data = data['password']
    name_data = data['name']

    if Employee.query.filter_by(email=email_data).first():
        return jsonify({'message': 'User already exists!'}), 400  # 400 Bad Request status code
    employee = Employee(email=email_data,name=name_data)
    employee.password = password_data
    db.session.add(employee)
    db.session.commit()
    return jsonify({'message': 'Registration successful'}), 200
   

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    employee = Employee.query.filter_by(email=email).first()
    if employee is not None and employee.verifyPassword(password):
        login_user(employee, remember=True)
        print(current_user)
        access_token = create_access_token(identity=employee.email)
        refresh_token = create_refresh_token(identity=employee.email)
        session['refresh_token'] = refresh_token
        # employee_info =load_user(employee.id)
        user_info = employee.to_dict()
        print(user_info)

        return jsonify({"access_token": access_token, "user": user_info}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401

@auth.route('/logout',methods=['POST'])
# @login_required
def logout():
    """
    Handle requests to the /logout route
    Log an employee out through the logout form
    """
    response = jsonify({"message": "Logged out"})
    logout_user()
    session.clear()  # Remove all keys from the session
    response.delete_cookie('session')
    return response

@auth.route('check-token', methods=['GET'])
def check_token():
    refresh_token = session.get('refresh_token')
    if not refresh_token:
        return jsonify({"message": "Invalid refresh token"}), 401

    access_token = create_access_token(identity=refresh_token)
    return jsonify({"access_token": access_token})