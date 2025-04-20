import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LeaveInfo: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="prose prose-indigo max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {i18n.language === 'nl' ? 'Verlofregeling bij Gezinsuitbreiding' : 'Parental Leave Regulations'}
      </h1>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900">{t('leaveTypes.GV')}</h2>
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>{i18n.language === 'nl' ? 'Eenmalig verlof direct na de geboorte' : 'One-time leave immediately after birth'}</li>
              <li>{i18n.language === 'nl' ? '1 werkweek (5 dagen bij fulltime dienstverband)' : '1 work week (5 days for full-time employment)'}</li>
              <li>{i18n.language === 'nl' ? '100% van het salaris wordt doorbetaald' : '100% of salary is paid'}</li>
              <li>{i18n.language === 'nl' ? 'Op te nemen binnen 4 weken na de geboorte' : 'Must be taken within 4 weeks after birth'}</li>
              <li>{i18n.language === 'nl' ? 'Wettelijk recht, kan niet geweigerd worden door werkgever' : 'Statutory right, cannot be refused by employer'}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">{t('leaveTypes.AGV')}</h2>
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>{i18n.language === 'nl' ? '5 weken extra verlof (bij fulltime dienstverband)' : '5 weeks additional leave (for full-time employment)'}</li>
              <li>{i18n.language === 'nl' ? '70% van het salaris wordt doorbetaald (via UWV)' : '70% of salary is paid (through UWV)'}</li>
              <li>{i18n.language === 'nl' ? 'Op te nemen binnen 6 maanden na de geboorte' : 'Must be taken within 6 months after birth'}</li>
              <li>{i18n.language === 'nl' ? 'Kan in delen worden opgenomen' : 'Can be taken in parts'}</li>
              <li>{i18n.language === 'nl' ? 'Eerst moet het reguliere geboorteverlof zijn opgenomen' : 'Regular birth leave must be taken first'}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">{t('leaveTypes.BOV')}</h2>
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>{i18n.language === 'nl' ? '9 weken betaald verlof (bij fulltime dienstverband)' : '9 weeks paid leave (for full-time employment)'}</li>
              <li>{i18n.language === 'nl' ? '70% van het salaris wordt doorbetaald (via UWV)' : '70% of salary is paid (through UWV)'}</li>
              <li>{i18n.language === 'nl' ? 'Op te nemen in het eerste levensjaar van het kind' : 'Must be taken in the first year of the child\'s life'}</li>
              <li>{i18n.language === 'nl' ? 'Kan in delen worden opgenomen' : 'Can be taken in parts'}</li>
              <li>{i18n.language === 'nl' ? 'Geldt voor beide ouders' : 'Applies to both parents'}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">{t('leaveTypes.VD')}</h2>
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>{i18n.language === 'nl' ? 'Reguliere vakantiedagen' : 'Regular vacation days'}</li>
              <li>{i18n.language === 'nl' ? '100% van het salaris wordt doorbetaald' : '100% of salary is paid'}</li>
              <li>{i18n.language === 'nl' ? 'Minimaal 20 dagen per jaar bij fulltime dienstverband' : 'Minimum 20 days per year for full-time employment'}</li>
              <li>{i18n.language === 'nl' ? 'In overleg met werkgever op te nemen' : 'To be taken in consultation with employer'}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {i18n.language === 'nl' ? 'Meer Informatie' : 'More Information'}
          </h2>
          <div className="bg-white rounded-lg shadow p-6 mt-4 space-y-4">
            <p className="text-gray-700">
              {i18n.language === 'nl' 
                ? 'Voor de meest actuele en volledige informatie over verlofrechten bij gezinsuitbreiding, kunt u terecht op de website van de Rijksoverheid:'
                : 'For the most up-to-date and complete information about parental leave rights, please visit the Dutch Government website:'}
            </p>
            <div className="space-y-2">
              <a 
                href="https://www.rijksoverheid.nl/onderwerpen/geboorteverlof-en-partnerverlof/geboorteverlof-voor-partners"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {i18n.language === 'nl' 
                  ? 'Informatie over geboorteverlof en partnerverlof'
                  : 'Information about birth leave and partner leave'}
              </a>
              <a 
                href="https://www.rijksoverheid.nl/onderwerpen/geboorteverlof-en-partnerverlof/vraag-en-antwoord/recht-op-ouderschapsverlof"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {i18n.language === 'nl'
                  ? 'Informatie over ouderschapsverlof'
                  : 'Information about parental leave'}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
