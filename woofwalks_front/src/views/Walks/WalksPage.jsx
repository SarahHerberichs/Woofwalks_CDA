import BtnPostAdd from "../../components/Buttons/BtnPostAdd";
import GenericPostAdForm from "../../components/Forms/Ads/GenericPostAdForm";
import walkSpecificFields from "../../components/Forms/Walks/walkSpecificFields";
import WalkList from "../../components/Lists/WalkList";

const WalksPage = () => {
  //Passage du context présent
  const formContext = "walks";

  return (
    <>
      <BtnPostAdd
        formContext={formContext}
        formGenericFieldsComponent={GenericPostAdForm}
        entitySpecificFields={walkSpecificFields}
      />

      <WalkList />
    </>
  );
};

export default WalksPage;
