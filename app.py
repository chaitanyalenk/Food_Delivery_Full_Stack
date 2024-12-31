from flask import Flask, request, jsonify,send_from_directory
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS , cross_origin
from flask_bcrypt import Bcrypt  # Add this for password hashing
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity  # Add for JWT authentication
from datetime import datetime
import os

app = Flask(__name__, static_folder='frontend/build')
CORS(app)
# MongoDB Configuration (adjust the URI to match your MongoDB setup)
MONGO_URI = "mongodb+srv://ChaitanyaLenka:chaitu123@cluster0.rzfiw.mongodb.net/"  # Replace with your MongoDB URI if different
client = MongoClient(MONGO_URI)
db = client['food_delivery']  # Replace 'food_delivery' with your database name



bcrypt = Bcrypt(app)
app.config["JWT_SECRET_KEY"] = "supersecretkey"  # Change this to a more secure key
jwt = JWTManager(app)

# Static folder path for images
IMAGE_FOLDER = 'static/images'

# User Signup
@app.route('/signup', methods=['POST'])
@cross_origin()
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    mobile= data.get("mobile")
    password = data.get("password")

    # Check if the user already exists
    existing_user = db.users.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create a new user in the database
    user_id = db.users.insert_one({
        "username": username,
        "email": email,
        "mobile":mobile,
        "password": hashed_password
    }).inserted_id

    return jsonify({"message": "User created", "user_id": str(user_id)}), 201

# User Login
@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Check password validity
    if not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid password"}), 401

    # Create JWT token
    access_token = create_access_token(identity=str(user["_id"]))
    user_id = str(user["_id"])  # Extract user ID

    return jsonify({"access_token": access_token, "user_id": user_id}), 200



@app.route('/users/<user_id>', methods=['GET'])
@cross_origin()
@jwt_required()
def get_user(user_id):
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    user['_id'] = str(user['_id'])
    return jsonify(user)

# Restaurants Collection
# Serve static files for images
@app.route('/images/<filename>')
@cross_origin()
def serve_image(filename):
    return send_from_directory(IMAGE_FOLDER, filename)

@app.route('/restaurants', methods=['GET'])
@cross_origin()
@jwt_required()
def get_restaurants():
    # Fetching all restaurants from the database
    restaurants = db.restaurants.find()

    # Convert each restaurant's ObjectId to string
    restaurant_list = []
    for restaurant in restaurants:
        restaurant['_id'] = str(restaurant['_id'])  # Convert ObjectId to string for JSON serialization
        # Build restaurant image URL
        image_filename = f"restaurant_{restaurant['restaurant_name'].replace(' ', '_')}.jpg"
        restaurant['image_url'] = f"/{IMAGE_FOLDER}/{image_filename}"
        restaurant_list.append(restaurant)

    return jsonify(restaurant_list), 200


@app.route('/restaurant/<restaurant_id>', methods=['GET'])
@cross_origin()
@jwt_required()
def get_restaurant_by_id(restaurant_id):
    try:
        # Fetching the restaurant by ID from the database
        restaurant = db.restaurants.find_one({"_id": ObjectId(restaurant_id)})

        if not restaurant:
            return jsonify({"message": "Restaurant not found"}), 404

        # Convert the ObjectId to string for JSON serialization
        restaurant['_id'] = str(restaurant['_id'])

        # Generate the restaurant image path
        image_filename = f"restaurant_{restaurant['restaurant_name'].replace(' ', '_')}.jpg"
        restaurant_image_path = os.path.join(IMAGE_FOLDER, image_filename)

        # Check if the image exists
        if os.path.exists(restaurant_image_path):
            image_url = f"/{restaurant_image_path}"
        else:
            image_url = f"/{IMAGE_FOLDER}/default_restaurant.jpg"  # Fallback to default image

        # Build the restaurant response
        restaurant_details = {
            "restaurant_name": restaurant["restaurant_name"],
            "address": restaurant["address"],
            "email": restaurant["email"],
            "mobile": restaurant["mobile"],
            "rating": restaurant["rating"],
            "image_url": image_url,  # Dynamically generated image path
            "menu": restaurant.get("menu", []),
            "deals": restaurant.get("deals", [])
        }

        return jsonify(restaurant_details), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# Orders Collection
@app.route('/orders', methods=['POST'])
@cross_origin()
def place_order():
    order_data = request.json
    order = {
        "user_id": order_data['user_id'],
        "restaurant_id": order_data['restaurant_id'],
        "items": order_data['items'],
        "total_price": order_data['total_price'],
        "status": order_data['status'],
        "order_date": datetime.utcnow(),
        "delivery_address": order_data['delivery_address'],
        "payment_method": order_data['payment_method']
    }

    try:
        orders_collection = db.orders
        order_id = orders_collection.insert_one(order).inserted_id
        return jsonify({"message": "Order placed successfully", "order_id": str(order_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/orders/user/<user_id>', methods=['GET'])
@cross_origin()
@jwt_required()
def get_user_orders(user_id):
    try:
        # Fetching orders based on the user_id
        orders = db.orders.find({"user_id": user_id})

        # Convert ObjectId and date fields to string
        order_list = []
        for order in orders:
            order['_id'] = str(order['_id'])  # Convert ObjectId to string
            order['order_date'] = order['order_date'].strftime('%Y-%m-%d %H:%M:%S')  # Format date to string
            order_list.append(order)

        return jsonify(order_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Delivery Agents Collection
@app.route('/agents', methods=['POST'])
@cross_origin()
def add_agent():
    data = request.json
    agent_id = db.agents.insert_one(data).inserted_id
    return jsonify({"message": "Agent added", "agent_id": str(agent_id)}), 201

@app.route('/agents/<agent_id>', methods=['GET'])
@cross_origin()
def get_agent(agent_id):
    agent = db.agents.find_one({"_id": ObjectId(agent_id)})
    if not agent:
        return jsonify({"error": "Agent not found"}), 404
    agent['_id'] = str(agent['_id'])
    return jsonify(agent)



@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True)
