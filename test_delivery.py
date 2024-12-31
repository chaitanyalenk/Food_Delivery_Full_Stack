import pytest
from flask import Flask
from flask_jwt_extended import create_access_token
from app import app, db  # Import the Flask app and the MongoDB database object
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
import json


# Fixtures to setup and teardown the testing environment
@pytest.fixture(scope='module')
def test_client():
    # Create a test client for the Flask app
    app.config['TESTING'] = True
    app.config['JWT_SECRET_KEY'] = "supersecretkey"

    # Use an in-memory MongoDB or a separate test database
    app.config['MONGO_URI'] = "mongodb://localhost:27017/test_food_delivery"
    client = MongoClient(app.config['MONGO_URI'])
    db_test = client.get_database()
    app.db = db_test

    # Initialize bcrypt
    bcrypt = Bcrypt(app)

    # Create the Flask test client
    with app.test_client() as client:
        yield client

    # Clean up (optional: delete test data)
    # client.drop_database("test_food_delivery")


# Test Signup
def test_signup(test_client):
    data = {
        "username": "chadwsadadditanawdya",
        "email": "chaitaasddwdadnywdada.lenka@gramener.com",
        "mobile": "9573019874",
        "password": "IAMBROKEPLSHELP"
    }

    response = test_client.post('/signup', json=data)
    print(response.data)  # Add this to see what is being returned
    assert response.status_code == 201
    # assert 'user_id' in json.loads(response.data)


# Test Login
def test_login(test_client):
    data = {
        "email": "chaitanya.lenka@gramener.com",
        "password": "IAMBROKEPLSHELP"
    }

    response = test_client.post('/login', json=data)
    assert response.status_code == 200
    assert 'access_token' in json.loads(response.data)


# Test Get Restaurants (with JWT)
def test_get_restaurants(test_client):
    # Mock the JWT token for authentication
    login_data = {
        "email": "testuser@example.com",
        "password": "testpassword"
    }
    login_response = test_client.post('/login', json=login_data)
    token = json.loads(login_response.data)["access_token"]

    # Get restaurants with JWT token
    response = test_client.get('/restaurants', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    assert isinstance(json.loads(response.data), list)


# Test Place Order
def test_place_order(test_client):
    data = {
        "user_id": "6760156a99e2f90df85fceda",
        "restaurant_id": "67601c3949bdcbc69cce4055",
        "items": [
            {"name": "Spicy Chicken Wings", "quantity": 2},
            {"name": "Veggie Burger", "quantity": 1}
        ],
        "total_price": 28.96,
        "status": "Placed",
        "delivery_address": "123 Test St, Test City",
        "payment_method": "Credit Card"
    }

    response = test_client.post('/orders', json=data)
    assert response.status_code == 201
    assert 'order_id' in json.loads(response.data)

# Additional tests for other endpoints can be added similarly.
