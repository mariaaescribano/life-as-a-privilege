'use client'
import { Box, VStack, Text } from '@chakra-ui/react';
import React from 'react';

export default function Card(props: 
    {
        children:any, maxW?:string, mb?:string, w?:string, h?:string, p?:number,
        bg?:string,

    })
{
    return (
        <Box
            w={props.w ?? { base: "100%", md: "80%" }}
            h={props.h ?? "80%"}
            maxW={props.maxW ?? "900px"}
            bg="white"
            mb={props.mb ?? "20px"}
            p={props.p ?? 10}
            borderRadius="xl"
            boxShadow="lg"
        >
            {props.children}
        </Box>

    );
}
