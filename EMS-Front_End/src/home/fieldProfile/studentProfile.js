import { getData } from "../../methods"
import NameTitle from "../fieldViva/pairTextField"
import React, { useState, useEffect } from 'react'

async function fetchData(setProfileData) {
    // const profileData = await getData('/profileData');
    // // console.log(profileData.body);
    // setProfileData(profileData.body);
}


function pairDisplay(){

}


export default function StudentProfile() {
    const [profileData, setProfileData] = useState(null);

    // fetchData(setprofileData);
    let component =  <p> HIII </p>;
    useEffect(() => fetchData(setProfileData), []);
    if (profileData !== null) {
        const {firstName,lastName,registrationNo,about,email} = profileData;
        console.log(profileData)
        component = 
            <p> HIII </p>
    }

    return (
        <div>
            {/* { component } */}
        </div>
    )
}