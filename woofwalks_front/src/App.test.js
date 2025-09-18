import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

test('App se rend correctement', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );

  const element = screen.getByText(/Chargement.../i);
  expect(element).toBeInTheDocument();
});
