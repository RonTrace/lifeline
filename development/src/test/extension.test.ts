import * as assert from 'assert';
import * as vscode from 'vscode';
import { lifeLine } from '../extension';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Sample test', () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });

    test('LifeLine function exists', () => {
        assert.strictEqual(typeof lifeLine, 'function');
    });
});
