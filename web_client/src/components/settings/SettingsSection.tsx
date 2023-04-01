import React from 'react'
import './SettingsSection.scss'

interface SettingsSectionProps {
  title: string
  children: JSX.Element
  isTheLastSection: boolean
}

export const SettingsSection = ({
  title,
  children,
  isTheLastSection
}: SettingsSectionProps): JSX.Element => {
  return (
        <div className={`settings-section-container ${isTheLastSection ? '' : 'settings-section-container-bottom-border'}`}>
            <div className='settings-section-title'>{title}:</div>
            {children}
        </div>
  )
}
