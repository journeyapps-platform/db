import { describe, expect, expectTypeOf, it } from 'vitest';
import { ConstantExpression, ConstantExpressionParser, TextToken, FormatStringExpression } from '../src';
import { ScalarType, textType, numberType } from '@ja-platform/types';

describe('ConstantExpression', () => {
  it.each([
    'hello',
    '42',
    '01',
    '-1.5',
    '1e3',
    '0x10',
    'true',
    'false',
    'null',
    '"hello"',
    "'it\\'s fine'",
    "'unfinished",
    ' 42 ',
    'Hello {user.name}',
    '{{name}}',
    '$:save()',
    'save()',
    '1 + 2',
    "It's\na \\ path\r",
    ''
  ])('preserves %j as text through parsing', (source) => {
    const expression = ConstantExpression.parse(source, textType, 7);
    expectTypeOf(expression.value()).toEqualTypeOf<string>();
    expect(expression.value()).toBe(source);
    expect(expression.raw()).toBe(source);
    expect(expression.start).toBe(7);
    expect(new ConstantExpressionParser().tryParse(expression.tokens).options).toEqual(expression.options);
  });

  it('parses an explicit type without changing source, tokens or clone behavior', () => {
    const expression = ConstantExpression.parse(' 045 ', numberType, 7);
    expectTypeOf(expression.value()).toEqualTypeOf<number>();
    expect(expression.value()).toBe(45);
    expect(expression.raw()).toBe(' 045 ');
    expect(expression.start).toBe(7);
    expect(expression.isValid()).toBe(true);
    const clone = expression.clone();
    expect(clone).not.toBe(expression);
    expect(clone.options).toEqual(expression.options);
    expect(clone.raw()).toBe(' 045 ');
    expect(clone.valueType).toBe(numberType);
    expect(clone.value()).toBe(45);
    expect(new ConstantExpressionParser(numberType).tryParse(expression.tokens).value()).toBe(45);
    // @ts-expect-error Exercise runtime rejection of a constant placeholder.
    expect(() => FormatStringExpression.parse('{value}').withParameters([expression])).toThrow(SyntaxError);
  });

  it('supports consumer types without another expression subclass', () => {
    class DirectionType extends ScalarType<'asc' | 'desc'> {
      is(value: unknown): value is 'asc' | 'desc' {
        return value === 'asc' || value === 'desc';
      }
      parse(value: unknown) {
        if (this.is(value)) return value;
        throw new SyntaxError('Expected asc or desc.');
      }
    }
    const direction = new DirectionType('direction');
    const expression = ConstantExpression.parse('desc', direction);
    expectTypeOf(expression.value()).toEqualTypeOf<'asc' | 'desc'>();
    expect(expression.value()).toBe('desc');
    expect(() => ConstantExpression.parse('sideways', direction)).toThrow('Expected asc or desc.');
  });

  it('preserves supplied token identity and source positions', () => {
    const tokens = [new TextToken('Hello ', 10), new TextToken('{{name}}', 16)];
    const expression = ConstantExpression.parse(tokens, textType);
    expect(expression.value()).toBe('Hello {{name}}');
    expect(expression.start).toBe(10);
    expect(expression.tokens[0]).toBe(tokens[0]);
    expect(expression.tokens[1]).toBe(tokens[1]);
    expect(ConstantExpression.parse([], textType, 7).start).toBe(7);
  });
});
