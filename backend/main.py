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


@app.route("/login", methods=["POST"])
def check_user_exists():
    if request.method == "POST":
        data = request.get_json()
        uid = data["uid"]
        email = data["email"]
        displayName = data["displayName"]
        query = ("SELECT * FROM customer WHERE id = (%s)")
        # Opens connection & cursor
        cnx = create_connection()
        cur = cnx.cursor()

        cur.execute(query, (uid,))
        data = cur.fetchall()
        if (len(data) == 0):
            try:
                cur.execute("""
                    INSERT INTO customer (uid, email, display_name)
                    VALUES ( %s, %s, %s)
                """, (uid, email, displayName))

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
