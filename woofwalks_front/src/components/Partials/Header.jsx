// Header.js
import { Container, Nav, Navbar } from "react-bootstrap";
import BtnLogout from "../Buttons/BtnLogout";

function Header() {
  const isAuthenticated = !!localStorage.getItem("authToken");
  console.log(isAuthenticated);
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">DogWalks</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Accueil</Nav.Link>
            <Nav.Link href="/walks">Walks</Nav.Link>
            <Nav.Link href="/parcs">Parcs</Nav.Link>
            <Nav.Link href="/hikes">Hikes</Nav.Link>
            <Nav.Link href="/apropos">À propos</Nav.Link>
            <Nav.Link href="/newaccount">CreateAccount</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
            {isAuthenticated && (
              <Nav.Item>
                <BtnLogout />
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
