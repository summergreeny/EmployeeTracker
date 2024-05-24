import unittest
from flask_testing import TestCase
from app import create_app, db
from app.models import  Employee, Department, Role
from flask import jsonify

# app = create_app(config_name='testing')
class BaseTestCase(TestCase):
    """A base test case."""
    def __init__(self):
        # self.app = self.create_app()
        self.app = self.create_app() 

    def create_app(self):
        
        app = create_app('development')  # Use the 'testing' configuration
        return app

    # def setUp(self):
        with self.app.app_context():
          db.create_all()
          departments = [
                  Department(name='Engineering', description='Responsible for building and maintaining software products'),
                  Department(name='Sales', description='Responsible for selling products and services'),
                  Department(name='Marketing', description='Responsible for promoting and advertising products'),
                  Department(name='Human Resources', description='Responsible for managing employee relations and hiring'),
                  Department(name='Finance', description='Responsible for managing financial transactions and budgets')
                ]
          db.session.add_all(departments)
          db.session.commit()

                # Create roles
          roles = [
            Role(name='Engineer', description='Responsible for developing software'),
            Role(name='Salesperson', description='Responsible for selling products'),
            Role(name='Marketing Specialist', description='Responsible for marketing campaigns'),
            Role(name='HR Manager', description='Responsible for managing human resources'),
            Role(name='Accountant', description='Responsible for financial reporting')
        ]
          db.session.add_all(roles)
          db.session.commit()

          employees = [{
          'email': 'john@example.com',
          'name': 'John Doe',
          'password': '123456',
          'phone_number': '123-456-7890',
          'employStatus': 'New Hire',
          'department_id': 1,
          'role_id': 1,
          'is_admin': False
      },
        {
          'email': 'jane@example.com',
          'name': 'Jane Smith',
          'password': '123456',
          'employStatus': 'New Hire',
          'department_id': 2,
          'role_id': 2,
          'is_admin': False
      },
      {
          'email': 'admin@example.com',
          'name': 'Admin User',
          'password': '123456',
          'phone_number': '555-555-5555',
          'employStatus': 'New Hire',
          'department_id': 1,
          'role_id': 1,
          'is_admin': True
      },
      {
          'email': 'alice@example.com',
          'name': 'Alice Johnson',
          'password': '123456',
          'phone_number': '111-222-3333',
          'employStatus': 'Former Employee',
          'department_id': 2,
          'role_id': 2,
          'is_admin': False
      },
      {
          'email': 'bob@example.com',
          'name': 'Bob Brown',
          'password': '123456',
          'phone_number': '444-555-6666',
          'employStatus': 'Former Employee',
          'department_id': 1,
          'role_id': 2,
          'is_admin': False
      },
      {
          'email': 'sarah@example.com',
          'name': 'Sarah Lee',
          'password': '123456',
          'phone_number': '777-888-9999',
          'employStatus': 'Former Employee',
          'department_id': 2,
          'role_id': 1,
          'is_admin': False
      },
      {
          'email': 'david@example.com',
          'name': 'David Clark',
          'password': '123456',
          'phone_number': '123-987-6543',
          'employStatus': 'Former Employee',
          'department_id': 1,
          'role_id': 1,
          'is_admin': False
      },
      {
          'email': 'emily@example.com',
          'name': 'Emily Taylor',
          'password': '123456',
          'phone_number': '555-123-4567',
          'employStatus': 'Inactive Employee',
          'department_id': 2,
          'role_id': 2,
          'is_admin': False
      },
      {
          'email': 'michael@example.com',
          'name': 'Michael Martinez',
          'password': '123456',
          'phone_number': '777-999-1111',
          'employStatus': 'Inactive Employee',
          'department_id': 1,
          'role_id': 1,
          'is_admin': False
      },
      {
          'email': 'laura@example.com',
          'name': 'Laura White',
          'password': '123456',
          'phone_number': '999-888-7777',
          'employStatus': 'Inactive Employee',
          'department_id': 2,
          'role_id': 1,
          'is_admin': False
      },
      {
          'email': 'admin1@admin.com',
          'name': 'Yilin Liu-Ruiz',
          'password': '123456',
          'phone_number': '999-888-7777',
          'employStatus': 'Activate Employee',
          'department_id': 2,
          'role_id': 1,
          'is_admin': True
      }]
          for emp_data in employees:
            emp = Employee(**emp_data)
            db.session.add(emp)
            db.session.commit()
        
        print("Database populated successfully")

    def tearDown(self):
        db.session.remove()
        db.drop_all()

class FlaskTestCase(BaseTestCase):
    def create_app(self):
        # Create a test app instance
        app = create_app()
        app.config['TESTING'] = True
        return app

    def test_rentals_summary(self):
        # Use self.client to perform HTTP requests
        response = self.client.get('/admin/get_employees_by_departments/41', content_type='html/text')
        print(response.data)

MyObject = FlaskTestCase()
MyObject.test_rentals_summary()
