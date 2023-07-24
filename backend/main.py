import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector


app = Flask(__name__)
CORS(app, origins=[
     'https://bakery-project-theta.vercel.app', 'http://localhost:3000'])

HOST = os.environ['MYSQLHOST']
PORT = os.environ['MYSQLPORT']
USER = os.environ['MYSQLUSER']
PASSWORD = os.environ['MYSQLPASSWORD']
DATABASE = os.environ['MYSQLDATABASE']


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
    return jsonify("Welcome to the backend!")


############################# BEGIN route for Inventory #############################

@app.route('/inventory', methods=['POST'])
def get_inventory():
    try:
        cnx = create_connection()
        cursor = cnx.cursor()
        query = "SELECT * FROM inventory"
        cursor.execute(query)
        data = []
        for row in cursor.fetchall():
            item = {
                'id': row[0],
                'name': row[1],
                'price': row[2],
                'description': row[3],
                'image': row[4]
            }
            data.append(item)
        cursor.close()
        cnx.close()
        return jsonify({"inventory": data})
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/inventoryItem', methods=['POST'])
def get_inventory_item():
    data = request.get_json()
    id = data['id']
    try:
        cnx = create_connection()
        cursor = cnx.cursor()
        cursor.execute("""SELECT * FROM inventory WHERE id = (%s)""", (id,))
        data = []
        for row in cursor.fetchall():
            item = {
                'id': row[0],
                'name': row[1],
                'price': row[2],
                'description': row[3],
                'image': row[4]
            }
            data.append(item)
        cursor.close()
        cnx.close()
        return jsonify({"item": data})
    except Exception as e:
        return jsonify({"error": str(e)})
    
@app.route('/addItem', methods=['POST'])
def add_item():
    if request.method == "POST":
        data = request.get_json()
        name = data["name"]
        price = data["price"]
        description = data["description"]
        image = data["image"]
        cnx = create_connection()
        cursor = cnx.cursor()
        cursor.execute("""INSERT INTO inventory (name, price, description, image) VALUES (%s, %s, %s, %s)""",
                       (name, price, description, image))
        cnx.commit()
        cursor.close()
        cnx.close()
        return jsonify({"success": "true"})




############################# End route for Inventory #############################

############################# BEGIN route for Login #############################
@app.route("/addUser", methods=["POST"])
def add_user():
    if request.method == "POST":
        data = request.get_json()
        email = data["email"]
        first = data["first"]
        last = data["last"]
        phone = data["phone"]
        cnx = create_connection()
        cursor = cnx.cursor()
        cursor.execute("""INSERT INTO customer (first_name, last_name, phone_number, email) VALUES (%s, %s, %s, %s)""",
                       (first, last, phone, email))
        cnx.commit()
        cursor.close()
        cnx.close()
        return jsonify({"success": "true"})


@app.route("/checkUser", methods=["POST"])
def check_exists():
    if request.method == "POST":
        data = request.get_json()
        email = data["email"]
        query = ("SELECT * FROM customer WHERE email = (%s)")
        cnx = create_connection()
        cursor = cnx.cursor()
        cursor.execute(query, (email,))
        data = cursor.fetchall()
        if (len(data) == 0):
            cursor.close()
            cnx.close()
            return jsonify({"user": "none"})
        cursor.close()
        cnx.close()
        return jsonify({"user": data})


@app.route("/getUser", methods=["POST"])
def get_user():
    if request.method == "POST":
        data = request.get_json()
        email = data["email"]
        query = ("SELECT * FROM customer WHERE email = (%s)")
        cnx = create_connection()
        cursor = cnx.cursor()
        cursor.execute(query, (email,))
        data = []
        for row in cursor.fetchall():
            item = {
                'id': row[0],
                'first_name': row[1],
                'last_name': row[2],
                'phone_number': row[3],
                'email': row[4]
            }
            data.append(item)
        cursor.close()
        cnx.close()
        return jsonify({"user": data})


############################# END route for Login #############################
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=os.getenv("PORT", default=5001))
