from app.models import Employee
from app import create_app, db

app = create_app('development')
with app.app_context():
  admin = Employee(email="admin1@admin.com",name = "admin",password="123123",is_admin=True)
  db.session.add(admin)
  db.session.commit()