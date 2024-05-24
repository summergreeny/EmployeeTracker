from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from app import db

################################################
# ######     Employee Class/Model
# ################################################

class Employee(UserMixin,db.Model):
  
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(60), index=True, unique=True)
    name = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(500))
    phone_number = db.Column(db.String(20))
    employStatus = db.Column(db.String(20), nullable=False, default='active')
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    is_admin = db.Column(db.Boolean, nullable=False, default=False)  

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute.')

    @password.setter
    def password(self, password):
        """
        Set password to a hashed password
        """
        self.password_hash = generate_password_hash(password)
        print("this is goood")
        print(len(self.password_hash))
    
    def verifyPassword(self, password):
        """
        Check if hashed password matches actual password
        """
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'phone_number': self.phone_number,
            'employStatus': self.employStatus,
            'department_name': self.department.name if self.department else None,
            'role_name': self.role.name if self.role else None,
            'employee_status': self.employStatus,
            'is_admin': self.is_admin
        }
    @property
    def is_active(self):
        return self.employStatus == 'active'

    def get_id(self):
        return str(self.id)
    
    def __repr__(self):
      return '<Employee: {}>'.format(self.name)

  
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(60), index=True, unique=True)
    name = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(500))
    phone_number = db.Column(db.String(20))
    employStatus = db.Column(db.String(20), nullable=False, default='active')
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    is_admin = db.Column(db.Boolean, nullable=False, default=False)  

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute.')

    @password.setter
    def password(self, password):
        """
        Set password to a hashed password
        """
        self.password_hash = generate_password_hash(password)
        print("this is goood")
        print(len(self.password_hash))
    
    def verifyPassword(self, password):
        """
        Check if hashed password matches actual password
        """
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'phone_number': self.phone_number,
            'employStatus': self.employStatus,
            'department_name': self.department.name if self.department else None,
            'role_name': self.role.name if self.role else None,
            'employee_status': self.employStatus,
            'is_admin': self.is_admin
        }
    @property
    def is_active(self):
        return self.employStatus == 'active'

    def get_id(self):
        return str(self.id)
    
    def __repr__(self):
      return '<Employee: {}>'.format(self.name)

################################################
# ######     Department Class/Model
# ################################################
class Department(db.Model):
    """
    Create a Department table
    """

    __tablename__ = 'departments'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), unique=True)
    description = db.Column(db.String(200))
    # lazy defines how the data will be loaded from the database; in this case, it will be loaded dynamically, which is ideal for managing large collections.
    employees = db.relationship('Employee', backref='department',
                                lazy='dynamic')
    def get_employee_count(self):
        return self.employees.count()
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'employee_count': self.get_employee_count()
        }

    def __repr__(self):
        return '<Department: {}>'.format(self.name)

################################################
# ######     Role Class/Model
# ################################################

class Role(db.Model):
    """
    Create a Role table
    """

    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), unique=True)
    description = db.Column(db.String(200))
    employees = db.relationship('Employee', backref='role',
                                lazy='dynamic')
    def get_employee_count(self):
        return self.employees.count()
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'employee_count': self.get_employee_count()
        }

    def __repr__(self):
        return '<Role: {}>'.format(self.name)

      

   
  