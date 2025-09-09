import { Container, Nav, Navbar } from "react-bootstrap";
import logo from '../../assets/images/woofwalks_logo_white.png';
import { useAuth } from "../../contexts/AuthContext";
import BtnLogout from "../Buttons/BtnLogout";
import './Header.css';

function Header() {
 const { isAuthenticated, isLoading } = useAuth();
 
    if (isLoading) {
        // Optionnel: Afficher un loader pendant que l'authentification est vérifiée
        return <Navbar bg="light" expand="lg" className="shadow-sm"><Container><Navbar.Brand>Chargement...</Navbar.Brand></Container></Navbar>;
    }

  return (
    <Navbar expand="lg" className="shadow-sm navbar">
      <Container>
        <Navbar.Brand><img src={logo} className='logo-woofwalks' alt="Woofwalks Logo" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="btn"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Accueil</Nav.Link>
            <Nav.Link href="/walks">Balades</Nav.Link>
            <Nav.Link href="/hikes">Randonnées</Nav.Link>
            <Nav.Link href="/parcs">Parcs</Nav.Link>
            <Nav.Link href="/shop">Boutique</Nav.Link>

            {!isAuthenticated && (
              <>
                <Nav.Link href="/newaccount">Créer un compte</Nav.Link>
                <Nav.Link href="/Login">Login</Nav.Link>
              </>
            )}
            {isAuthenticated && (
              <>
                <Nav.Link href="/account">Mon compte</Nav.Link>
                <Nav.Link href="/messages">Ma messagerie</Nav.Link>
                <BtnLogout />
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
