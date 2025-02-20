import React from 'react';
import './MainScreen.css';
import { Container, Row } from 'react-bootstrap';

const MainScreen = ({title, children}) => {
  return (
    <div className='mainback'>
        <Container>
            <Row>
                <div className='page'>
                    {
                        title && 
                        (<>
                        <h1 className='heading'>{title}</h1>
                        <hr />
                        </>
                   )}
                   {children}

                </div>
            </Row>
        </Container>
    </div>
  )
}

export default MainScreen