
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function BikeSetupScreen() {
  const [setup, setSetup] = useState({
    frontSuspension: { compression: '', rebound: '', preload: '' },
    rearSuspension: { compression: '', rebound: '', preload: '' },
    tirePressure: { front: '', rear: '' },
    gearing: { front: '', rear: '' },
    rideHeight: { front: '', rear: '' },
    weight: '',
    notes: '',
  });

  const [conditions, setConditions] = useState({
    track: '',
    temperature: '',
    weather: 'Asciutto',
    trackCondition: 'Ottimale',
  });

  const updateSetup = (category, field, value) => {
    setSetup({
      ...setup,
      [category]: typeof setup[category] === 'object' 
        ? { ...setup[category], [field]: value }
        : value
    });
  };

  const updateConditions = (field, value) => {
    setConditions({ ...conditions, [field]: value });
  };

  const getTirePressureAdvice = () => {
    const front = parseFloat(setup.tirePressure.front);
    const rear = parseFloat(setup.tirePressure.rear);
    
    if (!front || !rear) return null;

    const advice = [];
    
    if (front < 1.8) advice.push('⚠️ Pressione anteriore bassa - rischio instabilità');
    else if (front > 2.2) advice.push('⚠️ Pressione anteriore alta - ridotto grip');
    else advice.push('✅ Pressione anteriore ottimale');

    if (rear < 1.6) advice.push('⚠️ Pressione posteriore bassa - rischio surriscaldamento');
    else if (rear > 2.0) advice.push('⚠️ Pressione posteriore alta - ridotto grip');
    else advice.push('✅ Pressione posteriore ottimale');

    return advice;
  };

  const getGearingAdvice = () => {
    const front = parseInt(setup.gearing.front);
    const rear = parseInt(setup.gearing.rear);
    
    if (!front || !rear) return null;

    const ratio = rear / front;
    
    if (ratio > 3.5) return '🏁 Setup per accelerazione (circuiti tecnici)';
    if (ratio < 3.0) return '🚀 Setup per velocità massima (circuiti veloci)';
    return '⚖️ Setup bilanciato';
  };

  const tirePressureAdvice = getTirePressureAdvice();
  const gearingAdvice = getGearingAdvice();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Setup Moto',
          presentation: 'card',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[commonStyles.card, styles.infoCard]}>
            <IconSymbol name="wrench.and.screwdriver.fill" size={32} color={colors.primary} />
            <Text style={styles.infoText}>
              Registra e ottimizza il setup della tua moto per ogni circuito
            </Text>
          </View>

          {/* Track Conditions */}
          <View style={[commonStyles.card]}>
            <Text style={styles.sectionTitle}>🏁 Condizioni Pista</Text>
            
            <Text style={styles.inputLabel}>Circuito</Text>
            <TextInput
              style={styles.input}
              value={conditions.track}
              onChangeText={(value) => updateConditions('track', value)}
              placeholder="es. Mugello, Misano, Valencia"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.inputLabel}>Temperatura Pista (°C)</Text>
            <TextInput
              style={styles.input}
              value={conditions.temperature}
              onChangeText={(value) => updateConditions('temperature', value)}
              placeholder="es. 35"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.inputLabel}>Meteo</Text>
            <View style={styles.optionsRow}>
              {['Asciutto', 'Nuvoloso', 'Pioggia'].map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.optionButton,
                    conditions.weather === option && styles.optionButtonActive
                  ]}
                  onPress={() => updateConditions('weather', option)}
                >
                  <Text style={[
                    styles.optionText,
                    conditions.weather === option && styles.optionTextActive
                  ]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLabel}>Condizione Pista</Text>
            <View style={styles.optionsRow}>
              {['Ottimale', 'Sporca', 'Scivolosa'].map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.optionButton,
                    conditions.trackCondition === option && styles.optionButtonActive
                  ]}
                  onPress={() => updateConditions('trackCondition', option)}
                >
                  <Text style={[
                    styles.optionText,
                    conditions.trackCondition === option && styles.optionTextActive
                  ]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Suspensions */}
          <View style={[commonStyles.card]}>
            <Text style={styles.sectionTitle}>🔧 Sospensioni</Text>
            
            <Text style={styles.subsectionTitle}>Anteriore</Text>
            <View style={styles.setupRow}>
              <View style={styles.setupInput}>
                <Text style={styles.setupLabel}>Compressione</Text>
                <TextInput
                  style={styles.setupField}
                  value={setup.frontSuspension.compression}
                  onChangeText={(value) => updateSetup('frontSuspension', 'compression', value)}
                  placeholder="12"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.setupInput}>
                <Text style={styles.setupLabel}>Estensione</Text>
                <TextInput
                  style={styles.setupField}
                  value={setup.frontSuspension.rebound}
                  onChangeText={(value) => updateSetup('frontSuspension', 'rebound', value)}
                  placeholder="10"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.setupInput}>
                <Text style={styles.setupLabel}>Precarico</Text>
                <TextInput
                  style={styles.setupField}
                  value={setup.frontSuspension.preload}
                  onChangeText={(value) => updateSetup('frontSuspension', 'preload', value)}
                  placeholder="5"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <Text style={styles.subsectionTitle}>Posteriore</Text>
            <View style={styles.setupRow}>
              <View style={styles.setupInput}>
                <Text style={styles.setupLabel}>Compressione</Text>
                <TextInput
                  style={styles.setupField}
                  value={setup.rearSuspension.compression}
                  onChangeText={(value) => updateSetup('rearSuspension', 'compression', value)}
                  placeholder="14"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.setupInput}>
                <Text style={styles.setupLabel}>Estensione</Text>
                <TextInput
                  style={styles.setupField}
                  value={setup.rearSuspension.rebound}
                  onChangeText={(value) => updateSetup('rearSuspension', 'rebound', value)}
                  placeholder="12"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.setupInput}>
                <Text style={styles.setupLabel}>Precarico</Text>
                <TextInput
                  style={styles.setupField}
                  value={setup.rearSuspension.preload}
                  onChangeText={(value) => updateSetup('rearSuspension', 'preload', value)}
                  placeholder="7"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>

          {/* Tire Pressure */}
          <View style={[commonStyles.card]}>
            <Text style={styles.sectionTitle}>🏍️ Pressione Gomme (bar)</Text>
            <View style={styles.setupRow}>
              <View style={styles.setupInput}>
                <Text style={styles.setupLabel}>Anteriore</Text>
                <TextInput
                  style={styles.setupField}
                  value={setup.tirePressure.front}
                  onChangeText={(value) => updateSetup('tirePressure', 'front', value)}
                  placeholder="2.0"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.setupInput}>
                <Text style={styles.setupLabel}>Posteriore</Text>
                <TextInput
                  style={styles.setupField}
                  value={setup.tirePressure.rear}
                  onChangeText={(value) => updateSetup('tirePressure', 'rear', value)}
                  placeholder="1.8"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            {tirePressureAdvice && (
              <View style={styles.adviceCard}>
                {tirePressureAdvice.map((advice, index) => (
                  <Text key={index} style={styles.adviceText}>{advice}</Text>
                ))}
              </View>
            )}
          </View>

          {/* Gearing */}
          <View style={[commonStyles.card]}>
            <Text style={styles.sectionTitle}>⚙️ Rapporti</Text>
            <View style={styles.setupRow}>
              <View style={styles.setupInput}>
                <Text style={styles.setupLabel}>Pignone (denti)</Text>
                <TextInput
                  style={styles.setupField}
                  value={setup.gearing.front}
                  onChangeText={(value) => updateSetup('gearing', 'front', value)}
                  placeholder="14"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.setupInput}>
                <Text style={styles.setupLabel}>Corona (denti)</Text>
                <TextInput
                  style={styles.setupField}
                  value={setup.gearing.rear}
                  onChangeText={(value) => updateSetup('gearing', 'rear', value)}
                  placeholder="48"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            {gearingAdvice && (
              <View style={styles.adviceCard}>
                <Text style={styles.adviceText}>{gearingAdvice}</Text>
              </View>
            )}
          </View>

          {/* Ride Height */}
          <View style={[commonStyles.card]}>
            <Text style={styles.sectionTitle}>📏 Altezza da Terra (mm)</Text>
            <View style={styles.setupRow}>
              <View style={styles.setupInput}>
                <Text style={styles.setupLabel}>Anteriore</Text>
                <TextInput
                  style={styles.setupField}
                  value={setup.rideHeight.front}
                  onChangeText={(value) => updateSetup('rideHeight', 'front', value)}
                  placeholder="120"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.setupInput}>
                <Text style={styles.setupLabel}>Posteriore</Text>
                <TextInput
                  style={styles.setupField}
                  value={setup.rideHeight.rear}
                  onChangeText={(value) => updateSetup('rideHeight', 'rear', value)}
                  placeholder="130"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>

          {/* Weight */}
          <View style={[commonStyles.card]}>
            <Text style={styles.sectionTitle}>⚖️ Peso Totale (kg)</Text>
            <TextInput
              style={styles.input}
              value={setup.weight}
              onChangeText={(value) => updateSetup('weight', null, value)}
              placeholder="Moto + Pilota + Equipaggiamento"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Notes */}
          <View style={[commonStyles.card]}>
            <Text style={styles.sectionTitle}>📝 Note Setup</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={setup.notes}
              onChangeText={(value) => updateSetup('notes', null, value)}
              placeholder="Annotazioni su comportamento moto, modifiche da provare, feedback..."
              multiline
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Save Button */}
          <Pressable style={styles.saveButton}>
            <IconSymbol name="square.and.arrow.down.fill" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Salva Setup</Text>
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: colors.highlight,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  optionButton: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  setupRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  setupInput: {
    flex: 1,
  },
  setupLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  setupField: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center',
  },
  adviceCard: {
    backgroundColor: colors.highlight,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  adviceText: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 4,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
});
