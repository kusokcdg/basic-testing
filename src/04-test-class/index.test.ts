jest.mock('lodash', () => ({
  random: jest.fn(),
}));

import { getBankAccount, InsufficientFundsError, TransferFailedError, SynchronizationFailedError } from '.';
import { random } from 'lodash';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(5);
    expect(bankAccount.constructor.name).toBe('BankAccount');
    expect(bankAccount.getBalance()).toBe(5);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bankAccount = getBankAccount(5);
    expect(() => bankAccount.withdraw(6)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const bankAccount = getBankAccount(5);
    const recipientAccount = getBankAccount(0);
    expect(() => bankAccount.transfer(6, recipientAccount)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(5);
    expect(() => bankAccount.transfer(5, bankAccount)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(5);
    expect(bankAccount.deposit(5).getBalance()).toBe(10);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(5);
    expect(bankAccount.withdraw(2).getBalance()).toBe(3);
  });

  test('should transfer money', () => {
    const bankAccount = getBankAccount(5);
    const recipientAccount = getBankAccount(0);
    expect(bankAccount.transfer(2, recipientAccount).getBalance()).toBe(3);
    expect(recipientAccount.getBalance()).toBe(2);
  });

  afterEach(() => { jest.restoreAllMocks() });

  test('fetchBalance should return number in case if request did not failed', async () => {
    (random as jest.Mock).mockReturnValue(100);
    const bankAccount = getBankAccount(5);
    await expect(typeof await bankAccount.fetchBalance()).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount = getBankAccount(5);
    const spy = jest.spyOn(bankAccount, 'fetchBalance').mockImplementation(() => Promise.resolve(3));
    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(3);
    expect(spy).toHaveBeenCalled();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(5);
    const spy = jest.spyOn(bankAccount, 'fetchBalance').mockImplementation(() => Promise.resolve(null));
    await expect(async () => await bankAccount.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
    expect(spy).toHaveBeenCalled();
  });
});
