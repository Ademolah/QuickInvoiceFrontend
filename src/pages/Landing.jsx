import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/sections/Features'
import Footer from '../components/Footer'
import Pricing from '../components/sections/Pricing'
import Testimonials from '../components/sections/Testimonials'
// import AppleParallaxSlider from '../components/sections/AppleParallaxSlider'
import POSBespokeShowcase from '../components/sections/Pos'

export default function Landing(){
  return (
    <div>
      <Navbar />
      <Hero />
      <POSBespokeShowcase/>
      <Features />
      <Pricing/>
      <Testimonials/>
      <Footer />
    </div>
  )
}