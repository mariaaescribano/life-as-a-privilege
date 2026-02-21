'use client'
import { Button } from '@chakra-ui/react';
import React from 'react';
import { turquesa } from '../../GlobalVariables';

export default function BtnTurquesa(props: {
    text:string, onClick:any, w?:string, bgColor?:string, color?:string,
    disabled?:boolean
})
{
    return (
        <Button
            size="lg"
            px={10}
            disabled={props.disabled ?? false}
            minW={props.w ?? "200px"}
            maxW={props.w ?? "300px"}
            color={props.color ?? "white"}
            onClick={props.onClick}
            bg={props.bgColor ?? turquesa}
            borderRadius="15px"
            _hover={{                 
                bg: "gray.100",         
            }}
        >
            {props.text}
        </Button>
    );
}
