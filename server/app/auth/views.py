from flask import request, jsonify, session
from flask_login import login_required, login_user, logout_user,current_user
from flask_restful import Resource
from app.models import Employee
from app import db

from . import auth


@auth.route('/register',methods = ['POST'])
def register():
    """
    Handle requests to the /register route Add an employee to the database 
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name_data = data.get('name')

    if Employee.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists, email already registered'}), 400  

    new_employee = Employee(email=email,name=name_data)
    new_employee.password = password
    db.session.add(new_employee)
    db.session.commit()
    return jsonify({'message': 'Registration successful'}), 201
   

@auth.route('/login', methods=['POST'])
def login():
    """
    Handle requests to the /login route to authenticate a user.
    """
    data = request.json
    email = data.get('email')
    password = data.get('password')
    print(f"Email: {email}, Password: {password}")
    if None in (email, password):

        return jsonify(msg="Invalid Data"), 401

    employee = Employee.query.filter_by(email=email).first()
    if employee is not None and employee.verifyPassword(password):
        login_user(employee, remember=True)
        user_info = employee.to_dict()
        response = jsonify({ 'message': "success","user": user_info})
        response.set_cookie('email', employee.email, max_age=3600)
        # session["email"] = employee.email
        
        return response, 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401

# class CheckSession(Resource):
#   def get(self):
#     user = Employee.query.filter(Employee.email == session.get('user_id')).first()
#     if user:
#       return user.to_dict(), 200
#     return {'error': 'Unauthorized'}, 401

@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    print(f"Logging out user: {current_user}")
    logout_user()
    print(f"User after logout: {current_user}")
    # if session.get('email'):
    #     session['email'] = None
    # session.pop('email', None) 
    # session.clear()
    # session.pop(current_user.email, None)
    response = jsonify({'message': 'Logged out'})
    response.set_cookie('user_id', '', expires=0)  # Expire the cookie immediately
    return response, 200

