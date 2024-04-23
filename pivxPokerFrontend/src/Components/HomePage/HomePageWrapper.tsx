import styled from 'styled-components';
import backgroundDesign from '../../images/gridanimatedv3.svg';
import { PropsWithChildren } from 'react';
//FIX THE FUCKING BACKGROUND

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-repeat: no-repeat;
`;
const HomePageWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return <Wrapper style={{ backgroundImage: `url(${backgroundDesign})` }}>{children}</Wrapper>;
};

export default HomePageWrapper;
