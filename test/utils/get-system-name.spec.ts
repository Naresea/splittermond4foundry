import {getSystemNameImpl} from '../../src/utils/get-system-name';
import {describe, it} from 'mocha';
import {expect} from 'chai';

describe('getSystemName', () => {
    it('should return the name of the system', () => {
        const game = {
            system: {
                data: {
                    name: 'My fancy name'
                }
            }
        };
        expect(getSystemNameImpl(game as any)).to.equal('My fancy name');
    })
});
