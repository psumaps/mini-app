import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import { useQuery } from '@tanstack/react-query';
import AvatarIcon from '../../assets/avatar.svg?react';
import Block from '../common/block';
import useTryQueryClient from '../../hooks/useTryQueryClient';

const UserCard = () => {
  const queryClient = useTryQueryClient();

  const query = useQuery(
    {
      queryKey: ['user'],
      queryFn: async () => bridge.send('VKWebAppGetUserInfo'),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
    queryClient,
  );

  return (
    <Block className="shadow-[none_!important] dark:shadow-[none_!important]">
      <div className="flex flex-row items-center gap-4">
        {query.isPending || query.isError ? (
          <AvatarIcon className="fill-c_main dark:fill-cd_main size-24 min-h-24 min-w-24 rounded-full" />
        ) : (
          <img
            className="size-24 min-h-24 min-w-24 rounded-full"
            src={query.data.photo_200}
            alt="Аватар"
          />
        )}
        <div className="w-fit overflow-x-clip">
          <h2 className="text-ellipsis overflow-x-clip">
            {query.isPending || query.isError
              ? 'Загрузка...'
              : `${query.data.first_name} ${query.data.last_name}`}
          </h2>
        </div>
      </div>
    </Block>
  );
};

export default UserCard;
