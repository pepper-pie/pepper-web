import { Box, Typography } from '@mui/material'
import React, { FC } from 'react'
export interface DashboardProps { }

const Dashboard: FC<DashboardProps> = (props) => {
    return (
        <Box height={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} >
            <Typography variant='h1' >Coming Soon</Typography>
        </Box>
    )
}


export default Dashboard