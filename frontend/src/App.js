import React from 'react';
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'


const App = () => {
  return ( 
    <>
      <Header />
      <mian className='py-3'>
        <Container>
          <h1>Welcome to Palmar Store</h1>
        </Container>
      </mian>
      <Footer />
    </>
  )
}

export default App