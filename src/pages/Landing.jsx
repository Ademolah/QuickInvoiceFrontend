import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/sections/Features'
import Footer from '../components/Footer'
import Pricing from '../components/sections/Pricing'
import Testimonials from '../components/sections/Testimonials'
import PeopleSlider from '../components/sections/PeopleSlider'

export default function Landing(){
  return (
    <div>
      <Navbar />
      <Hero />
      <PeopleSlider/>
      <Features />
      <Pricing/>
      <Testimonials/>
      <Footer />
    </div>
  )
}