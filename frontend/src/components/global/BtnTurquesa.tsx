'use client'
import { Box, Button } from '@chakra-ui/react';
import React from 'react';
import { turquesa } from '../../Global';

export default function BtnTurquesa(props: {text:string, onClick:any})
{
    return (
        <Button
            size="lg"
            px={10}
            minW="200px"
            maxW="300px"
            w="100%"
            onClick={props.onClick}
            bg={turquesa}
            borderRadius="15px"
            _hover={{                 
                bg: "teal.200",         
            }}
        >
            {props.text}
        </Button>
    );
}
