
// import './Homecss.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import * as React from 'react';
import { useNavigate } from "react-router-dom";
import AddTransaction from './AddTransaction';
import { NewTransaction } from './NewTransaction';
// import NewIncome from './NewIncome';




const Home = () => {
  const navigate = useNavigate()

  const homePage = () => {
    navigate('/main')
  }

  const expPage = () => {
    navigate('/OkExpense')
  }

  const incPage = () => {
    navigate('/OkIncome')
  }

  return (
    <>
      <div className="height_nav">
        <Navbar className="height_nav" bg="dark" variant="dark">
          <Container>
            <Nav className="me-auto">       
              {/* <button onClick={homePage} className="">Home</button> */}
              <button onClick={expPage} className="">Expense Details</button>
              <button onClick={incPage} className="">Income Details</button>
            
            </Nav>
          </Container>
        </Navbar>
      </div>
      {/* <AddTransaction /> */}
      <NewTransaction/>

    </>
  )

}

export default Home
