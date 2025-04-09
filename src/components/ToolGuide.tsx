import React from 'react';
import { Save, Share2, FileSpreadsheet, File as FilePdf } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ToolGuide: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="prose prose-indigo max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {i18n.language === 'nl' ? 'Handleiding Verlofplanner' : 'Leave Planner Guide'}
      </h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {i18n.language === 'nl' ? 'Hoe werkt de verlofplanner?' : 'How does the leave planner work?'}
          </h2>
          <div className="bg-white rounded-lg shadow p-6 mt-4 space-y-4">
            <p className="text-gray-700">
              {i18n.language === 'nl'
                ? 'De verlofplanner helpt je bij het plannen van je verlof rondom de geboorte van je kind. Je kunt verschillende soorten verlof combineren en inplannen in verschillende fases.'
                : 'The leave planner helps you plan your leave around the birth of your child. You can combine different types of leave and schedule them in different phases.'}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {i18n.language === 'nl' ? 'Stap voor stap' : 'Step by step'}
          </h2>
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <ol className="list-decimal list-inside space-y-6">
              <li className="text-gray-900">
                <span className="font-semibold">
                  {i18n.language === 'nl' ? 'Werkpatroon instellen' : 'Set work pattern'}
                </span>
                <p className="mt-2 text-gray-700 ml-6">
                  {i18n.language === 'nl'
                    ? 'Vul je normale werkpatroon in: welke dagen je werkt en hoeveel uur per dag. Dit kan ook verschillen per even/oneven week.'
                    : 'Fill in your normal work pattern: which days you work and how many hours per day. This can also differ per even/odd week.'}
                </p>
              </li>
              
              <li className="text-gray-900">
                <span className="font-semibold">
                  {i18n.language === 'nl' ? 'Persoonlijke gegevens' : 'Personal details'}
                </span>
                <p className="mt-2 text-gray-700 ml-6">
                  {i18n.language === 'nl'
                    ? 'Vul je contracturen en de uitgerekende datum in. De contracturen bepalen automatisch je beschikbare verlofuren.'
                    : 'Fill in your contract hours and the due date. The contract hours automatically determine your available leave hours.'}
                </p>
              </li>

              <li className="text-gray-900">
                <span className="font-semibold">
                  {i18n.language === 'nl' ? 'Verloffases toevoegen' : 'Add leave phases'}
                </span>
                <p className="mt-2 text-gray-700 ml-6">
                  {i18n.language === 'nl'
                    ? 'Maak verschillende fases aan voor je verlof. Per fase kun je:'
                    : 'Create different phases for your leave. For each phase you can:'}
                </p>
                <ul className="list-disc list-inside ml-6 mt-2 text-gray-700">
                  <li>{i18n.language === 'nl' ? 'Begin- en einddatum kiezen' : 'Choose start and end date'}</li>
                  <li>{i18n.language === 'nl' ? 'Aangeven welke verloftypes je wilt gebruiken' : 'Indicate which leave types you want to use'}</li>
                  <li>{i18n.language === 'nl' ? 'Een afwijkend werkpatroon instellen indien gewenst' : 'Set a different work pattern if desired'}</li>
                </ul>
              </li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {i18n.language === 'nl' ? 'Handige functies' : 'Useful features'}
          </h2>
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Share2 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {i18n.language === 'nl' ? 'Delen van je planning' : 'Share your planning'}
                  </h3>
                  <p className="text-gray-700">
                    {i18n.language === 'nl'
                      ? 'Je kunt je planning delen via een unieke URL. Deze bevat alle ingevulde gegevens en kan je delen met bijvoorbeeld je partner of HR-afdeling.'
                      : 'You can share your planning via a unique URL. This contains all entered data and can be shared with, for example, your partner or HR department.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Save className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {i18n.language === 'nl' ? 'Automatisch opslaan' : 'Automatic saving'}
                  </h3>
                  <p className="text-gray-700">
                    {i18n.language === 'nl'
                      ? 'Alle wijzigingen worden automatisch opgeslagen in de URL. Je kunt deze bladwijzeren om later verder te gaan waar je gebleven was.'
                      : 'All changes are automatically saved in the URL. You can bookmark this to continue later where you left off.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
                  <FilePdf className="w-6 h-6 text-indigo-600 mt-2" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {i18n.language === 'nl' ? 'Exporteren' : 'Export'}
                  </h3>
                  <p className="text-gray-700">
                    {i18n.language === 'nl'
                      ? 'Je kunt je planning exporteren naar Excel of PDF om te delen of te bewaren voor je administratie.'
                      : 'You can export your planning to Excel or PDF to share or keep for your administration.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            {i18n.language === 'nl' ? 'Tips' : 'Tips'}
          </h2>
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                {i18n.language === 'nl'
                  ? 'Begin met het invullen van je uitgerekende datum'
                  : 'Start by filling in your due date'}
              </li>
              <li>
                {i18n.language === 'nl'
                  ? 'Plan je verlof in logische fases (bijvoorbeeld: geboorteverlof, aanvullend verlof, ouderschapsverlof)'
                  : 'Plan your leave in logical phases (for example: birth leave, additional leave, parental leave)'}
              </li>
              <li>
                {i18n.language === 'nl'
                  ? 'Controleer de berekende uren en dagen in het overzicht'
                  : 'Check the calculated hours and days in the overview'}
              </li>
              <li>
                {i18n.language === 'nl'
                  ? 'Let op de waarschuwingen als je te veel verlofuren plant'
                  : 'Pay attention to warnings if you plan too many leave hours'}
              </li>
              <li>
                {i18n.language === 'nl'
                  ? 'Bespreek je planning tijdig met je werkgever'
                  : 'Discuss your planning with your employer in time'}
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};