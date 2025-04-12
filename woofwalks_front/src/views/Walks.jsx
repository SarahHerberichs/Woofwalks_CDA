import BtnPostAdd from "../components/Buttons/BtnPostAdd";
import GenericPostForm from "../components/Forms/GenericPostForm";
import walkSpecificFields from "../components/Forms/walkSpecificFields";
import WalkList from "../components/Lists/WalkList";

const Walks = () => {
  const formContext = "walks";
  const formComponents = [GenericPostForm]; // Passez directement le composant
  const entitySpecificFields = walkSpecificFields; // Définissez les spécificités ici

  return (
    <>
      <BtnPostAdd
        formContext={formContext}
        formComponents={formComponents}
        entitySpecificFields={entitySpecificFields} // Passez les spécificités au bouton
      />
      <WalkList />
    </>
  );
};

export default Walks;
