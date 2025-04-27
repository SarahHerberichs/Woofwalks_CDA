import BtnPostAdd from "../../components/Buttons/BtnPostAdd";
import GenericPostForm from "../../components/Forms/GenericPostForm";
import walkSpecificFields from "../../components/Forms/Walks/walkSpecificFields";
import WalkList from "../../components/Lists/WalkList";

const WalksPage = () => {
  //Passage du context présent
  const formContext = "walks";

  return (
    <>
      <BtnPostAdd
        formContext={formContext}
        formGenericFieldsComponent={GenericPostForm}
        entitySpecificFields={walkSpecificFields}
      />

      <WalkList />
    </>
  );
};

export default WalksPage;
