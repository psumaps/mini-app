import Layout from 'psumaps-shared/src/components/common/layout';
import TimetableContent from 'psumaps-shared/src/components/timetable';
import React from 'react';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import HeaderBar from '~/widgets/headerBar';
import NavigationBar from '~/widgets/navigationBar';

const Timetable = () => {
  const isKeyboardOpen = useDetectKeyboardOpen();

  return (
    <>
      <div
        className={`relative ${isKeyboardOpen ? 'h-full' : 'flex-[0_0_92%]'} w-full`}
      >
        <Layout>
          <HeaderBar pageName="Расписание" />
          <TimetableContent />
        </Layout>
      </div>
      <NavigationBar
        className={`transition-all duration-200 ease-in-out origin-bottom flex-[0_0_8%] 
            ${isKeyboardOpen ? 'scale-y-0 min-h-[0_!important] flex-[0_0_0%]' : 'scale-y-100'}`}
      />
    </>
  );
};

export default Timetable;
