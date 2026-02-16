
import { Input , Text, Flex } from '@chakra-ui/react';
import React from 'react';
import { turquesa } from '../../GlobalVariables';

export default function InputField(props:
  {
    title:string, value:string, onChange:any, placeholder?:string,
    mb?:string, mt?:string, type?:string, autoFocus?:boolean
  })
{
  return (
    <Flex direction="column" mt={props.mt ?? "10px"} mb={props.mb ?? "10px"}>
      
      <Text  mb="5px" fontWeight={"black"}>{props.title}</Text>
      <Input
        autoFocus = {props.autoFocus ?? false}
        type={props.type ?? "text"}
        borderRadius="md"
        borderWidth="1px"
        borderColor="gray.300"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder ?? ""}
        _hover={{
          borderColor: turquesa,
        }}
        _focus={{
          borderColor: turquesa,
          boxShadow: `0 0 0 1px ${turquesa}`,
        }}
      />
        
    </Flex>
  );
}
