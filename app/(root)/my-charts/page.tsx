'use client'
import React from 'react'
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";

const Home = () => {

    const {user} = useUser();

    console.log("user", user);
    
  return (
    <div>dashboard</div>
    
  )
}

export default Home;