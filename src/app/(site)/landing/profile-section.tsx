'use client';

import { Briefcase, CircleCheck, Code2, UserCheck } from 'lucide-react';

import AnimatedCounter from '@/components/common/animated-counter';
import RecordPlayer from '@/components/common/record-player';
import SectionContainer from '@/components/layout/section-container';
import { Card } from '@/components/ui/card';
import { CornerBracket } from '@/components/ui/corner-brackets';
import { cn } from '@/lib/utils';

export default function Profile() {
  const profileStats = [
    {
      id: 'exp',
      icon: Briefcase,
      title: '01+',
      countTo: 1,
      minDigits: 2,
      suffix: '+',
      subtitle: 'Years Experience',
    },
    {
      id: 'prj',
      icon: CircleCheck,
      title: '10+',
      countTo: 10,
      suffix: '+',
      subtitle: 'Successful Projects',
    },
    {
      id: 'skl',
      icon: Code2,
      title: 'JavaScript',
      subtitle: 'Primary Language',
    },
    {
      id: 'avl',
      icon: UserCheck,
      title: 'Available',
      subtitle: 'For New Opportunities',
    },
  ];
  return (
    <SectionContainer
      id='profile'
      innerClassName='relative flex flex-col gap-6'
    >
      <div className='flex flex-col md:flex-row gap-6' data-animate-stagger>
        <Card className='rounded-none flex justify-between'>
          <CornerBracket
            position='top-right'
            className='opacity-100'
            offset={10}
          />
          <CornerBracket
            position='bottom-left'
            className='opacity-100'
            offset={10}
          />
          <p className='text-sm typo-mono typo-code'>
            <span className='text-primary'>$</span>
            <span className='text-muted-foreground'> whoami </span>
          </p>

          <div>
            <h1
              className='text-4xl xxs:text-5xl sm:text-6xl typo-display'
              data-animate-heading
            >
              Anik{' '}
              <span className='typo-display-outline text-primary'>Barua</span>
            </h1>

            <h2 className='typo-mono typo-label text-base dark:text-primary text-muted-foreground mt-2'>
              Frontend Engineer
            </h2>
          </div>
          <span
            className='text-2xl typo-display-outline top-5 right-8 absolute typo-ghost text-muted-foreground'
            data-animate-float
          >
            AB_ABT
          </span>
          <p className='text-base typo-body typo-subtle'>
            I architect scalable, high-performance frontend systems, building
            modern web applications and intuitive user interfaces. My work
            focuses on integrating complex APIs, optimizing client-side state
            and data layers, and building maintainable, component-driven
            architectures that perform flawlessly under real-world conditions.
            Beyond UI development, I leverage frontend CI/CD pipelines and
            modern build processes to ensure seamless, automated delivery and
            exceptional user experiences.
          </p>
        </Card>
        <RecordPlayer
          src='/audio/thousand_years.mp3'
          cover='https://i.scdn.co/image/ab67616d00001e027f578d3fdfad86ae99447118'
          className='rounded-none'
          showBracketsOnHover={false}
        />
      </div>
      <div
        className='relative grid xs:grid-cols-2 border-t border-l'
        data-animate-stagger
      >
        {profileStats.map((stat) => (
          <Card
            key={stat.id}
            className={cn(
              'size-full rounded-none border-t-0 border-l-0 relative overflow-clip flex flex-col justify-center group gap-4',
              stat.id === 'skl' && 'dark',
            )}
          >
            <p className='typo-subtle typo-mono uppercase text-xs typo-label dark:opacity-100 dark:text-primary'>
              {stat.id}
            </p>
            <div className='text-3xl xs:text-2xl sm:text-4xl typo-display-cond lowercase'>
              {typeof stat.countTo === 'number' ? (
                <AnimatedCounter
                  to={stat.countTo}
                  minDigits={stat.minDigits}
                  suffix={stat.suffix}
                />
              ) : (
                stat.title
              )}
            </div>
            <p className='text-base typo-body typo-subtle'>{stat.subtitle}</p>
            <stat.icon className='size-24 lg:size-32 opacity-5 right-6 text-foreground group-hover:scale-110 absolute top-auto bottom-auto transition-all duration-500' />
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}
