import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import { useQuery } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import AvatarIcon from '../../assets/avatar.svg?react';
import Block from '../common/block';
import useTryQueryClient from '../../hooks/useTryQueryClient';
import useDeterminateBridge from '../../hooks/useDeterminateBridge';
import { BridgeType } from '../../models/storage';

// Общий интерфейс для данных пользователя из разных источников
interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  photo_200?: string;
  username?: string;
}

const UserCard = () => {
  const queryClient = useTryQueryClient();
  const bridgeType = useDeterminateBridge();

  const query = useQuery<UserData | null>(
    {
      queryKey: ['user', bridgeType],
      queryFn: async () => {
        if (bridgeType === BridgeType.vkbridge) {
          const vkUserInfo = await bridge.send('VKWebAppGetUserInfo');
          return {
            ...vkUserInfo,
            last_name: vkUserInfo.last_name || '',
          };
        }
        if (bridgeType === BridgeType.tgconnect) {
          const { tgWebAppData } = retrieveLaunchParams();
          if (tgWebAppData) {
            const { user } = tgWebAppData;
            if (user) {
              return {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name || '',
                photo_200: user.photo_url || '',
                username: user.username,
              };
            }
          }
        }
        return null;
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
    queryClient,
  );

  return (
    <Block className="shadow-[none_!important] dark:shadow-[none_!important]">
      <div className="flex flex-row items-center gap-4">
        {query.isPending || query.isError || !query.data?.photo_200 ? (
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
              : `${query.data?.first_name} ${query.data?.last_name}`}
          </h2>
          {!query.isPending && !query.isError && query.data?.username && (
            <p className="text-sm text-gray-500">@{query.data.username}</p>
          )}
        </div>
      </div>
    </Block>
  );
};

export default UserCard;
