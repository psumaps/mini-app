import React, { useMemo } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { useQuery } from '@tanstack/react-query';
import { User } from '../../models/user';
import AvatarIcon from '../../assets/avatar.svg?react';
import Block from '../common/block';

const UserCard = () => {
  const user: User = useMemo(
    () => ({
      status: 'Студент',
      major: 'ИКНТ ПМИ-1 2023',
    }),
    [],
  );

  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => bridge.send('VKWebAppGetUserInfo'),
  });

  return (
    <Block className="shadow-[none_!important] dark:shadow-[none_!important] p-[0_!important]">
      <div className="container flex flex-row p-1">
        {query.isPending || query.isError ? (
          <AvatarIcon className="fill-c_main dark:fill-cd_main w-28 h-28" />
        ) : (
          <img className="w-28 h-28" src={query.data.photo_100} alt="" />
        )}
        <div className="mt-2 w-full p-3">
          {query.isPending || query.isError ? (
            <h2>Загрузка...</h2>
          ) : (
            <h2>
              {query.data.first_name} {query.data.last_name}
            </h2>
          )}
          <h4 className="mt-2 mb-1">{user.status}</h4>
          <h5>{user.major}</h5>
        </div>
      </div>
    </Block>
  );
};

export default UserCard;
