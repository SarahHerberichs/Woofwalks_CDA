// Header.js
import { Container, Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../../utils/AuthProvider";
import BtnLogout from "../Buttons/BtnLogout";
function Header() {
  const { authToken } = useAuth();
  const isAuthenticated = !!authToken;
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
            {!isAuthenticated && (
              <>
                <Nav.Link href="/newaccount">Créer un compte</Nav.Link>
                <Nav.Link href="/Login">Login</Nav.Link>
              </>
            )}
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
