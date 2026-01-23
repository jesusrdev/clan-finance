import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useColorScheme } from '@/lib/useColorScheme';
import { Image, Platform, View, Alert } from 'react-native';
import { useAuth } from '@/features/auth/hooks/useAuth';

const SOCIAL_CONNECTION_STRATEGIES = [
  {
    type: 'google',
    source: { uri: 'https://img.clerk.com/static/google.png?width=160' },
    useTint: false,
    name: 'Google',
  },
  // Adding more as placeholders or if supported
];

export function SocialConnections() {
  const { colorScheme } = useColorScheme();
  const { signInWithGoogle, loading } = useAuth();

  const handleProviderPress = async (provider: string) => {
    if (provider === 'google') {
      try {
        await signInWithGoogle();
      } catch (e: any) {
        Alert.alert('Error', e.message);
      }
    } else {
      Alert.alert('Próximamente', 'Este proveedor de inicio de sesión estará disponible pronto.');
    }
  };

  return (
    <View className="gap-2 sm:flex-row sm:gap-3">
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        return (
          <Button
            key={strategy.type}
            variant="outline"
            size="sm"
            className="sm:flex-1"
            disabled={loading}
            onPress={() => handleProviderPress(strategy.type)}>
            <Image
              className={cn('size-4', strategy.useTint && Platform.select({ web: 'dark:invert' }))}
              tintColor={Platform.select({
                native: strategy.useTint ? (colorScheme === 'dark' ? 'white' : 'black') : undefined,
              })}
              source={strategy.source}
            />
          </Button>
        );
      })}
    </View>
  );
}

