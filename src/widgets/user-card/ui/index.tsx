import React, {useMemo} from 'react';
import {Grid, Typography, useTheme} from '@mui/material';
import { User } from '~/entities/user/model';
import Block from '~/shared/ui/block';

import AvatarIcon from '~/shared/assets/avatar.svg?react';
import Line from '~/shared/ui/line';
import bridge from "@vkontakte/vk-bridge";

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
          container
          xs={3}
          direction="row"

        >
            <Grid item>
                <AvatarIcon />
            </Grid>
            <Grid item xl={3} sx={{
                marginTop: '1em',
                marginLeft: '1em',
            }}>
                <Typography variant="h2">
                    {user.lastname} {user.name}
                </Typography>
                <Typography variant="h5" color={theme.palette.text.secondary}
                            sx={{
                                marginTop: '0.5em',
                            }}>
                    {user.status}
                </Typography>
                <Typography variant="h4" color={theme.palette.text.secondary}>{user.major}</Typography>
                <Line />
            </Grid>
        </Grid>
          <Grid
                item
                container
                xs={3}
                direction="column"
            >
              <Typography variant="h3"  my="1em">О себе</Typography>
              <Typography variant="body1">
                {user.description}
              </Typography>
        </Grid>
      </Grid>
    </Block>
  );
}

export default UserCard;
