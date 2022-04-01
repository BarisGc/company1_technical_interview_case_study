import React from 'react'

import { Row, Card } from 'react-bootstrap'

function Header() {

    return (
        <Row className='mt-5 px-3 sticky-top '>
            <Card className='HeaderCard border-0 pt-3 d-flex align-items-center justify-content-center '>
                <Card.Body className='d-flex flex-column justify-content-center align-items-center w-100'>
                    <Card.Title as="h1" className='headerCardTitle text-center fs-1'> Sample Result Table </Card.Title>
                </Card.Body>
            </Card>
        </Row>
    )
}

export default Header
