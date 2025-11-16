
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  // Main backgrounds
  background: '#F8F9FA',
  backgroundDark: '#0A0E27',
  
  // Text colors
  text: '#1A1D29',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Primary brand colors - Racing inspired
  primary: '#E10600', // Racing red
  primaryDark: '#B30500',
  primaryLight: '#FF1E00',
  
  // Accent colors
  secondary: '#FFD700', // Gold for championship
  accent: '#00D9FF', // Cyan for tech/data
  warning: '#FF9500',
  info: '#0A84FF',
  purple: '#8B5CF6',
  
  // Card and surface colors
  card: '#FFFFFF',
  cardDark: '#1F2937',
  surface: '#F3F4F6',
  surfaceElevated: '#FFFFFF',
  
  // Status colors
  success: '#00C853',
  error: '#FF3B30',
  
  // Border and divider
  border: '#E5E7EB',
  divider: '#F3F4F6',
  
  // Gradient colors
  gradientStart: '#E10600',
  gradientEnd: '#FF6B00',
  
  // Special highlights
  highlight: '#FFF8E1',
  highlightBlue: '#E3F2FD',
  highlightGreen: '#E8F5E9',
  highlightRed: '#FFEBEE',
  highlightPurple: '#F3E5F5',
  highlightGold: '#FFF9C4',
  
  // Racing specific
  racingRed: '#E10600',
  racingGold: '#FFD700',
  racingBlack: '#1A1D29',
  racingWhite: '#FFFFFF',
  racingCarbon: '#2C2C2C',
  
  // Performance zones
  zoneOptimal: '#00C853',
  zoneWarning: '#FF9500',
  zoneDanger: '#FF3B30',
  zoneRecovery: '#0A84FF',
};

export const gradients = {
  primary: ['#E10600', '#B30500'],
  racing: ['#E10600', '#FF6B00'],
  championship: ['#FFD700', '#FFA000'],
  success: ['#00C853', '#00E676'],
  warning: ['#FF9500', '#FF6D00'],
  error: ['#FF3B30', '#D32F2F'],
  purple: ['#8B5CF6', '#7C3AED'],
  blue: ['#0A84FF', '#0066CC'],
  cyan: ['#00D9FF', '#00B8D4'],
  sunset: ['#FF6B00', '#E10600'],
  ocean: ['#0A84FF', '#00D9FF'],
  forest: ['#00C853', '#00E676'],
  carbon: ['#2C2C2C', '#1A1D29'],
  gold: ['#FFD700', '#FFA000'],
  silver: ['#C0C0C0', '#A8A8A8'],
  bronze: ['#CD7F32', '#B87333'],
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  colored: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  }),
  racing: {
    shadowColor: '#E10600',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  }),
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  round: 9999,
};

export const typography = {
  hero: {
    fontSize: 36,
    fontWeight: '900' as const,
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: -1,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
    lineHeight: 16,
  },
  tiny: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 14,
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Card Styles
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  cardCompact: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  cardElevated: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
    ...shadows.large,
  },
  cardRacing: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.racingRed,
    ...shadows.medium,
  },
  cardGradient: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.large,
  },
  
  // Typography Styles
  hero: {
    ...typography.hero,
    color: colors.text,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  heading: {
    ...typography.heading,
    color: colors.text,
  },
  text: {
    ...typography.body,
    color: colors.text,
  },
  textBold: {
    ...typography.bodyBold,
    color: colors.text,
  },
  textSecondary: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  textSmall: {
    ...typography.small,
    color: colors.textLight,
  },
  textTiny: {
    ...typography.tiny,
    color: colors.textLight,
  },
  
  // Button Styles
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  buttonLarge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  buttonSecondaryText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonOutlineText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '700',
  },
  
  // Layout Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Badge Styles
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  badgeText: {
    ...typography.small,
    fontWeight: '700',
    color: colors.text,
  },
  badgePrimary: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
  },
  badgePrimaryText: {
    ...typography.small,
    fontWeight: '700',
    color: colors.textInverse,
  },
  badgeSuccess: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.success,
  },
  badgeSuccessText: {
    ...typography.small,
    fontWeight: '700',
    color: colors.textInverse,
  },
  badgeWarning: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.warning,
  },
  badgeWarningText: {
    ...typography.small,
    fontWeight: '700',
    color: colors.textInverse,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.xl,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },
  
  // Input Styles
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontSize: 17,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.border,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  
  // Section Styles
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionHeader: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  
  // Icon Container Styles
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  iconContainerLarge: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  
  // Progress Styles
  progressBar: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
  },
  progressBarLarge: {
    height: 12,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  
  // Status Indicator
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  statusDotLarge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
});
