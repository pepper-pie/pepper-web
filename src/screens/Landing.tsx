import { Box, Typography } from '@mui/material'
import React, { FC } from 'react'

export interface LandingProps { }

const Landing: FC<LandingProps> = (props) => {
    return (
        <Box height={'100%'} display='flex' alignItems={'center'} justifyContent={'center'} >
            <Typography variant='h2' >Coming Soon</Typography>
        </Box>
    )
}

export default Landing