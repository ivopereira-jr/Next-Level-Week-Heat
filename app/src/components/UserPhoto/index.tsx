import React from 'react';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import AvatarImg from '../../assets/avatar.png';
import { styles } from './styles';
import { COLORS } from '../../theme';

const sizesValue = {
  small: {
    containerSize: 32,
    avatarSize: 28
  },
  normal: {
    containerSize: 48,
    avatarSize: 42
  }
};

type Props = {
  imageUri: string | undefined;
  sizes?: 'small' | 'normal';
};

const avatarDefault = Image.resolveAssetSource(AvatarImg).uri;

export function UserPhoto({ imageUri, sizes = 'normal' }: Props) {
  const { containerSize, avatarSize } = sizesValue[sizes];

  return (
    <LinearGradient
      start={{ x: 0, y: 0.8 }}
      end={{ x: 0.9, y: 1 }}
      colors={[COLORS.PINK, COLORS.YELLOW]}
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2
        }
      ]}
    >
      <Image
        source={{ uri: imageUri || avatarDefault }}
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2
          }
        ]}
      />
    </LinearGradient>
  );
}
