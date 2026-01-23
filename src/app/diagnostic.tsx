import React from 'react';
import { View, Text, TextInput } from 'react-native';

export default function DiagnosticTest() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-red-500 mb-4">
        Diagnostic Test Page
      </Text>
      
      <View className="bg-blue-500 p-4 rounded-lg mb-4">
        <Text className="text-white">
          Test 1: Direct react-native View with className
        </Text>
      </View>

      <TextInput
        className="border border-gray-300 rounded px-3 py-2 mb-4"
        placeholder="Test 2: Direct react-native TextInput with className"
      />

      <View style={{ backgroundColor: '#10b981', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <Text style={{ color: 'white' }}>
          Test 3: Direct react-native View with style prop (should work)
        </Text>
      </View>
    </View>
  );
}
