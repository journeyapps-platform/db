import { expect, it } from 'vitest';
import { Day, DateType, DatetimeType, LocationType, SingleChoiceIntegerType } from '@ja-platform/parser-schema';
import { operationsFor } from '../src/types/TypeOperations';

it('round-trips dates and clones mutable datetimes independently', () => {
  const type = new DateType();
  type.isDay = true;
  const date = operationsFor(type);
  const day = new Day('2026-01-02');
  expect(date.valueFromJSON(date.valueToJSON(day))).toEqual(day);
  const datetime = operationsFor(new DatetimeType());
  const original = new Date('2026-01-02T03:04:05Z');
  const clone = datetime.clone(original);
  expect(clone).toEqual(original);
  clone.setUTCFullYear(2027);
  expect(original.getUTCFullYear()).toBe(2026);
  expect(datetime.valueFromJSON(datetime.valueToJSON(original))).toEqual(original);
  expect(datetime.valueFromJSON('invalid')).toBeNull();
});

it('decodes location wire values and rejects incomplete coordinates', () => {
  const operation = operationsFor(new LocationType());
  const wireValue = [1, 2, 3, 4, 5, '2026-01-02T03:04:05.000Z'];
  const location = operation.valueFromJSON(wireValue);
  expect(location.latitude).toBe(1);
  expect(location.longitude).toBe(2);
  expect(location.timestamp).toEqual(new Date('2026-01-02T03:04:05.000Z'));
  expect(JSON.parse(JSON.stringify(operation.valueToJSON(location)))).toEqual(wireValue);
  expect(() => operation.valueFromJSON([1, 2])).toThrow('must have 6 parts');
});

it('preserves zero in integer-choice wire conversion without coercing text', () => {
  const operation = operationsFor(new SingleChoiceIntegerType());
  expect(operation.valueToJSON(0)).toBe(0);
  expect(operation.valueFromJSON(0)).toBe(0);
  expect(operation.valueFromJSON('0')).toBeNull();
});
