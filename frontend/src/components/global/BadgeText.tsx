import { Badge, Text } from '@chakra-ui/react';
import React from 'react';

function BadgeText(props:{text:string, color:string, colorFondo:string}) 
{
    return (
      <Badge
        color={props.color}
        bg={props.colorFondo}
        fontSize="14px"       
        fontWeight="bold" 
        maxW={"150px"}
        w="100%" 
        p="20px"           
        borderRadius="20px" 
        textAlign="center"  
        display="inline-block" 
      >
        {props.text}
      </Badge>
    );
}

export default BadgeText;
