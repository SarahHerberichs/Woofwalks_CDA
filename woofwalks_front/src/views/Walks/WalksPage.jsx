import BtnPostAd from "../../components/Buttons/BtnPostAd";
import walkSpecificFields from "../../components/FormSpecificFields/Walks/walkSpecificFields";
import WalkList from "../../components/Lists/WalkList";

const WalksPage = () => {
  //Passage du context présent
  const formContext = "walks";
  return (
    <>
      <BtnPostAd
        formContext={formContext}
        entitySpecificFields={walkSpecificFields}
      />
      <WalkList />
    </>
  );
};

export default WalksPage;
