import { Navigation } from '../components/public/Navigation'
import { HeroSection } from '../components/public/HeroSection'
import { ProjectsShowcase } from '../components/public/ProjectsShowcase'
import { GlobalImpact } from '../components/public/GlobalImpact'
import { SkillsConstellation } from '../components/public/SkillsConstellation'
import { ContactSection } from '../components/public/ContactSection'
import { Footer } from '../components/public/Footer'

export const Portfolio = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <ProjectsShowcase />
        <GlobalImpact />
        <SkillsConstellation />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}