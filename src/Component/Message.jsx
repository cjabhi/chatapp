import React from 'react'
import { HStack , Avatar , Text } from '@chakra-ui/react'

const Message = (Props) => {
  return (
        
        <HStack alignSelf={Props.user==="me" ? "flex-end" : "flex-start"} bg={'gray.100'} borderRadius={"base"} paddingX={"4"} paddingY={"2"}>
          <Text> {Props.text} </Text>
          <Avatar src={Props.uri} />
        </HStack>
  )
}

export default Message