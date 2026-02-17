'use client'
import { Box, VStack, Text } from '@chakra-ui/react';
import React from 'react';

export default function BgImageCard(props: 
    {
        children:any, maxW?:string, mb?:string, w?:string, h?:string, p?:number,
        bg?:string, backgroundImage?:string

    })
{
    return (
        <Box
            w={props.w ?? { base: "100%", md: "80%" }}
            h={props.h ?? "80%"}
            maxW={props.maxW ?? "900px"}
            position="relative"   // important for overlay
            borderRadius="xl"
            boxShadow="xl"
            overflow="hidden"
            p={props.p ?? 10}
            display="flex"
            justifyContent="center"
            alignItems="center"
            >
            {/* Background image overlay */}
            <Box
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                backgroundImage={props.backgroundImage}  // e.g., "url('/image.jpg')"
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                opacity={0.2}    // opacity only affects this box
                zIndex={0}       // behind content
            />

            {/* Content on top */}
            <VStack spacing={4} zIndex={1}>
                {props.children}
            </VStack>
        </Box>
    );
}
