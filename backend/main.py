import os
from flask import Flask, jsonify, request, json
from flask_cors import CORS
import mysql.connector
import firebase_admin
from firebase_admin import credentials, auth

app = Flask(__name__)
CORS(app, origins=[
     'https://bakery-project-theta.vercel.app', 'http://localhost:3000'])

HOST = os.environ['MYSQLHOST']
PORT = os.environ['MYSQLPORT']
USER = os.environ['MYSQLUSER']
PASSWORD = os.environ['MYSQLPASSWORD']
DATABASE = os.environ['MYSQLDATABASE']

app.secret_key = os.environ['secret_key']

firebase_credentials_json = os.environ.get('FIREBASE_CREDENTIALS_JSON')

if firebase_credentials_json:
    # Parse the JSON data
    firebase_credentials_data = json.loads(firebase_credentials_json)

    # Initialize Firebase Admin SDK
    cred = credentials.Certificate(firebase_credentials_data)
    firebase_admin.initialize_app(cred)


def create_connection():
    db = mysql.connector.connect(
        host=HOST,
        port=PORT,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    return db


def verify_token():
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        return jsonify({"success": "True"})
    except Exception as e:
        return jsonify({"success": "False"})


@app.route('/')
def index():
    print("Server is running!")
    return jsonify("Welcome to the backend!")


############################# BEGIN route for User #############################

def check_role(header):
    decoded_token = auth.verify_id_token(header)
    if decoded_token:
        email = decoded_token['email']
        print("email is: ", email)
        cnx = create_connection()
        cursor = cnx.cursor()
        cursor.execute("""SELECT ur.role_id FROM customer AS c JOIN user_role AS ur ON c.id = ur.user_id 
                            WHERE c.email = (%s)""", (email,))
        data = cursor.fetchone()
        print("data is: ", data)
        return True
    return False


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

        user_id = data[0][0]
        user_role_query = ("SELECT role_id FROM user_role WHERE user_id = %s")
        cursor.execute(user_role_query, (user_id,))
        role_data = cursor.fetchone()

        if role_data:
            user_role = role_data[0]
        else:
            # Default role if the user has no specific role_id
            user_role = 3

        cursor.close()
        cnx.close()
        return jsonify({"user": data, "role": user_role})


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


############################# END route for User #############################


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
        header = request.headers.get('Authorization')
        name = data["name"]
        price = data["price"]
        description = data["description"]
        image = data["image"]
        check_role(header)
        cnx = create_connection()
        cursor = cnx.cursor()
        cursor.execute("""INSERT INTO inventory (name, price, description, image) VALUES (%s, %s, %s, %s)""",
                       (name, price, description, image))
        cnx.commit()
        cursor.close()
        cnx.close()
        return jsonify({"success": "true"})
    else:
        return jsonify({"success": "false"})


############################# End route for Inventory #############################
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=os.getenv("PORT", default=5001))
