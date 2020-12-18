import React from 'react'
import { Card, Icon } from 'antd';

const { Meta } = Card;

function CardComponent(props) {
    return ( 
        props.cardInfo.fields.description.stringValue && 
        <Card
            style={{ marginBottom: "15px",width:'53%' }}
            cover={
                <img
                    alt={props.cardInfo.fields.description.stringValue}
                    src={props.cardInfo.fields.image.stringValue} />
            }
            actions={[
                <a target="_blank" rel="noopener noreferrer" href={props.cardInfo.fields.link.stringValue}>
                    {/* <Icon type="ellipsis" key="ellipsis" /> */}
                    {props.cardInfo.fields.link.stringValue}
                </a>
            ]}
        >
            <Meta
                title={props.cardInfo.fields.stack.stringValue}
                description={props.cardInfo.fields.description.stringValue}
            />

        </Card>

    )
}

export default CardComponent
