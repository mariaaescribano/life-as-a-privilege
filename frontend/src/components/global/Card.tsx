'use client'
import { Box } from '@chakra-ui/react';
import React from 'react';

export default function Card(props: {children:any, maxW?:string, mb?:string, h?:string, p?:number})
{
    return (
        <Box
            w={{ base: "100%", md: "80%" }}
            h={props.h ?? "80%"}
            maxW={props.maxW ?? "900px"}
            bg="white"
            mb={props.mb ?? "20px"}
            p={props.p ?? 10}
            borderRadius="xl"
            boxShadow="xl"
        >
            {props.children}
        </Box>
    );
}
