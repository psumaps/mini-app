import * as React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

export const FloorButton = styled(Button)({
  fontFamily: 'Montserrat, sans-serif',
  backgroundColor: '#FEFEFE',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'center',
  height: '40px',
  padding: '0 14px',
});

const AddressButton = styled(Button)({
  display: 'flex',
  marginTop: '10px',
  gap: '4px',
});

const AddressLetter = styled('div')({
  backgroundColor: '#D01F36',
  borderRadius: '50%',
  alignItems: 'center',
  color: '#FFF',
  textAlign: 'center',
  width: '36px',
  justifyContent: 'center',
  height: '36px',
  padding: '0 12px',
  fontWeight: 700,
  fontSize: '20px',
  fontFamily: 'Montserrat, sans-serif',
});

const AddressText = styled('div')({
  borderRadius: '50px',
  border: '1px solid rgba(235, 235, 235, 1)',
  display: 'flex',
  gap: '20px',
  fontSize: '16px',
  color: '#000',
  fontWeight: 500,
  justifyContent: 'space-between',
  flexGrow: 1,
  flexBasis: 'auto',
  padding: '11px 18px',
});

interface MyComponentProps {}

const MyComponent: React.FC<MyComponentProps> = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#F9F9F9',
        display: 'flex',
        maxWidth: '480px',
        width: '100%',
        flexDirection: 'column',
        whiteSpace: 'nowrap',
        justifyContent: 'center',
        margin: '0 auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          aspectRatio: '0.46',
          width: '100%',
        }}
      >
        <Box
          component="img"
          loading="lazy"
          src="{{ext_17}}"
          sx={{
            position: 'absolute',
            inset: 0,
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        <Box
          component="img"
          loading="lazy"
          src="{{ext_18}}"
          sx={{
            aspectRatio: '9.09',
            objectFit: 'auto',
            objectPosition: 'center',
            width: '100%',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            alignSelf: 'end',
            display: 'flex',
            width: '43px',
            flexDirection: 'column',
            fontSize: '20px',
            color: 'var(--csk-444444800, #333)',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          <Box
            component="img"
            loading="lazy"
            src="{{ext_19}}"
            sx={{
              aspectRatio: '1.08',
              objectFit: 'auto',
              objectPosition: 'center',
              width: '100%',
              alignSelf: 'center',
            }}
          />
          <FloorButton>4</FloorButton>
          <FloorButton>3</FloorButton>
          <FloorButton>2</FloorButton>
          <FloorButton
            sx={{
              borderRadius: '0 0 20px 20px',
            }}
          >
            1
          </FloorButton>
          <Box
            component="img"
            loading="lazy"
            src="{{ext_20}}"
            sx={{
              aspectRatio: '0.54',
              objectFit: 'auto',
              objectPosition: 'center',
              width: '100%',
              boxShadow:
                '-2px -2px 4px 0px rgba(255, 255, 255, 0.1), 2px 2px 4px 0px rgba(225, 225, 225, 0.5)',
              alignSelf: 'center',
              marginTop: '24px',
            }}
          />
          <Box
            component="img"
            loading="lazy"
            src="{{ext_21}}"
            sx={{
              aspectRatio: '1.08',
              objectFit: 'auto',
              objectPosition: 'center',
              width: '100%',
              filter:
                'drop-shadow(2px 2px 4px rgba(225, 225, 225, 0.5)) drop-shadow(-2px -2px 4px rgba(255, 255, 255, 0.1))',
              alignSelf: 'center',
              marginTop: '24px',
            }}
          />
        </Box>
        <Box
          sx={{
            position: 'relative',
            borderRadius: '20px 20px 0 0',
            boxShadow: '0px 0px 10px 0px #DFDFDF',
            backgroundColor: '#FEFEFE',
            display: 'flex',
            marginTop: '20px',
            width: '100%',
            flexDirection: 'column',
            padding: '8px 15px 19px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              gap: '20px',
              fontWeight: 700,
              textAlign: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              component="img"
              loading="lazy"
              src="{{ext_22}}"
              sx={{
                aspectRatio: '1.33',
                objectFit: 'auto',
                objectPosition: 'center',
                width: '20px',
                alignSelf: 'end',
                marginTop: '23px',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'start',
                gap: '20px',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: '18px',
                  color: '#000',
                }}
              >
                <Box
                  sx={{
                    borderRadius: '100px',
                    backgroundColor: 'var(--Gray-5, #E0E0E0)',
                    alignSelf: 'center',
                    width: '44px',
                    height: '5px',
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: 'Montserrat, sans-serif',
                    marginTop: '14px',
                  }}
                >
                  Маршрут
                </Typography>
              </Box>
              <Button
                sx={{
                  justifyContent: 'center',
                  borderRadius: '15.842px',
                  backgroundColor: '#D01F36',
                  marginTop: '18px',
                  color: '#FFF',
                  padding: '9px 22px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '11px',
                }}
              >
                Готово
              </Button>
            </Box>
          </Box>
          <AddressButton>
            <AddressLetter>А</AddressLetter>
            <AddressText>
              <Typography
                sx={{
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                127/1
              </Typography>
              <Box
                component="img"
                loading="lazy"
                src="{{ext_23}}"
                sx={{
                  aspectRatio: 1,
                  objectFit: 'auto',
                  objectPosition: 'center',
                  width: '10px',
                  strokeWidth: '1.543px',
                  stroke: 'var(--Gray-3, #828282)',
                  border: '2px solid rgba(130, 130, 130, 1)',
                  margin: 'auto 0',
                }}
              />
            </AddressText>
          </AddressButton>
          <AddressButton>
            <AddressLetter>B</AddressLetter>
            <AddressText>
              <Typography
                sx={{
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                128/1
              </Typography>
              <Box
                component="img"
                loading="lazy"
                src="{{ext_24}}"
                sx={{
                  aspectRatio: 1,
                  objectFit: 'auto',
                  objectPosition: 'center',
                  width: '10px',
                  strokeWidth: '1.543px',
                  stroke: 'var(--Gray-3, #828282)',
                  border: '2px solid rgba(130, 130, 130, 1)',
                  margin: 'auto 0',
                }}
              />
            </AddressText>
          </AddressButton>
        </Box>
        <Box
          component="img"
          loading="lazy"
          src="{{ext_25}}"
          sx={{
            aspectRatio: '4.55',
            objectFit: 'auto',
            objectPosition: 'center',
            width: '100%',
          }}
        />
      </Box>
    </Box>
  );
};

export default MyComponent;
