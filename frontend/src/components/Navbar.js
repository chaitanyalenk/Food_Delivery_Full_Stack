import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated, logout }) {
    return (
        <nav className="navbar nav-underline" style={{ backgroundColor: "#fc8a06" }}>
            <div className="container-fluid">
                <Link className="navbar-brand" style={{ color: "white", fontWeight: "bold" }} to="/">Food Delivery</Link>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <ul className="nav nav-underline">
                        {!isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" style={{ color: "white", fontWeight: "bold" }} to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" style={{ color: "white", fontWeight: "bold" }} to="/signup">Sign Up</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" style={{ color: "white", fontWeight: "bold" }} to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" style={{ color: "white", fontWeight: "bold" }} to="/restaurant">Restaurants</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" style={{ color: "white", fontWeight: "bold" }} to="/orders">Orders</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link" style={{ background: 'none', border: 'none', color: 'white', fontWeight: 'bold' }} onClick={logout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
