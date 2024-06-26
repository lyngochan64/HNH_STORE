import React from 'react'
import { Badge, Card } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function ProductPreview({_id, category, name, pictures, price}) {
  return (
    <LinkContainer to={`/product/${_id}`} style={{cursor: 'pointer', width: '13rem', margin: '10px'}}>
    <Card style={{width: '20rem', margin: '10px'}}>
        <Card.Img variant='top' className='product-preview-img' src={pictures[0].url} style={{height: '170px', objectFit: 'cover'}}/>
        <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Badge bg="warning" text="dark">
                {category}
            </Badge>
            
            <Card.Title>{Number(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Card.Title>
        </Card.Body>
    </Card>
    </LinkContainer>
  );

}

export default ProductPreview
