import Contact from './landing/contact-section';
import Experience from './landing/experience-section';
import Hero from './landing/hero-section';
import Profile from './landing/profile-section';
import Projects from './landing/projects-section';
import Skills from './landing/skills-section';
import { ConsoleBanner } from '@/components/common/console-banner';

export default function Home() {
  return (
    <>
      <ConsoleBanner />
      <Hero />
      <Profile />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
}