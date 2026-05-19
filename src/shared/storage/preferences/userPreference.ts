export class UserPreference<TValue extends string> {
  private storageKey: string;
  public readonly default: TValue;
  private validValues: readonly TValue[];

  constructor(options: {
    storageKey: string;
    defaultValue: TValue;
    validValues: readonly TValue[];
  }) {
    this.storageKey = options.storageKey;
    this.default = options.defaultValue;
    this.validValues = options.validValues;
  }

  public async get(): Promise<TValue> {
    const result: Record<string, unknown> = await chrome.storage.local
      .get(this.storageKey)
      .catch(() => ({}));
    const stored = result[this.storageKey] as string | undefined;

    if (stored && this.isPreferenceValue(stored)) {
      return stored;
    }

    return this.default;
  }

  public async set(value: TValue): Promise<void> {
    await chrome.storage.local.set({
      [this.storageKey]: value,
    });
  }

  private isPreferenceValue(value: string): value is TValue {
    return this.validValues.includes(value as TValue);
  }
}
