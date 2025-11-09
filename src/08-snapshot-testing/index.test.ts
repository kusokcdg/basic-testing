import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const linkedList = generateLinkedList(['value1', 'value2', 'value3']);
    const sample = {
      next: {
        next: {
          next: {
            next: null,
            value: null,
          },
          value: 'value3',
        },
        value: 'value2',
      },
      value: 'value1',
    };
    expect(linkedList).toStrictEqual(sample);
  });

  test('should generate linked list from values 2', () => {
    const linkedList = generateLinkedList(['value1', 'value2', 'value3']);
    expect(linkedList).toMatchSnapshot();
  });
});
