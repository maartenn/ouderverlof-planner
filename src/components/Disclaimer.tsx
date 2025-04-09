import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Disclaimer: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="prose prose-indigo max-w-none">
      <div className="flex items-center space-x-4 mb-8">
        <AlertTriangle className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold text-gray-900 m-0">Disclaimer</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {i18n.language === 'nl' ? 'Geen Juridisch Advies' : 'No Legal Advice'}
          </h2>
          <p className="text-gray-700">
            {i18n.language === 'nl'
              ? 'Deze verlofplanner is ontwikkeld om je te helpen bij het plannen van je verlof rondom gezinsuitbreiding. Hoewel we ons best hebben gedaan om de tool zo accuraat mogelijk te maken, is deze niet bedoeld als vervanging voor juridisch advies of persoonlijke begeleiding door HR-professionals.'
              : 'This leave planner has been developed to help you plan your leave around family expansion. Although we have done our best to make the tool as accurate as possible, it is not intended as a replacement for legal advice or personal guidance by HR professionals.'}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {i18n.language === 'nl' ? 'Verantwoordelijkheid' : 'Responsibility'}
          </h2>
          <p className="text-gray-700">
            {i18n.language === 'nl'
              ? 'De maker van deze tool kan niet aansprakelijk worden gesteld voor eventuele fouten, onvolledigheden of gevolgen van het gebruik van deze tool. Wet- en regelgeving kunnen veranderen en specifieke arbeidsvoorwaarden kunnen per werkgever verschillen.'
              : 'The creator of this tool cannot be held liable for any errors, omissions, or consequences of using this tool. Laws and regulations may change, and specific employment conditions may vary by employer.'}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {i18n.language === 'nl' ? 'Aanbevelingen' : 'Recommendations'}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              {i18n.language === 'nl'
                ? 'Bespreek je verlofplanning altijd met je werkgever'
                : 'Always discuss your leave planning with your employer'}
            </li>
            <li>
              {i18n.language === 'nl'
                ? 'Raadpleeg je HR-afdeling voor specifieke regelingen binnen jouw organisatie'
                : 'Consult your HR department for specific arrangements within your organization'}
            </li>
            <li>
              {i18n.language === 'nl'
                ? 'Controleer de actuele wet- en regelgeving via officiële bronnen'
                : 'Check current laws and regulations through official sources'}
            </li>
            <li>
              {i18n.language === 'nl'
                ? 'Houd rekening met eventuele CAO-bepalingen'
                : 'Take into account any collective labor agreement provisions'}
            </li>
            <li>
              {i18n.language === 'nl'
                ? 'Documenteer alle afspraken die je maakt over je verlof'
                : 'Document all agreements you make about your leave'}
            </li>
          </ul>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {i18n.language === 'nl' ? 'Belangrijk' : 'Important'}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {i18n.language === 'nl'
                    ? 'Deze tool is bedoeld als hulpmiddel bij het plannen van je verlof. De uiteindelijke verantwoordelijkheid voor het correct aanvragen en plannen van je verlof ligt bij jou en je werkgever.'
                    : 'This tool is intended as an aid in planning your leave. The ultimate responsibility for correctly requesting and planning your leave lies with you and your employer.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};