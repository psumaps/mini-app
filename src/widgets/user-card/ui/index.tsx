import React from 'react';
import { Grid, Typography, useTheme } from '@mui/material';
import { User } from '~/entities/user/model';
import Block from '~/shared/ui/block';

import AvatarIcon from '~/shared/assets/avatar.svg?react';
import Line from '~/shared/ui/line';

function UserCard() {
  const theme = useTheme();
  const user: User = {
    name: 'Иван',
    lastname: 'Иванов',
    patronymic: 'Иванович',
    status: 'Студент',
    major: 'ИКНТ ПМИ-1 2023',
    description:
      'Секретарь профбюро физического факультета, член СНО, волонтёр, член Ордена рыцарей сцены',
  };
  return (
    <Block>
      <Grid container spacing={0} direction="column" alignItems="center">
        <Grid
          item
          xs={3}
          sx={{
            textAlign: 'center',
          }}
        >
          <AvatarIcon />
          <Typography variant="h5">
            {user.lastname} {user.name} {user.patronymic}
          </Typography>
          <Typography variant="caption" color={theme.palette.text.secondary}>
            {user.status}
          </Typography>
          <Typography>{user.major}</Typography>
          <Line />
          <Typography>О себе</Typography>
          <Typography variant="body1" py="2em">
            {user.description}
          </Typography>
        </Grid>
      </Grid>
    </Block>
  );
}

export default UserCard;
