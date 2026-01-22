import { View, Text, StyleSheet } from 'react-native';

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Wallet</Text>
      <Text style={styles.subtitle}>Tu poder de ahorro</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF5E6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D91E1E',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});
