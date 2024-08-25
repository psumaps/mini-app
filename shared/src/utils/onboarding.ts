import bridge from '@vkontakte/vk-bridge';
import image1 from '../assets/onboarding-image.b64?raw';
import image2 from '../assets/onboarding-image2.b64?raw';

const ONBOARDING_KEY = 'onboardingStatus';
const onboardingText = [
  [
    'PSUMaps - компас Пермского Университета',
    'При помощи карты можно найти нужный корпус, библиотеку, столовую и все что есть в стенах кампуса!',
  ],
  [
    'На отдельной вкладке события на любой вкус.',
    'Используй фильтры что бы найти нужное, а в карточке события найдешь все подробности',
  ],
  [
    'Вкладка учебного расписание',
    'поможет попасть на все пары! Кликай место проведения и увидишь на карте нужную аудитория',
  ],
  [
    'Приложение создано как для студентов, так и для',
    'гостей нашего университета. Не забудь авторизоваться для доступа ко всему функционалу - инструкции в Настройках',
  ],
  [
    'Сейчас на карте есть не все корпуса',
    'Но со временем список будет пополняться. Следи за обновлениями в нашем телеграм-канале (ссылка в настройках)!',
  ],
];

const setValue = (value: string) => {
  return void bridge.send('VKWebAppStorageSet', {
    key: ONBOARDING_KEY,
    value,
  });
};

const showOnboarding = async () => {
  let alreadyShow = await bridge
    .send('VKWebAppStorageGet', {
      keys: [ONBOARDING_KEY],
    })
    .then((data) => {
      if (data.keys) return data.keys[0].value;
      return false;
    })
    .catch(() => {
      return null;
    });

  const leftLaunches = Number(alreadyShow);
  if (!isNaN(leftLaunches)) {
    if (leftLaunches > 0) {
      setValue(`${leftLaunches - 1}`);
    } else alreadyShow = false;
  }
  alreadyShow = false;
  if (!alreadyShow) {
    void bridge
      .send('VKWebAppShowSlidesSheet', {
        slides: onboardingText.map((s, i) => ({
          title: s[0],
          media: {
            type: 'image',
            blob: `data:image/png;base64,${i < onboardingText.length / 2 ? image1 : image2}`,
          },
          subtitle: s[1],
        })),
      })
      .then((result) => {
        if (result.action === 'confirm' || result.action === 'cancel')
          setValue('true');
        else {
          setValue('5');
        }
      });
  }
};
export default showOnboarding;
