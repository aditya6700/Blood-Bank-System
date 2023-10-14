import React from 'react';
import { NavLink } from 'react-router-dom';
import {Container, Nav, Navbar} from 'react-bootstrap';

export default function NavigationBar({isAuthenticated}) {

  const LoginLogout = () => {
    if (isAuthenticated) {
      return (
        <>
          <NavLink className="nav-link" to="/logout">Logout</NavLink>
        </>
      )
    }
    else {
      return (
        <>
          <NavLink className="nav-link" to="/register">Register</NavLink>
          <NavLink className="nav-link" to="/login">Login</NavLink>
        </>
      )
    }
  }
  
  return (
    <>
      <Navbar collapseOnSelect expand="md" bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">Transfuse Now</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
            <LoginLogout />  
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  )
}
