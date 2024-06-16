import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/inputs/button.input.component";
import { useNavigate } from "react-router-dom";
import { BackgroundGradient } from "../landing/components/background-gradient.component";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className=" w-4/5 h-full flex items-center justify-center text-lg lg:text-lg-xl text-error m-auto flex-col">
        <div>
          <FontAwesomeIcon icon={faWarning} className="lg:mr-4" />
          This is not the page you're looking for
        </div>
        <Button title="Try Again" onClick={() => navigate(-1)}>
          go back
        </Button>
      </div>
      <BackgroundGradient />
    </>
  );
};
