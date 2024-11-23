import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import SummaryDashboard from '../screens/dashboard/SummaryDashboard'
import { PageContainer } from '@toolpad/core'

export interface AppNavigationProps { }

const AppNavigation: FC<AppNavigationProps> = (props) => {
    return (
        <>
            <Routes>
                <Route path="/" element={<SummaryDashboard />} />
                <Route path="/splitwise" element={<div>Splitwise</div>} />
            </Routes>
        </>
    )
}


export default AppNavigation