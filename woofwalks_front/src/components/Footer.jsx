import React from "react";
import { Col, Container, Navbar, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <Navbar bg="dark" variant="dark" className="mt-5">
      <Container>
        <Row className="w-100">
          <Col md={4} className="text-center text-md-left mb-3 mb-md-0">
            <p>
              © {new Date().getFullYear()} Woof Walks. Tous droits réservés.
            </p>
          </Col>
          <Col md={4} className="text-center mb-3 mb-md-0">
            <p>
              <a href="/about" className="text-light">
                À propos
              </a>{" "}
              |{" "}
              <a href="/contact" className="text-light">
                Contact
              </a>{" "}
              |{" "}
              <a href="/privacy-policy" className="text-light">
                Politique de confidentialité
              </a>
            </p>
          </Col>
          <Col md={4} className="text-center text-md-right mb-3 mb-md-0">
            <p>Suivez-nous :</p>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light mr-3"
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light mr-3"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Footer;
