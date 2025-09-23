
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

  useEffect(() => {
    document.title = "WoofWalks - Balades Canines et Parcs pour Chiens en France";
  }, []);

  return (
    <div className="container mt-4">
      {/* Hero Section optimisée pour le SEO */}
      <section className="hero-section text-center py-5 mb-5">
        <h1 className="display-4 fw-bold text-primary mb-4">
          Balades Canines et Parcs pour Chiens en France
        </h1>
        <p className="lead mb-4">
          Découvrez des <strong>balades canines organisées</strong> près de chez vous.
          Rejoignez la communauté WoofWalks pour des <strong>sorties avec votre chien</strong>
          dans les <strong>parcs et espaces verts</strong> de votre région.
        </p>
        <div className="d-grid gap-2 d-md-flex justify-content-md-center">
          <Link to="/walks" className="btn btn-primary btn-lg me-md-2">
            Voir les Balades
          </Link>
          <Link to="/newaccount" className="btn btn-outline-primary btn-lg">
            Rejoindre la Communauté
          </Link>
        </div>
      </section>

      {/* Section des avantages avec mots-clés locaux */}
      <section className="features-section mb-5">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card h-100 text-center">
              <div className="card-body">
                <h3 className="card-title h5"><Link to="/parcs" className="btn btn-primary btn-lg me-md-2">🏞️ Parcs pour Chiens </Link></h3>
                <p className="card-text">
                  Trouvez les <strong>meilleurs parcs pour chiens</strong> de votre région.
                  Des espaces sécurisés pour que votre compagnon puisse se dépenser librement.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card h-100 text-center">
              <div className="card-body">
                <h3 className="card-title h5">👥 Communauté Locale</h3>
                <p className="card-text">
                  Rencontrez d'autres propriétaires de chiens dans votre ville.
                  Organisez des <strong>balades canines</strong> et partagez vos expériences.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card h-100 text-center">
              <div className="card-body">
                <h3 className="card-title h5">📍 Géolocalisation</h3>
                <p className="card-text">
                  Découvrez les <strong>sorties avec chien</strong> les plus proches de chez vous.
                  Notre carte interactive vous guide vers les meilleurs spots.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section des villes populaires pour le SEO local */}
      <section className="cities-section mb-5">
        <h2 className="text-center mb-4">Balades Canines dans les Grandes Villes</h2>
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">Paris</h5>
                <p className="card-text small">Balades canines à Paris</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">Lyon</h5>
                <p className="card-text small">Parcs pour chiens à Lyon</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">Marseille</h5>
                <p className="card-text small">Sorties chien à Marseille</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">Toulouse</h5>
                <p className="card-text small">Promenades canines à Toulouse</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA finale */}
      <section className="cta-section text-center py-5 bg-light rounded">
        <h2 className="mb-4">Prêt à Découvrir les Meilleures Balades Canines ?</h2>
        <p className="lead mb-4">
          Rejoignez des milliers de propriétaires de chiens qui organisent des
          <strong> sorties canines</strong> dans toute la France.
        </p>
        <Link to="/walks" className="btn btn-primary btn-lg">
          Commencer Maintenant
        </Link>
      </section>
    </div>
  );
};

export default Home;
