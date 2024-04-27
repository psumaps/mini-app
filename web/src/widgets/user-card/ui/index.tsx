import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { User } from '~/entities/user/model';
import Block from '~/shared/ui/block';

import AvatarIcon from '~/shared/assets/avatar.svg?react';
import Line from '~/shared/ui/line';
import bridge from '@vkontakte/vk-bridge';

function UserCard() {
  const theme = useTheme();
  useMemo(() => {
    return 5;
  }, []);
  const user: User = useMemo(
    () => ({
      name: 'Иван',
      lastname: 'Иванов',
      patronymic: 'Иванович',
      status: 'Студент',
      major: 'ИКНТ ПМИ-1 2023',
      description:
        'Секретарь профбюро физического факультета, член СНО, волонтёр, член Ордена рыцарей сцены',
    }),
    [],
  );

  const [icon, setIcon] = useState(() => <AvatarIcon />);
  useEffect(() => {
    bridge.send('VKWebAppGetUserInfo').then((s) => {
      user.name = s.first_name;
      user.lastname = s.last_name;
      setIcon(
        <Box
          component="img"
          sx={{
            borderRadius: '50%',
            height: 100,
            width: 100,
            maxHeight: { xs: 200, md: 167 },
            maxWidth: { xs: 200, md: 250 },
          }}
          src={s.photo_100}
        />,
      );
    });
  }, []);

  return (
    <Block>
      <Grid container spacing={0} direction="column" alignItems="center">
        <Grid item container xs={12} direction="row" flexWrap="nowrap" alignItems="center">
          <Grid item>{icon}</Grid>
          <Grid
            item
            xl={3}
            sx={{
              marginTop: '1em',
              marginLeft: '1em',
            }}
          >
            <Typography variant="h2">
              {user.lastname} {user.name}
            </Typography>
            <Typography
              variant="h5"
              color={theme.palette.text.secondary}
              sx={{
                marginTop: '0.5em',
              }}
            >
              {user.status}
            </Typography>
            <Typography variant="h4" color={theme.palette.text.secondary}>
              {user.major}
            </Typography>
            <Line />
          </Grid>
        </Grid>
        <Grid item container xs={3} direction="column">
          <Typography variant="h3" my="1em">
            О себе
          </Typography>
          <Typography variant="body1">{user.description}</Typography>
        </Grid>
      </Grid>
    </Block>
  );
}

export default UserCard;
