from flask import Flask, jsonify, request, json
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import mysql.connector


app = Flask(__name__)
CORS(app)

HOST = os.environ['MYSQLHOST']
PORT = os.environ['MYSQLPORT']
USER = os.environ['MYSQLUSER']
PASSWORD = os.environ['MYSQLPASSWORD']
DATABASE = os.environ['MYSQLDATABASE']
GEOCAGE_API = os.environ['GEOCAGE_API']

def create_connection():
    db = mysql.connector.connect(
        host=HOST,
        port=PORT,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    return db


@app.route('/')
def index():
    print("Server is running!")
    return jsonify("Welcome to the Travel Planner backend!")


if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5001))