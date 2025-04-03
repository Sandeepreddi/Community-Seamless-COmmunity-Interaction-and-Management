import React from 'react'
import Header from './../Header'
import SideNav from './../SideNav'
import Body from './Body'
import './../ResidentHome.css'

function ResidentBilling() {
  return (
    <div>
        <Header /> 
        <div className="admin-container">
            <SideNav />
            <Body />
        </div>
    </div>
  )
}

export default ResidentBilling
