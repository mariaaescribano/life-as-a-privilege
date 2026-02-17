'use client'
import { Text, Flex } from '@chakra-ui/react';
import React from 'react';

export default function Title(props: {icon:any, title:string, color?:string})
{
    return (
        <Flex
            align="center"
            justify="center"
            gap={3}
            mb={10}
        >
            {props.icon}
            <Text
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="800"
                color={props.color ?? "black"}
                letterSpacing="-0.02em"
                textShadow="0 2px 8px rgba(0,0,0,0.15)"
            >
                {props.title}
            </Text>
        </Flex>
    );
}
