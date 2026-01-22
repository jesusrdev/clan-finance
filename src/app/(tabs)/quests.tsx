import { View, Text, StyleSheet } from 'react-native';

export default function QuestsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚔️ Quests</Text>
      <Text style={styles.subtitle}>Tus misiones del día</Text>
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
