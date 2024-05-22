from flask import Blueprint, jsonify, abort, request, redirect, render_template, url_for, Response
from flask_login import current_user, login_required
from sqlalchemy import and_
from app import db
from app.models import Department, Role, Employee
import csv
import json
from werkzeug.utils import secure_filename

from . import admin

def check_isAdmin(is_admin):
    if not is_admin or is_admin.lower() != 'true':
        abort(403)

@admin.route('/departments', methods=['GET'])
# @login_required
def list_departments():
    check_isAdmin(request.args.get('isAdmin'))
    departments = Department.query.all()
    departments_data = [department.to_dict() for department in departments]
    return departments_data, 200

@admin.route('/roles', methods=['GET'])
def list_roles():
    check_isAdmin(request.args.get('isAdmin'))
    roles = Role.query.all()
    roles_data = [role.to_dict() for role in roles]
    return roles_data, 200

@admin.route('/employees', methods=['GET'])
def list_employees():
    check_isAdmin(request.args.get('isAdmin'))
    employees = Employee.query.all()
    employees_data = [e.to_dict() for e in employees]
    return employees_data, 200

@admin.route('/get_employees_by_pages', methods=['GET'])
def get_employees_by_pages():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('perPage', 10))
    search_terms = request.args.getlist('search')  # Convert search string back to list
    print(search_terms)
    print("******************")

    filter_condition=[]
    for each in search_terms:
        filter_by = (Employee.name.like(f"%{each}%") |
                     Employee.email.like(f"%{each}%") |
                     Employee.phone_number.like(f"%{each}%") |
                     Employee.employStatus.like(f"%{each}%") |
                     Department.name.like(f"%{each}%") |
                     Role.name.like(f"%{each}%"))
        filter_condition.append(filter_by)
    
    filtered_employees = Employee.query\
    .join(Department, Employee.department_id == Department.id)\
    .join(Role, Employee.role_id == Role.id)\
    .filter(and_(*filter_condition)).all()
    print("Filtered employees:")
    print(filtered_employees)
    total_records = len(filtered_employees)

    start_index = (page - 1) * per_page if page >= 1 else 0 
    end_index = start_index + per_page
    print(start_index, end_index)
    paginated_employees = filtered_employees[start_index:end_index]
    employees_data = [e.to_dict() for e in paginated_employees]
    return jsonify({"data": employees_data, "total_records":total_records}), 200




    





        







@admin.route('/employees/<int:employee_id>', methods=['DELETE'])
def delete_user(employee_id):
    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({'message': 'Employee not found'}), 404
    
    db.session.delete(employee)
    db.session.commit()
    
    return jsonify({'message': 'Employee deleted successfully'}), 200

@admin.route('/employees/<int:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    data = request.get_json()
    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({'message': 'Employee not found'}), 404
    if 'name' in data:
        employee.name = data['name']
    if 'email' in data:
        employee.email = data['email']
    if 'password' in data:
        employee.password = data['password']
    if 'phone' in data:
        employee.phone_number = data['phone']
    if 'department' in data:
        department = Department.query.filter_by(name=data['department']).first()
        if not department:
            department = Department(name=data['department'])
            db.session.add(department)
            db.session.commit()
        employee.department_id = department.id
    if 'role' in data:
        role = Role.query.filter_by(name=data['role']).first()
        if not role:
            role = Role(name=data['role'])
            db.session.add(role)
            db.session.commit()
        employee.role_id = role.id
    if 'employStatus' in data:
        employee.employStatus = data['employStatus']
    if 'is_admin' in data:
        employee.is_admin = data['is_admin']
    
    db.session.commit()
    return jsonify({'message': 'Employee updated successfully'}), 200


@admin.route('/newemployees', methods=['POST'])
def add_employee():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    department_name = data.get('department')
    role_name = data.get('role')
    phone_number = data.get('phone_number')
    employStatus = data.get('employStatus')
    is_admin = data.get('is_admin', False)

    if not all([name, email, password, phone, department_name, employStatus,role_name]):
        return jsonify({"error": "Missing data for one or more fields"}), 400

    # Find or create the department
    department = Department.query.filter_by(name=department_name).first()
    if not department:
        department = Department(name=department_name)
        db.session.add(department)
        db.session.commit()

    # Find or create the role
    role = Role.query.filter_by(name=role_name).first()
    if not role:
        role = Role(name=role_name)
        db.session.add(role)
        db.session.commit()

    # Create the new employee
    new_employee = Employee(
        name=name,
        email=email,
        password=password,
        phone_number=phone,
        department_id=department.id,
        role_id=role.id,
        employStatus = employStatus,
        is_admin=is_admin
    )

    db.session.add(new_employee)
    db.session.commit()

    return jsonify({
        "message": "New employee added successfully",
        "employee": {
            "id": new_employee.id,
            "name": new_employee.name,
            "email": new_employee.email,
            "phone": new_employee.phone_number,
            "department": department.name,
            "role": role.name,
            "employee_status": new_employee.employStatus,
            "is_admin": new_employee.is_admin
        }
    }), 201

@admin.route('/export/<string:contentName>', methods=['GET'])
def export_csv(contentName):
    csv_file_name = contentName + '.csv'
    csv_data =''

    if contentName == 'employees':
        csv_data = 'department_name,email,employeeStatus,is_admin,name,phone_number,role_name\n'
        employees = Employee.query.all()
        employees_data = [e.to_dict() for e in employees]
        for employee_data in employees_data:
            csv_data += f"{employee_data['department_name']},{employee_data['email']},{employee_data['employee_status']},{employee_data['is_admin']},{employee_data['name']},{employee_data['phone_number']},{employee_data['role_name']}\n"
    elif contentName == 'departments':
        csv_data = 'name,description\n'
        departments = Department.query.all()
        departments_data = [department.to_dict() for department in departments]
        for department_data in departments_data:
            csv_data += f"{department_data['name']},{department_data['description']}\n"
    elif contentName == 'roles':
        csv_data = 'name\n'
        roles = Role.query.all()
        roles_data = [role.to_dict() for role in roles]
        for role_data in roles_data:
            csv_data += f"{role_data['name']}\n"
    else:
        return jsonify({'error': 'Invalid content name'}), 400
    return Response(
            csv_data,
            mimetype="text/csv",
            headers={"Content-disposition": f"attachment; filename={csv_file_name}"}
        )

def save_employee(data):
    department_name, email, employee_status,is_admin,name,phone_number,role_name = data

    existing_employee = Employee.query.filter_by(email=email).first()

    if existing_employee:
        existing_employee.name = name
        existing_employee.phone_number = phone_number
        existing_employee.employStatus = employee_status
        existing_employee.is_admin = is_admin == 'true'
        existing_employee.department_id = save_department(department_name)
        existing_employee.role_id = save_role(role_name)
    
    else:
        new_employee = Employee(name=name, email=email, phone_number=phone_number, employStatus=employee_status, is_admin=is_admin == 'true' , department_id=save_department(department_name), role_id=save_role(role_name))
        db.session.add(new_employee)
    db.session.commit()


def save_department(department_name):
    existing_department = Department.query.filter_by(name=department_name).first()
    if existing_department:
        return existing_department.id
    else:
        # If department doesn't exist, create a new department
        new_department = Department(name=department_name)
        db.session.add(new_department)
        db.session.commit()
        return new_department.id
    
def save_role(role_name):
    existing_role = Role.query.filter_by(name=role_name).first()
    if existing_role:
        return existing_role.id
    else:
        new_role = Role(name=role_name)
        db.session.add(new_role)
        db.session.commit()
        return new_role.id


@admin.route('/upload', methods=['POST'])
def upload_csv():
    try:
        file = request.files['file']
        if file and file.filename.endswith('.csv'):
            # covert file stream to test and split into streams
            reader = csv.reader(file.stream.read().decode('utf-8').splitlines())
            data = [row for row in reader]
            for index, item in enumerate(data):
                if index == 0:
                    continue 
                save_employee(item)
            
            return jsonify({'message': 'File uploaded successfully', 'data': data}), 200
        else:
            return jsonify({'error': 'Invalid file format. Please upload a CSV file.'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
#/employees/status?employment_status=All
@admin.route('/employees/status', methods=['GET'])
def get_employee_by_status():
    employee_status = request.args.get('employee_status')
    print(request)
    print("employee_status!!!")
    print(employee_status)
    if employee_status == "All":
        employees = Employee.query.all()
    else:
        print("employee_status is not all")
        employees = Employee.query.filter_by(employStatus=employee_status).all()

    employees_data = [e.to_dict() for e in employees]
    return employees_data, 200

@admin.route('/departments/<int:department_id>', methods=['PUT'])
def update_departments(department_id):
    data = request.get_json()
    print(f"Received data: {data}")

    department = Department.query.get(department_id)
    
    if not department:
        print(f"Department with id {department_id} not found.")
        return jsonify({'message': 'Department not found'}), 404

    if 'name' in data:
        department.name = data['name']
        print(f"Updated name to: {department.name}")
        
    if 'description' in data:
        department.description = data['description']
        print(f"Updated description to: {department.description}")

    try:
        db.session.commit()
        print("Changes committed to the database.")
    except Exception as e:
        print(f"Error committing changes: {e}")
        db.session.rollback()
        return jsonify({'message': 'Failed to update department'}), 500

    return jsonify({'message': 'Department updated successfully'}), 200

@admin.route('/roles/<int:role_id>', methods=['PUT'])
def update_roles(role_id):
    data = request.get_json()
    role = Role.query.get(role_id)
    if not role:
        return jsonify({'message': 'Department not found'}), 404
    if 'name' in data:
        role.name = data['name']
    if 'description' in data:
        role.description = data['description']
    db.session.commit()
    return jsonify({'message': 'Role updated successfully'}), 200
       