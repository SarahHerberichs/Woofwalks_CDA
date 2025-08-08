import BtnPostAdd from "../../components/Buttons/BtnPostAdd";
import GenericPostAdForm from "../../components/Forms/Ads/GenericPostAdForm";
import walkSpecificFields from "../../components/Forms/Walks/walkSpecificFields";
import WalkList from "../../components/Lists/WalkList";
import { useAuth } from "../../utils/AuthContext";

const WalksPage = () => {
  //Passage du context présent
  const formContext = "walks";
  const { isAuthenticated, isLoading } = useAuth();
  return (
    <>
      <BtnPostAdd
        formContext={formContext}
        formGenericFieldsComponent={GenericPostAdForm}
        entitySpecificFields={walkSpecificFields}
        isAuthenticated={isAuthenticated}
      />
      <WalkList />
    </>
  );
};

export default WalksPage;
