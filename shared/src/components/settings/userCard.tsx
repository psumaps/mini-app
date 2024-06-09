import React, { useEffect, useMemo, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { User } from '../../models/user';
import AvatarIcon from '../../assets/avatar.svg?react';
import Block from '../common/block';

const UserCard = () => {
  const user: User = useMemo(
    () => ({
      name: 'Имя',
      lastname: 'Фамилия',
      status: 'Студент',
      major: 'ИКНТ ПМИ-1 2023',
    }),
    [],
  );

  const [icon, setIcon] = useState(() => (
    <AvatarIcon className="fill-c_main dark:fill-cd_main w-28 h-28" />
  ));
  useEffect(() => {
    void bridge.send('VKWebAppGetUserInfo').then((s) => {
      user.name = s.first_name;
      user.lastname = s.last_name;
      // eslint-disable-next-line jsx-a11y/alt-text
      setIcon(<img className="w-28 h-28" src={s.photo_100} alt="" />);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Block className="shadow-[none_!important] dark:shadow-[none_!important] p-[0_!important]">
      <div className="container flex flex-row p-1">
        <div>{icon}</div>
        <div className="mt-2 w-full p-3">
          <h2>
            {user.name} {user.lastname}
          </h2>
          <h4 className="mt-2 mb-1">{user.status}</h4>
          <h5>{user.major}</h5>
        </div>
      </div>
    </Block>
  );
};

export default UserCard;
