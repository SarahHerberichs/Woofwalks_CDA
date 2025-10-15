import { Link } from 'react-router-dom';

const AccountPage = () => {
  const myActivityPath = "/myactivity";
  const settingsPath = "/settings";
  const ordersPath = "/myorders";

  const LinkItem = ({ to, children }) => (
    <Link
      to={to}

      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
    >
      <h5 className="my-0 fs-5 fw-semibold">{children}</h5>

      <i className="bi bi-chevron-right text-secondary"></i>
    </Link>
  );

  return (
    <div className="container py-5">

      <h1 className="display-5 border-bottom pb-3 mb-4">Mon Compte</h1>

      <div className="list-group list-group-flush">

        <LinkItem to={myActivityPath}>Mon Activité</LinkItem>

        <LinkItem to={settingsPath}>Réglages</LinkItem>

        <LinkItem to={ordersPath}>Mes Commandes</LinkItem>

      </div>
    </div>
  );
};

export default AccountPage;