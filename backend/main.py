import os
from flask import Flask
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

HOST = os.environ['MYSQLHOST']
PORT = os.environ['MYSQLPORT']
USER = os.environ['MYSQLUSER']
PASSWORD = os.environ['MYSQLPASSWORD']
DATABASE = os.environ['MYSQLDATABASE']


@app.route('/')
def hello():
    return 'Hello, Backend!'

if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5001))
