import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import SummaryDashboard from '../screens/dashboard/SummaryDashboard'
import PersonSplitwiseSummary from '../screens/splitwise/PersonSplitwiseSummary'

export interface AppNavigationProps { }

const AppNavigation: FC<AppNavigationProps> = (props) => {
    return (
        <>
            <Routes>
                <Route path="/" element={<SummaryDashboard />} />
                <Route path="/splitwise" element={<PersonSplitwiseSummary />} />
            </Routes>
        </>
    )
}


export default AppNavigation