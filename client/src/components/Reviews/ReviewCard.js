import React from 'react';
import {Avatar, Box,HStack} from '@chakra-ui/react'

const ReviewCard = ({review}) => {
  return (
    <Box w={'80%'} display={'flex'} gap={'10px'} alignItems={'center'} >
      <Box display={'flex'} flexDir={'column'} alignItems={'center'} justifyContent={'center'}>
      <Avatar src={review?.user?.image} alt={review?.user?.name}/>
      <p><b>{review?.user?.name.split(" ")[0]}</b></p>
      </Box>
       <Box>
        <p>{review?.text}</p>
        <HStack spacing={1}>
            {[1, 2, 3, 4, 5].map((index) => (
              <Box key={index} as="button">
                <i
                  class="bi bi-star-fill"
                  style={{
                    color: index <= review?.rating ? "#ffd700" : "#d1d1d3",
                  }}
                ></i>
              </Box>
            ))}
          </HStack>
       </Box>
    </Box>
  )
}

export default ReviewCard
