import { Box, Text, Icon, IconButton } from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon, WarningIcon } from '@chakra-ui/icons';
import React from 'react';

export type SuccessErrorMessageDto = {
  soy: 1 | 2;
  title: string;
  description: string;
};

export default function SuccessErrorMessage(props:{
    soy: 1 | 2, //success - error
    title:string,
    description:string,
    onClick:any
}) 
{
  return (
    <Box
      position="relative"     
      bg= {props.soy === 2 ? "red.100" : "green.100"}
      color= {props.soy === 2 ? "red.800" : "green.800"}
      p={4}
      borderRadius="md"
      boxShadow="md"
      display="flex"
      alignItems="center"
      gap={3}
    >
      <Icon as={props.soy === 2 ? WarningIcon : CheckCircleIcon} w={6} h={6} />

      <Box flex="1">
        {props.title && (
          <Text fontWeight="bold" fontSize="md">
            {props.title}
          </Text>
        )}
        {props.description && (
          <Text fontSize="sm" mt={1}>
            {props.description}
          </Text>
        )}
      </Box>

      {/* <IconButton
        aria-label="Close message"
        icon={<CloseIcon />}
        size="sm"
        variant="ghost"
        colorScheme="gray"
        position="absolute"
        top="2"
        right="2"
        onClick={props.onClick}
      /> */}
    </Box>
  );
}
