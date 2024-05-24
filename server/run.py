# set the FLASK_CONFIG and FLASK_APP environment variables before running the app:
#export FLASK_CONFIG=development
#export FLASK_APP=run.py
#flask run --reload
# unalias python
import os

from app import create_app

config_name = os.getenv('FLASK_CONFIG')
app = create_app(config_name) #We create the app by running the create_app function and passing in the configuration name. 
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)