import { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import HomePageLayoutContainer from "../../Components/HomePage/HomePageLayoutContainer";
import Button from "../../StyledComponents/Button";
import TextLarge from "../../StyledComponents/TextLarge";

const HomePage = ({ credential }) => {
  const history = useHistory();
  useEffect(() => {
    console.log(credential);
    if (credential && credential.loginToken) {
      history.push("/lobby");
    }
  }, [credential]);
  return (
    <HomePageLayoutContainer>
      <Button
        onClick={() => history.push("/signup")}
        variant="green"
        style={{ margin: "1.25rem 0" }}
      >
        <TextLarge>Create Account</TextLarge>
      </Button>
      <Button
        onClick={() => history.push("/login")}
        variant="blue"
        style={{ margin: "0.4rem 0" }}
      >
        <TextLarge>LOGIN</TextLarge>
      </Button>
      <Button variant="red" onClick={() => history.push("/lobby")}>
        <TextLarge>GUEST</TextLarge>
      </Button>
    </HomePageLayoutContainer>
  );
};
const mapStateToProps = (state) => {
   const { LoginReducer } = state;
   return { credential: LoginReducer };
 };
export default connect(mapStateToProps)(HomePage);
