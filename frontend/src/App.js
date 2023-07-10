import React from 'react';
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'


const App = () => {
  return ( 
    <>
      <Header />
      <mian className='py-3'>
        <Container>
          <Outlet /> 
        </Container>
      </mian>
      <Footer />
    </>
  )
}

export default App