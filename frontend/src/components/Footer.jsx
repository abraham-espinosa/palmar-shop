import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  const year = new Date().getFullYear();   
  return (
    <footer>
        <Container>
            <Row>
                <Col className='text-center py-3'>
                    <p>
                        Palmar &copy; {year} | Abraham Espinosa 
                    </p>
                </Col>
            </Row>
        </Container>
    </footer>
  )
}

export default Footer