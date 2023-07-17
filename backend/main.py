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


############################# BEGIN route for Home #############################

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
                'description': row[3]
            }
            data.append(item)
        cursor.close()
        cnx.close()
        return jsonify({"inventory": data})
    except Exception as e:
        return jsonify({"error": str(e)})


############################# End route for Home #############################

############################# BEGIN route for Login #############################
@app.route("/checkUser", methods=["POST"])
def check_exists():
    if request.method == "POST":
        data = request.get_json()
        email = data["email"]
        query = ("SELECT * FROM customer WHERE email = (%s)")
        cnx = create_connection()
        cur = cnx.cursor()
        cur.execute(query, (email,))
        data = cur.fetchall()
        if (len(data) == 0):
            cur.close()
            cnx.close()
            return jsonify({"user": "none"})
        cur.close()
        cnx.close()
        return jsonify({"user": data})


@app.route("/login", methods=["POST"])
def check_user_exists():
    print("in function")
    if request.method == "POST":
        data = request.get_json()
        uid = data["uid"]
        email = data["email"]
        first_name = "a"
        last_name = "b"
        displayName = data["displayName"]
        phone_number = "c"
        print(data)
        query = ("SELECT * FROM customer WHERE uid = (%s)")
        # Opens connection & cursor
        cnx = create_connection()
        cur = cnx.cursor()

        cur.execute(query, (uid,))
        data = cur.fetchall()
        print("data is ", data)
        if (len(data) == 0):
            try:
                print("trying to insert")
                cur.execute("""
                    INSERT INTO customer (first_name, last_name, phone_number, email, display_name, uid)
                    VALUES ( %s, %s, %s, %s, %s, %s)
                """, (first_name, last_name, phone_number, email, displayName, uid))
                print("inserted")
                cnx.commit()
                cur.close()
                cnx.close()

            except Exception as e:
                cnx.rollback()
                cur.close()
                cnx.close()

        cur.close()
        cnx.close()
        return jsonify({"user": data})

############################# END route for Login #############################


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=os.getenv("PORT", default=5001))
