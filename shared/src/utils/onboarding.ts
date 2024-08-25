import bridge from '@vkontakte/vk-bridge';

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
  if (!alreadyShow) {
    void bridge
      .send('VKWebAppShowSlidesSheet', {
        slides: onboardingText.map((s) => ({
          title: s[0],
          media: {
            type: 'image',
            // blob: `data:image/png;base64,${svg}`,
            blob:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAABGdBTUEAALGPC/xhBQAAAYRpQ0NQ' +
              'SUNDIHByb2ZpbGUAACiRfZE9SMNAHMVfU6VFKg7tIOKQoTqIXVSkY61CESqEWqFVB5NLv6BJS5Li' +
              '4ii4Fhz8WKw6uDjr6uAqCIIfIM4OToouUuL/kkKLGA+O+/Hu3uPuHSC0qkwz+xKApltGJpUUc/lV' +
              'MfCKIMIIYAJxmZn1OUlKw3N83cPH17sYz/I+9+cYVAsmA3wicYLVDYt4g3h206pz3ieOsLKsEp8T' +
              'Txp0QeJHrisuv3EuOSzwzIiRzcwTR4jFUg8rPczKhkY8QxxVNZ3yhZzLKuctzlq1wTr35C8MFfSV' +
              'Za7THEUKi1iCBBEKGqigCgsxWnVSTGRoP+nhH3H8ErkUclXAyLGAGjTIjh/8D353axanp9ykUBLo' +
              'f7HtjzEgsAu0m7b9fWzb7RPA/wxc6V1/rQXEP0lvdrXoETC0DVxcdzVlD7jcAYaf6rIhO5KfplAs' +
              'Au9n9E15IHwLDKy5vXX2cfoAZKmr9A1wcAiMlyh73ePdwd7e/j3T6e8H50Fy1eLfFrIAAAAGYktH' +
              'RAD/AP8A/6C9p5MAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfoCBMIBgVsPIJOAAAgAElE' +
              'QVR42u2deXwcxZX436vq7jkljW5L8iFfsizr9o0JNuYw92nIskAwECDghATIbgiwCeQmZEOW4AW8' +
              'BIONuQwB4hiDb2OMb52W71vWfWvu7q6q3x8m/DCaHsn2zGgkz/t8/I8ldVe/962q9169qgKISUxi' +
              'EpOBIhjpF1YVzzEzl0uhVttEvbltGjB+ehsIojwkdR/zedcKv6YlzLzAM+qN/xYxU50uNZOvldT6' +
              'RrMpZ2SadqLhCtbtSgSAb+oJ0Sx7lcz0Ff6jdXXEavEVH9usDyqwqiZcitzlSQIJi1GW72JtXRcA' +
              'pQ5gLDFgGyTqAsZa0CQ3kQT7s+Bne4WmHSo+9iU/34Had+3dsreiJo9YLXN4l3ueQIgDLtKBc6mn' +
              'dZEDYiMi+ICQl9BqXienp+2bsPkD74AHa8/MuSatofUG5nLdD4xfCAIkEIL08c8FIGoo0VqQpX8g' +
              'pc9KiYmt+buWs/MNqIqhU2RpeMYErbbhMaGxy4HxJACQzuAROspSF8jScmVE5u+143WHio9v5QMS' +
              'rOqCy7M51x5jbd13AOOOc2spMlSkw4j4Z8HZ30rqdurnC1Q1k68do55suEsI8QAwnnJOdkPgQEgD' +
              'KtLPbVOK38t5/xX/gAKrLH3ieKTkDaGziWcwQvVFPMRhf4eYzc8VVq/eN9ihKksvnY6y9IpQ9Qkh' +
              '1SPBbprseFOKj//VhK0fNQ0IsMozJo0XnC8FLorD8g5Ejoq0G7iYV1K/o3wwAnXo1odk9979s1lj' +
              '+0sAMDIsLyGoSimO15XU1CdyN7zbFtJHh3z6K7liGCAuAS5KwjYiCkGEXysUOnurLH1i8WCD6sj3' +
              'HpG8R4//G2vreiNsUAEAcKHobV13+dvb7ts95WoatSPWLns+pWnxT3G3/6mAUcrpo44XhHChRBlJ' +
              'sB9EQGBOd7ZQNTNQtAATtj61j+BeVOTbqNVSVbh/w4BPS+y7/m70Hz95BWvp+D9QWVbfAhxoB0BG' +
              'LCY3Ws3HhV9N405PCgBIgJAIohc9Iraj2fSAdfyYD8Z9tiQkOpRCqRR5dMZ39PrWR4I+F1EDgDU0' +
              'Ke59wfkK4fEzarOpiAjc55cFY0TOSL1Ia2y9Dhi7AgSkBgWMi/GA+BqJs88FgKMDOvIbNg09Wyqm' +
              'AcACEJDVl2AGuNhAUhOe4w3tnajIXIqL0xm4KHd5KLGYkwXnjwIX1whVyzDUoxBJKOFjakvLRgBo' +
              'iaoRa//V80ye3fveEx7/tUbPRYkep6mJf2GtHa9JKQ5nQdWagL1jzwU3otrZQYDDNND1/+Rd7quC' +
              'wkqQkTjLczQp4ZcF2z9RBypY1YWXjddbOj4WOhsb1Giy1AEE/48mxL/Kvb4jxUe+MEy/VI6dSQEh' +
              'j3U6nwCAWw0DAIJ+OSPtMWIxvzRhy0c8asCqzJt9JevsXgoaSzR4015AvMNWlFc1btWbfU4VVIyb' +
              'GSe8/idBZ/OFptuD9GA3MSlPoN2yoGjv+gGX56ocN9MkOF/Iu9x39BL9fSkPS/8v3uX+oujwpj53' +
              'ovLMKUkgxF+Frt9m2PFN8gZz4bhrxn+yxB0VYB248i7i3nfwZ8Ll/V3AX6BElTJS5xWWf/r22Tx/' +
              'd8lVFq7r97GOzl8Kv5Zk+DFm5Qixmp5k7c62AcaVAEqmAeNPAIAlSOf5EgC+V9pcdvisovVh05IB' +
              '+KvCp10f0PYE3WhSbik5sXVlVIBVmTsrkfv864XbVxRIaajIbxKrZX7RwY3Os31HzQU3KdzpfFBv' +
              '7fi10FlcUCMNXEFjBx23AuIdpU27jpzLC6qKL5+s17d8BgICzSycJNrnW8eNXZiz/LVzmg5Dkm5g' +
              'bV1m4fYFdjYJ6UJFfvtcoAIAmPDl31UAXAiS9DoAaL0YZ6D+A4Mpag9alXOGCgCANbaVgYDXDTog' +
              'AZ3f6zt0zN7veayy1BIKAI8AgNGSTR33+TeFAuCC6lVeoaqPg0SXAuL5UfEg0W6anPiHuCkTj4Xi' +
              'cSWNuxiNt9cBIQH9XO70DNVbO6R+B+urnjY6YNSGyKRUx3plWEbIIrXSpjKPkpX+VyB48jzAigHj' +
              'C4RffW/MewtCtmAsDU1fBgDN4XSPSFjVIoTOvb538rcvD2kKwLf3aDki/hcgDuoyGpSlYzTevqho' +
              '3/qQ6s9fc6gDONfC2XYSbuXwbk/I80qT3HsEsds+Q4l+MWiposRHkhL+h9qsh0JPbPjL8KSBqvei' +
              'gxsbq4suf4H5fB4Qgg4yrFD41CNIyJL8yk9D70sqEoKq44AGizjs8ccuexSz3/pzyBVkLy78kPt8' +
              '6yIx8kacLElyjlr6l7CsIigZaVPVk43xwHgUg0XwVOAqRCA3UEZC5jtrajYDgC/UjR/5xp84AHRA' +
              'TM5ItPqmWUaFl2hWOogk8XNdMTznni6nJ3MpxVEJBHs6gwII6+jO1ZpapZg5o0Oqxl9iBg5DjFxi' +
              'EmdeaM4b4+p3572gajUHs/w6CNEV+A1kCLXbL4iZNDqEq/5cAXCrQVpBsHbXiXEr3tD7HSwAAN7u' +
              '9KAiB86sM+4Qgs05cOU8U8ys/TxaFc2RUKb3AmPWwNOPdFRKTd4bNekGKdHRCYBvQuBlAuQ+9Xbf' +
              'yZM5MdP2c0AgS4Xc6b0+oN0RAAnWcKdrf9SAlV/+iU7iLDtQpp0B4VK1VOHz31+Ve3HM1+onqcy9' +
              '2K43tjwiVG1oYOqIW0pL/j/z6GweNWABAMhpaWuBkAqDUYswp+cuoeuXx0zcT76Vrk4VGrvewLcC' +
              'YpKruNe/NXftWyKqwGKdXV40mxcCQV9AuBiPYx7v/IphU9NiZo7waDXqwsnC6VsInAcuN5KIBy3m' +
              'hUV714Wsji1kYBVUfibkhLi1aDEZL7No7Eog5IU9M26yx8wdGdlz+W3xgpKngfNRhr6XSfmUWMzv' +
              'hvK9Ic1YT9i1okVKS/odSrTV6Bu4ql6tObuv3D3jehIze3ilLL1U8dUcfIx3uS41hIqQTmIxv1BQ' +
              '8ak3asECAACdbQXEJYAQ2AnUuZ01tj+vHjgxM2b6MIuAbFDZwyCEEtj66CfJcc+wvSc3hfrVIQer' +
              'oOxTvzl35AJit9QYx70wBC2mopjlwyvykJROtJgOGNsBGbFaW0rhII96sAAA1Oa2TOHXhhh+j0SP' +
              'yMmJ/4yZPsyRIIgWEm9/CSgJvOuGcStr67ht7yW3JUY9WLunXWcWun6PUPUUg9FKo8mOl4jddjRm' +
              '+vBKUdVqQa2W99GsbDWEz+O/TG1omr3/6rsxqsECzqfwbvc1hqOVzVxObJZ38za9z2KmD7+YszLd' +
              'xKy8CAQ9ge0lFO52/1Dv6rJFLVj75txp1Vvb7waNJQd+G/GgWXlNjo9viJk8MjLmw1eEdULuKjTJ' +
              'qw19fJVN0js6bohasPz19Xn81Bb7U5Pet4ViFbFZ3xv32ZuxM0UjKGM/eMVDHPZnAbHbIJK3C796' +
              '0+4LboiPOrAqiy8jwuW5HxiPDwgVgkZM8ouFO1fGCvP6Q1StEhVqmATl3d5LmMs5NurAEl7/BO5V' +
              'ZwEADQgWIZ8Th/2jmIX7yZHf97kHreYPQSKdgQ0o4lhz55NlmZNp1IBVMXy6JDrdNwDjowKPVqjR' +
              '1IQlheWr3TET95+YRo3YiLK0EwzKm4CL7yDijOgZsQimAcIPjHwrtJr2IJI1MdP2ryj2BK+UmrgA' +
              'CKoGo1YSmuTrqovmmPodrOr8SwmalO8LIZICPo+gjoQsKqxaUxczbf/K6PcXCKTKFmKz7DDigXt9' +
              't4FCk/sdLJqenMC93ouBC3Ng3wprJUfCxzGzRofkb/9HE3CxAggGrmtnIoW1d91ZMf4i7FewfHsP' +
              'FwifNtXgxwwV03LmdNfHTBo9Irh4DYSoN5gOFeHxX4IMk/oNrMrR37ERWX4UhDAHHs6IEzh7rejg' +
              'RjVmzugRediQDpLqWAIAzAC8WYKznH4Di6QnJnK/OhmMjx5cY54w9mDMlFE2HW7+UEONr0RZCrx/' +
              'kHMKIP69Mn+23C9g6bWN3wUu0gwiRQ+1Wj/Vjzd4Y6aMPiEWS5lgfKuhE+/yzaFWW3LEwdp35R0K' +
              'EDLK8EAOxCbW7VpWsHdtbPkmGv0sCn4p1bEGKBrdpTNcb++8MuJg+aoOjAO/dqfBNChoUvw75nGj' +
              'YqNVlEph2adcqNpbwCHwDnbGTULXC/ZffqcSUbAEQIpgPHAijaKfOz3bx697R4uZMHpFSk/uoA6b' +
              'ccGlqv+7Z//BoREDq3zENAoAj4HRaTWU7rQUjFsXM110y4RNH3q5219mdBCb0FmClJI0NmJgSY6E' +
              'FKGzIRB4XVCgTE94K/c5Y6aLflFGD12FihT4ej4hTHpT67zyYVMxImCxru45gFBg4F95JUfCwpK6' +
              '7TGnfQCI/1jdEaEzo8JLFKqeIiU7TGEHq+6Hz6DgPBEYD+zUUeLR2zqPx0w2MMSUnsYlR/xKMEiW' +
              'AsUZrNM1J+xgta3dmIhIbjX8BcS3aUJCbAlnoPhZO5YLva1zDYDhPlAL1/wJYQeLdXebucdn7NDp' +
              'rK5w96rYEs5Aig7TkpxoNdUaQmIxz66eeJUprGBJWUPygGDAl6BE3VJSwsmYqQaW2PLGHwFN/9Do' +
              '59zpnaXVNYUPrIoR01Gvb7kDBMQHDiLEUZKetCJmqoElo5e9yAUTbsM7KTgn1BF3RuuGZ3QQGu90' +
              'AyjUajxPcl3dfdgXSaWUD5uCIkQXfhGUoPjElrN+WMWIach5CLZLCgJysgMKKj+LWGQtZyRXaE1t' +
              'TtADHHUkkWRiNt2ye9LVr+TvXCFCDpZtWpHFvXufHdSANWKCJsUfICYThwjdFlgxckay0NlLoGmO' +
              '0GhXtFVkz3ig+Njm7jP905oZN17mP3ryJ8C5HAKyUDC2Yt/M7y7I3fhuRFYvhEw/BybaASAugANv' +
              '1RpapyLiQujjtX1nBJbv+MliBJwqjLRhlt9OnD5Ng6pVEQFLSUvxqC2tzcLnvxlCUb+fYFouxcdz' +
              'OHbmf8o5awOdXQRCnPPZX6jITULw30QKKgAA/VijbhgZnvpAEGdw4cAZGYO1dcYLVTPa1Cj0+raW' +
              'oS//KmLDd962j73c4/8FmuX1cO4XYArh9S3L37H8rM441w7WtoAQ5z4PIjI0yW9bRo/cHEmXAs0K' +
              'gCz5DX9ukq3WKYVyWMCKRokvyetQhmX+gsRby4P2uL6Q5VXPPk0SiiM1EHQkuEj41F/m/ONveiT1' +
              'aMkZ5ZPSEj8z1CGl07SG5uywgIVmmYLhDfWSjlZzxA/6GLNysZBstq3y0Iy7QKYfA4DeH4DTeBtD' +
              'i9J19tOf1E7ttgUoSY+V1O/ojnT7c9e+7edu9xqjkV94fWlaQ0tcyMHad9ntkpSSOBXQ4NRdm/mw' +
              'aWhGa38YddzqpXzCxvd3g4B7aUbS3UCwAgieUS0YmuQOeUhK81n3+PzcNhJne++MpmQEARJtImbT' +
              '58Rqvk7OSH+8+OS2bugn4Z0e44j+1H1JfR6X++y8aw0tMvf7Z4IIDBZneqUpc0i/7h0sbdjZceCC' +
              'B95ytez6EGVprvD6h6NJkklC3Eih6528w9UMIGQQ8BAAfLvstloZkbULqs/u3Tkfv+ovSy/dGzB5' +
              'kGBbxbvcm9EkycQRN0qoegfvdDYDEqYMz1yrt7RXFx3c5IFBtDugz2DpHZ0UOM80mgqFy9c+etn/' +
              '9nvFaM4Hr3AAcAPAG//6v8Mzfmij9jgt+2+/V2tmzh3jP3BsHuinH7Uk/JrbvXbHuV1OxEXA0YqY' +
              'lAZTbvpvx2/6gB++YL6dxsWp2X/7wyl/rmkXDEbpM1hC1Qassz/63Re/PjNCq2u6BYTIDBCNAcSb' +
              'EM6haxC7xce9fh3Yabks1Fs6i/XWTgoAfPR7C1xwHsh5dyQ273IlAeP0W74Op0nxh+T0lHNKWSjD' +
              'MrehRI8FSGQAWpRBQAvGwAokx+/7OYJEaADH1A8Sfb2gatU5pSv8B4/VC7/W3mMwlKnFMj5noN/I' +
              'gXRIki0GVgBx79mfSqyWSYFmetbUfs7RmNBZ4FBdQLb/8PFrqyZcggNYfYK7vP7Ig0UJbXrqz1Gt' +
              'OP+REync5Snu0RUloqFJOecVAyUrjdMURw0Anj7y6czEOrpTWWfXgO6Yotujhx4sDM4MibOmuQ4f' +
              's0W1YjSdABdSz3SAfYNp1PD2c31+fsVnGpqV1wCFFqDjEfvU0vNmdugzWMRu4WgxGZ/IJyDHd6I2' +
              'PapD4KFpaYESvKzLtTnv82WdoXiHXtvcAQHqeGi8rVhrbY/uy6mwH8AyDc3UpaT4LWCwliScnnHq' +
              'sZNR66BW5V1Cucd/H0CA6ledh+zKDzTJHCjpMWIxp+dC/9ETCdGqnyN3PEqlrNRREQdLzkjTua5/' +
              'DkZrSZwToepRGwzore3IO7qzeyxLEMKJ1RyyxK5pZFYLsVu29WwAk4RPi1of1F1RZREu7+2h8rv7' +
              '/JAx7y7grKmjDYKthSFGreLQbJBHkkijMiLzi1C9h4Po4C5vVYBpBmlGsjVa9aO1tFPW6RoOxkdS' +
              '+agjTg05WH2xnZTimLn3wptoNCrOnDt2CCpyz1oyVe/2HzlxOFTvUfcfF8AC1CcjsRAq37xn+g00' +
              'SjtecBZk+qVp1IijYQGLOuK8qEhG0wbRO7pv8B2tlaNRcerRExcKzkcGnMb9oau0QbsV0Gr2APlW' +
              'yoFzRWtomeU/XheV7oKUkjgJJGLoAwq3r9lTUeMKC1jmsSOrQKI7jecBrsgjMqOyR7JOpwN0Zv52' +
              'FERs5k6aYA9Z1WvJ0c3CNDxjNVDSs/KfMUloejSqB/T6lhnAuPH1coRyxL7jckZgOT9Z1ym8fsOt' +
              'EkjIMO50zYpSNyIQPCpJSlhoGTcmpDuL/CfqK0BjzoAqSo6LOsUcueMnFCQSb+g9U+KSM5I3KsOG' +
              'iLCAJeeMBGK3NQBi4JSDzhL1po7CaFPcwbkPIloVUwDUuF7XXJOzYlFIbxgVHn9gB9iiJJqzR6RG' +
              'm366v9yZA1zcZjwTiU5B4J8TdvwzPGAVHfhc0FTHywBgmEwkFtOF1UVzEqNJcXpnl4XG2ScZKC2C' +
              '87HI1k42jou6odyvJQpVNz5vVJZcrLXrjHYMnbEjqTe0toFEPYZwe/0ztKbW5GhSnP94nZU7PRdC' +
              'SHPLQZQaZ+XEovSYCoWq2bSWdkc06aYybzZBs/IABKnNIzbTQnPeWHdYwZIciW34jerMAPzbidn0' +
              'g8qxM6Mmp8W7uin3+HpGPIiAUuhjDdOIoTpNdnwJGGCVgvOoyvUJrz+BO93jDTsdIarwqrXjVy7h' +
              'YQWroGqlDhI9AoQwAxeZck2baMkfa4lqtx0A0KR000RHyMup5dRkBpTshlDt/Q+najT9FgCYaBiQ' +
              'yXSHJW/M+jMetc8qVyMrH4MQFcbzJZ/i3ll9cXRrFABNUqOUkhjyXTFj3vtfpje1nwCIbrCqJ19t' +
              'RYtyGQgRmAMEDpTszv1saVtEwCJWpZMk2HYZKo5zC3BxT/mIaZaohguhUUpKDMt2K+FTdYhyEYKP' +
              '5V3u2cb6QS9Ndiw8K0bO5o8Kq9cw8GuvAqLR2hEKXZ9JzebCKIYKQAg/MclRD0A4pCxzsqSfbH4c' +
              'Tl0HaOQqbBVe7cTZPF86e8OQGkR4WwiYZ9AdkpjbM78yZ1ZF0YEN/ujrrgBAiI35/Ia7HGqmXIcg' +
              'jGezCTuWD9gDfBGwWHARbLRSQdPfLdq7tjWiYBUf/9JTkTtzhehwzgUe4IQVASgYv174/S8AwM4o' +
              '1a9VGIC1u2iOGRi7BgCMKhJEddGc1QWVnzUONKjKx11kEp2ueSBESpCet08gvnO275DOpYHEblsj' +
              'PL4a4VWnBAxXdRYnCPlD+fDp15ac2BJ9158wkcCd7oBX4jG35/vc6/s1CJANXRQhyqsmXPrvhTVr' +
              'ehyPSRKsFt7licoyImq3TtK73P8GIIxcIUYzkhcomRluqN9xdmycSwNtOWO7SIL9OSCGF/2gULVJ' +
              'KNgV0ehjCa9/qNrQ1GOVoGLUjFzm8jwgVN0hNN1m8M8OXExnLvetO2HsaQDtu+x2mcTHTTc656I/' +
              'pWbqdUmsvftJYNzYt7IoO5GSFWeauwoZWKPf+h8hJSetR5O8PcivJYAsP15dfHlG/3VREnAziNB0' +
              'mbs8p43aVWO+IwHjzwDj+b0+l3NJeP1PKhOGX/bN//YfPynz9u6LQUTX9rqKYZOJdrLxZuHxzQbj' +
              'VQivQFxsHjXqnI5UP/erezdUdQi//hQgGu5t4k7PJL3d+dMj8x7rF0UrQ4f4qMNeZejEf7OtOp8q' +
              'dDax7yMfJnCX5+rT5pGObsLd3p4jAqU6ibP6+gssaXjWKIHwH8CF4QnIKJGDUrz1rZz3Xxb9CtZE' +
              '2C+IxVyGkrQajBOCRDD9Jue2nVPLrUURnx5Mo7NdAvinPdqHgDQrOeXIHY983Sa0mrfJGak/AIB1' +
              'AZdkTh8JW6nD/lciyb857WMdtsDVDQo9qIwYVt0fUFUVXBavHqt7Wvi1McbfQ91oMT9RWL3unHcs' +
              'hWQEKT622S1lpDyPimx8jJGqZ/Nu70K5YHhWpJU69t0FjHe4uwKZWrj9P3LtqvzagS/as1bP37li' +
              'DSryncRu/QdIxBVglOIo02NI8VbzyOE/Kzz8ecs3fyynpZSATHuUQQuf2qbW1jZF+vur82cjyPRG' +
              'ZPymIFMgR5l+TO3W9aF4Z8imJsH0bYKxp4MkTUHoLFdraX+oLHOSFGnlEpOi9ygXFgJ5lytbb+vo' +
              'oYeSuu31yoih30Oz6R5AbAL8erRTicO+WEpy3ISStGHcp0tO+96KoVNQPVZ3Beg8QIUH6tzpjXju' +
              'S+/2TNHrmn8pGDdcCUFZapKGJP+6oGq1J6rAKqxYxeTU5OVoUrYEdXadnh8RRbmvKu/SiJYwK6OG' +
              'rUWJ9tw0QTBOSk0eHuhv8ta/6xRd7vdpQtydJM66Dk1yOyrysyTe9sOC3WvKi49v7QGJdVKBdKoa' +
              '81vbzBB9NCn+YyU9JaLHae67al4KStKzwMXIIFO6G+3mZ3hLV8iOfgupM11QvapZqOp8lOmRIL9m' +
              'F4w9RezmKZFUsK/mcK1QWUcA5z2DdXVfYvR3pe2VoujgxtVSZvrtxGK5Qskc8uvCnSsNa5M81fuH' +
              'CSauD5D18rHWro/zz/FEmzORsrRSxVuz9xHu9kwPGn+YlA3m0SPfKjq2mUUlWAAA1ryc/TQh7iVA' +
              'NFyDEz41Qz1W/2RZWknEdk5LmSmcJMVtAkT2LYMTVKTS3dNvDHruRP6mvzcVHdy4Y8KOfwStpESr' +
              'kg5+LaVnbshUT1MTInZ5VdX42TIxKz8RHvUR4EIJEtVuE37tx7krF4f04tKQg5W7/h2dd7tfQkV6' +
              'FYzuwANAEOIqJORvFcOnR+S8h8Lq1RwEewuE+LZxUXj9N2on6s65HeVDpym8w/0EAPQM5xn7WElL' +
              'jcjhvwevuZeiSb5J6OznAGBcYSJRtzQk5S+ljTsPh7wjh+PDiuu2u/fMnPsb9WTjRN7tnmwElxDi' +
              'apToc7snXfNw/s5/doZb4TQurgE0VsldvmmnBxXcjmZpXlla6QIQ4uycayFASknI1lva83pEXhJ1' +
              'kzjb/vEbl0XEv/K1No/XO7ueFpoerAxaRSTPC7f3o7DMEGGbemRTvQbwBFDyJjAeeDTgAoXHe4uI' +
              'sx7af+Vdz41b+UZY1xNNmUOa3I2tmwBh2rcyWpLwqT8DgIfO+uGIoNW3SCBEz/1djB8EJMvCDdSB' +
              '6+4l/rr6Yu1o3XPAxbggbWXEbnlTaPrvig5vCkvCNmyZ8Jw1SwX3aetAiLsBocU4TcHNWkv7o/7m' +
              '5tsP3vpQWCPFnOWLBFLpbwAY6NJHBU4d0X32/4RICKBTTtMS36UpjrBn3LWuzhK9tWMxcHFxkHwV' +
              'ELulTM5I/21J7bawdeSwLrGU1G3j0vD0z2h60i9AosbbszWWoNc1/8q9s/yK8qxJYc3Mo8N2jMRb' +
              't0fKiUZF7kSdr83f9PewRoMVo6YPUw+d+Ivw+POCQYUSPYmEPip8/qPhbE/Y1+4Kd6zkpqFZb1JH' +
              '3JtAibGPwXgGd/peEiqbXZ5WGja4iqrW+FGSFoNEI1V8uII6HJVhTSuklgzlTt8ioeq9bXGrFULM' +
              'Kzr0+Rf5u1aIAQ0WAEDuysUuJNIzqMgrATHYBw0DgMVCiFllScVhg0tKSNiMlG4K/3CF3UDJ4glb' +
              'P1TDCFUWACwCgEt6+dVaALintHHX2kjYPGLVBoU1qxsR8AdI6fpvLI8EkkwAWApmafb+6+4OS/sm' +
              'bPu4DRX5Q0D0AIAWrn9IcAPobGu4dFo+ZsZwAFjSK1SUNIBFuY8o0tpI2TvilQblWVOzgOlvCsZn' +
              'Bn0/wQYpK/VRc2bmRzn/XBRyx7csrdQEQkwKY2QsAGBPaUt5yHNXh264j/jaWou0w7V/FRq7IKge' +
              'KWmmqQn32yeVLh+96E980IL1lVGzAGAxiODRC8q0naan/EGOj39p/Mb3zourQnqTPTNuppxpl2tN' +
              'Lc8Kly8/qA0l0iYNSZ5vy8t9f/TSFyK6RtlvpbNl6RNPTXm8l5FLoi7qiF+ETDxTeGB92/kMVVXO' +
              'LBlk6U7mdP1SeP3DgzuStEMemvaYadjQpTl/X6hGuq39WpNdnjExCzgsEZzPCj4tEp0o8grB+b0l' +
              'ddvPS7jKMybJKEn/KXT2M6HrwQ/ZkkiznJX+lJKW+ua4T97ol00s/V7sX545KQsEvi4YuzTYHj5A' +
              'EIC4AgTcU9pc1nI+QVWWNUkGjf0HAD4FQgTdXY6U1KLd/KC1pGBVzrKXtf5qc1TsIqnInjEUQLzI' +
              'vf6rgXMpqEMs0VWmkVlPyVZ7ec6apWywQ7XnopuHqvWND/Muz48AwBzMksRs2g+EPlh8bPP6/m53' +
              '1GxPqp5waTrXtD+ybtctEKTSEQAEsVmOoCL/mnt8S0tObhuUW+TLHRMQU5InIoo/si73d0AI4w53' +
              'au1vFzGbf1y4Z+3WaGh/1GxPKqhZ0ySnJP1Ezkj5LRAS7F4b5G7vaN7lemlSL/EAAAdWSURBVBF0' +
              '7cHy4VPlwQbVnotuRlBMU4XLvYx1uWYFhwpUkmhfpmSk3UmtAS4uON9HrH/Jvhu+r3jLqq8QXvVV' +
              'AOjtvE4XSbC9qGRlvpC38b2GwQDV7snXWrmu3qyfbH4aAHq7gkQFgs+ZC3Oey1v9TlRdLRaVW8DL' +
              'UooJUHo1IC4ExoYEH3NRIzbLFuDwcPGxzZUDGaqK7BkOkMgfhNt7m9BZfPDvJn4A+DNw/uvSlvKo' +
              'O74Ao1fJFyAq8myh67/lLu8kEIIG/Qoke9Ekf8+an1s57pPXtYEE1OG5D6H74KEsvbH1zyDgpqDf' +
              'CgBoVk5Qm/V54ddeLjr6hS8avymqL67cP/0mZFZluG/voZ+Bxu4HgOD1WorUQONsC0HV/7voyBfO' +
              'gQBVReZkgnG2m4SmPs6d3pI++L1fytmZP5VM5h3jv/ggagOXAXGVbFlKsQ1l+TcA4gfi27dL9Jwi' +
              'NADxhjwq68mCLcubo7rj3Ph9s2dbxR3AxXOCcUcvUz5HiX4pdD6vtGnX4Wi32YC5o7hq/CUWIPgQ' +
              '6+x6WKj68F5+XZA46xpitT7Hu1xri2u38Gj7nsrxl4wGwf6DdXTfAVzYeoHKSZMTliHQXxbu6Xlk' +
              'Ugysc40YL/43Se3uLNBrmxeBEIVB248ogJB24PxBmpL4UdGetVHhd+2ech1Vj9XmAKFLgfMiw4Nl' +
              '/7+0kwTLT5Xhw97NW/euZ6DYakDdYp+7/h0dKKkAid5C7Nb1Qc7lAhACgbFkEOIV4PwvlTkzh/Z3' +
              '+2umXGcSqvoAIPkIGCsJChUCR4vpEFot9whdLB5IUA24Ees0I100N1092XC7cHqeAQB7L1MJA8Tt' +
              'UmbyvdRi2z9h84cRnxrLh02zAsGnQdfvFaqe1NtUDhJZYho1/Dnh9u3Jr1jJB5p9BixYAAC7pFxK' +
              'Mx23C4BfCa9/RK8fq0iHicX8Mnd7F5Q07IxY7qe6eM4Eva1jvvDr9wXNogMAmuQulOhi7vY/VdpS' +
              '1j1QbTOgwQIA2DPtBsJVtVStbfgpANzS6/SOqKHV9JJpeObzeZ9/cCycbTtw3T2ye2f1lUDJfwuf' +
              'OroP+t5PUxJ+JqekrMrb9L53INtlwIP19VSTPikRZPoCMHaj0Jmtl6/Widm8l+v6j5WRWRvzN38U' +
              '8qmmatzFGaDQ+/Tm9oeBi+ReYNfRrJQJTb+vtGFn1WCwx6ABCwCgZvK1dqb6rtQb2/4IXGT3/vVY' +
              'L2em/lGo2pLCPevaQzJKXTWPeA8fzWZd7pdBiNnAOe2lDW5MsP1Jjk9YlL/rn8cHiy0GFVgAAHuv' +
              'uIP4aw5NA1n6HXe6p8OpHc5BHHuiIcEVAPCgKXtYc96Ws3fsy0fNMCHifULX5wuPf1wv+uVoNR9G' +
              'gn9Gm/nVot3rBlX5z6AD62uHedI1SdqJ+vsB8RfAeW93+gg0K7uJ1fIsd3vfKzm57YxzXtUlV47Q' +
              '29rvEj7t8d6qPIEgBwGf0MT4H8lpqbV5m5YNuoLFQQsWAEB51hQTibd9l3u8/9nb1vOvDO4i8dbn' +
              'layMBXkblvXprNAD194juXdVTwNKFgi/mgeil+1khLTTFMdLwul5ofjElubBqvtBDRYAwJFb5pOu' +
              'nWXDwK+9LBi/HHgvmW6CKjEpFdyvPahkDynP32a8Fb1y7MwEMEkP8bauh4TO+pKArQOC37OW5H+R' +
              '++lidTDrfdCD9XWUljt7iFDI91lj+8MgRO8XfhM8KA1J/R/h9S8uOrDhtEqJA3PuIr7a2my9tfO3' +
              'gDi3lzp9AIIMFfmA0NmPAGFdaf1OMdj1fd6ABQCwd9at1Hfg6NUgS78RHt946G0XNCUaEnxdGpHx' +
              'NHh5Y0HFCl5zwfWKWtt0K1DyX8LtHdurDhFVVKSFplHD/6o1tx8s2rdOnA+6Pq/AAgDYe+Fc1J3O' +
              'DK2p9XEQ8ABwLvcheqtBQp4iZqVaSOQB1tg+H3pbRgIQaJKPE5PyCut0/aW0rcJ3Pun5vAPra8d+' +
              '+DQbsVvu4V2uh4WqZ8OpjD0G0UsrSrROMF7Qa0UCQYaA26WhqT+U01KrclcuOe8u2zxvwQIA2HfF' +
              'XdRTvXcMIr4sNG0qcPGv0YuctW4IdlFH3GIA/GPR/g0nz1fdntdg/Uuqi+ZkMZ/3Vt7hehyEcHwF' +
              '1r/g6puOEAXKtAEAHjEXjf9o/CeDO+qLgdVXuKZfR1lD61xA+DF3eYu+cuxpn0avU7e9v60MzXiB' +
              'tXfvLDr8OT/f9RkD6xtSe89T2L5zaxZr6ngaEG7+ake2FBQuiRymcfYlrMP5/EAuc4mBFYnRK/+y' +
              'eMHZd/W2rseA81Hfmhr/5UupKEt70Kzcn3jJRTtHvPI7EdNcDKxe5eDcB4hrS3kpyPRPwuOf/NX6' +
              'HwKAAEJcJM7yvJyW8r/a0frm4obtMahiYPVddk+8ClFR0v1HTtwDAD8HLixoVippQtzvudvzcfHR' +
              'L7WYlmJgnbWUpU+UabztFu73jQAmFlkm5DbnrlrCY5qJSUjE+cI7sY4Yk5j0p/w/iZuNw0bVt+UA' +
              'AAAASUVORK5CYII=',
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
