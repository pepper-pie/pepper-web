import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import Landing from '../screens/Landing'
import PersonSplitwiseSummary from '../screens/splitwise/PersonSplitwiseSummary'
import ReportLayout from './ReportLayout'

export interface AppNavigationProps { }

const AppNavigation: FC<AppNavigationProps> = (props) => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path="/reports/*" element={<ReportLayout />} />
                <Route path="/splitwise/*" element={<PersonSplitwiseSummary />} />
            </Routes>
        </>
    )
}


export default AppNavigation