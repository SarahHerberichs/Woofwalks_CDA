import { fireEvent, render, screen } from "@testing-library/react";
import LoginForm from "./LoginForm";
//Test des comportements des champs et btn entre eux, en simulant les fonctionalités réelles(Mocks)
// Mock de useNavigate(simulation dune fonction quelconque pour ne pas dependre de la vrai navigation)
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock de useAuth
const mockLogin = jest.fn();
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));
//avant chaque test lié à loginform , réinit les fonctions mock (évite que les appel de test dessus influencent le suivant)
describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //vérif que les elements sont dans le document(test le rendu)
  it("rend le formulaire avec les champs et le bouton", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Se connecter/i })).toBeInTheDocument();
  });

  it("appelle login et navigate après soumission réussie", async () => {
    mockLogin.mockResolvedValueOnce(); 
    render(<LoginForm />);
    //Simulation de la connexion avec valeurs test
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

    // Vérifier que login a été appelé avec les bonnes valeurs
    expect(mockLogin).toHaveBeenCalledWith("test@test.com", "password");

    // Vérif que navigate apellé avec "/"
    await screen.findByRole("button"); // attente pour update du state
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("affiche un message d'erreur si login échoue", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Erreur"));
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

    const errorMessage = await screen.findByText(/Email ou mot de passe incorrect/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
