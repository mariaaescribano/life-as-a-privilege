import { Badge, HStack, Text } from '@chakra-ui/react';
import React from 'react';

function BadgeText(props:{text:string, color:string, colorFondo:string, icon:any}) 
{
  return (
    <Badge
      color={props.color}
      bg={props.colorFondo}
      fontSize="20px"       
      fontWeight="bold" 
      maxW={"230px"}
      w="100%" 
      p="20px"          
      borderRadius="20px" 
      textAlign="center"  
      display="inline-block" 
    >
      <HStack justifyContent={"center"} >
         {props.icon}
        <Text fontSize="sm">{props.text}</Text>
      </HStack>
    </Badge>
  );
}

export default BadgeText;
